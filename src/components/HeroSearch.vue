<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { MapPin, Search } from "lucide-vue-next";
import { searchCities } from "@/services/geocoding";
import type { Destination } from "@/types";
import { placeLabel } from "@/utils/place";
const router = useRouter();
const q = ref("");
const results = ref<Destination[]>([]);
const active = ref(-1);
const open = ref(false);
const status = ref<"idle" | "loading" | "success" | "error">("idle");
let timer: ReturnType<typeof setTimeout>;
let ctrl: AbortController | null = null;
async function run() {
  ctrl?.abort();
  ctrl = new AbortController();
  status.value = "loading";
  try {
    results.value = await searchCities(q.value.trim(), ctrl.signal);
    status.value = "success";
    active.value = -1;
  } catch (e) {
    if ((e as Error).name !== "AbortError") status.value = "error";
  }
}
watch(q, (v) => {
  clearTimeout(timer);
  if (v.trim().length < 2) {
    results.value = [];
    status.value = "idle";
    open.value = false;
    return;
  }
  open.value = true;
  timer = setTimeout(run, 300);
});
function pick(d: Destination) {
  open.value = false;
  router.push(`/destination/${d.id}`);
}
function submit() {
  if (active.value >= 0 && results.value[active.value])
    return pick(results.value[active.value]);
  if (q.value.trim())
    router.push({ path: "/explore", query: { q: q.value.trim() } });
}
function key(e: KeyboardEvent) {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    active.value = Math.min(active.value + 1, results.value.length - 1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    active.value = Math.max(active.value - 1, 0);
  } else if (e.key === "Escape") open.value = false;
}
</script>
<template>
  <div class="relative">
    <form
      class="flex h-16 items-center gap-2 rounded-2xl border border-line bg-white px-3 shadow-sm focus-within:ring-2 focus-within:ring-primary sm:h-[72px]"
      role="search"
      @submit.prevent="submit"
    >
      <MapPin class="text-primary" :size="22" aria-hidden="true" />
      <input
        v-model="q"
        type="text"
        role="combobox"
        aria-label="Search destinations"
        aria-autocomplete="list"
        :aria-expanded="open"
        aria-controls="search-list"
        :aria-activedescendant="active >= 0 ? `opt-${active}` : undefined"
        placeholder="Search a city, e.g. Kyoto"
        class="min-w-0 flex-1 bg-transparent px-1 text-base outline-none placeholder:text-muted"
        @keydown="key"
      />
      <button
        type="submit"
        class="flex items-center gap-2 rounded-control bg-primary px-4 py-3 font-semibold text-white transition hover:bg-blue-700 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Search :size="18" aria-hidden="true" />Explore
      </button>
    </form>
    <div
      v-if="open"
      class="absolute z-30 mt-2 w-full rounded-2xl border border-line bg-white p-2 shadow-lg"
    >
      <p v-if="status === 'loading'" class="p-3 text-sm text-muted">
        Searching…
      </p>
      <div
        v-else-if="status === 'error'"
        class="p-3 text-sm text-danger"
        role="alert"
      >
        Couldn't load results.
        <button class="font-semibold underline" type="button" @click="run">
          Retry
        </button>
      </div>
      <p
        v-else-if="status === 'success' && !results.length"
        class="p-3 text-sm text-muted"
      >
        No places found for “{{ q }}”.
      </p>
      <ul v-else id="search-list" role="listbox" aria-label="Suggestions">
        <li
          v-for="(d, i) in results"
          :id="`opt-${i}`"
          :key="d.id"
          role="option"
          :aria-selected="i === active"
          class="cursor-pointer rounded-lg px-3 py-2.5"
          :class="i === active ? 'bg-soft' : 'hover:bg-soft'"
          @mousedown.prevent="pick(d)"
        >
          <span class="font-medium">{{ d.name }}</span>
          <span class="block text-sm text-muted">{{ placeLabel(d) }}</span>
        </li>
      </ul>
    </div>
    <p class="mt-3 text-sm text-muted">
      Try:
      <RouterLink
        v-for="s in ['Kyoto', 'Lisbon', 'Bali']"
        :key="s"
        :to="{ path: '/explore', query: { q: s } }"
        class="mr-2 text-primary underline"
        >{{ s }}</RouterLink
      >
    </p>
  </div>
</template>
