<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ExploreCategories from "@/components/ExploreCategories.vue";
import DestinationCard from "@/components/DestinationCard.vue";
import SkeletonCard from "@/components/SkeletonCard.vue";
import { curated } from "@/data/destinations";
import { searchCities } from "@/services/geocoding";
import type { Destination } from "@/types";

const route = useRoute();
const router = useRouter();
const q = computed(() => String(route.query.q ?? ""));
const sort = computed({
  get: () => String(route.query.sort ?? ""),
  set: (v) =>
    router.replace({ query: { ...route.query, sort: v || undefined } }),
});
const cat = computed({
  get: () => String(route.query.category ?? ""),
  set: (v) =>
    router.replace({ query: { ...route.query, category: v || undefined } }),
});
const searching = computed(() => q.value.length >= 2);

const found = ref<Destination[]>([]);
const status = ref<"idle" | "loading" | "error">("idle");
let ctrl: AbortController | null = null;
async function load() {
  if (!searching.value) {
    found.value = [];
    status.value = "idle";
    return;
  }
  ctrl?.abort();
  ctrl = new AbortController();
  status.value = "loading";
  try {
    found.value = await searchCities(q.value, ctrl.signal);
    status.value = "idle";
  } catch (e) {
    if ((e as Error).name !== "AbortError") status.value = "error";
  }
}
watch(q, load, { immediate: true });

const list = computed(() => {
  const base = searching.value
    ? found.value
    : curated.filter((d) => !cat.value || d.categories?.includes(cat.value));
  if (sort.value === "az")
    return [...base].sort((a, b) => a.name.localeCompare(b.name));
  if (sort.value === "za")
    return [...base].sort((a, b) => b.name.localeCompare(a.name));
  return base;
});
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold">
      {{ searching ? `Results for “${q}”` : "Explore destinations" }}
    </h1>

    <div class="my-6 flex flex-wrap items-center justify-between gap-4">
      <ExploreCategories v-if="!searching" v-model="cat" />
      <p v-else class="text-sm text-muted">
        Categories apply to curated destinations only.
      </p>
      <div class="flex items-center gap-2">
        <label for="sort" class="text-sm text-muted">Sort</label>
        <select
          id="sort"
          v-model="sort"
          class="rounded-control border border-line bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">Default</option>
          <option value="az">Name A–Z</option>
          <option value="za">Name Z–A</option>
        </select>
      </div>
    </div>

    <div
      v-if="status === 'loading'"
      class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      role="status"
      aria-label="Searching"
    >
      <SkeletonCard v-for="n in 4" :key="n" />
    </div>
    <div
      v-else-if="status === 'error'"
      role="alert"
      class="rounded-card bg-soft p-6 text-danger"
    >
      Search failed or timed out.
      <button type="button" class="font-semibold underline" @click="load">
        Retry
      </button>
    </div>
    <p v-else-if="!list.length" class="rounded-card bg-soft p-6 text-muted">
      No destinations found.
    </p>
    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <DestinationCard v-for="d in list" :key="d.id" :destination="d" />
    </div>
  </div>
</template>
