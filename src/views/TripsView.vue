<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { Trash2 } from "lucide-vue-next";
import { useTrips } from "@/stores/trips";
const trips = useTrips();
const router = useRouter();
const f = reactive({ title: "", start: "", end: "" });
const input =
  "rounded-control border border-line px-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary";
function create() {
  if (!f.title.trim()) return;
  const id = trips.createTrip(f.title, f.start, f.end);
  f.title = f.start = f.end = "";
  router.push(`/trips/${id}`);
}
function remove(id: string, title: string) {
  if (confirm(`Delete “${title}”?`)) trips.deleteTrip(id);
}
</script>
<template>
  <div class="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold">My Trips</h1>
    <p class="mt-1 text-sm text-muted">Stored locally in this browser only.</p>
    <form
      class="mt-6 grid gap-3 rounded-card bg-soft p-5 md:grid-cols-[2fr_1fr_1fr_auto]"
      @submit.prevent="create"
    >
      <input
        v-model="f.title"
        :class="input"
        aria-label="Trip title"
        placeholder="Trip title (e.g. Japan in spring)"
        required
      />
      <input
        v-model="f.start"
        type="date"
        :class="input"
        aria-label="Start date"
      />
      <input
        v-model="f.end"
        type="date"
        :min="f.start || undefined"
        :class="input"
        aria-label="End date"
      />
      <button
        type="submit"
        class="rounded-control bg-primary px-5 py-2.5 font-semibold text-white outline-none hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Create trip
      </button>
    </form>
    <p
      v-if="!trips.trips.length"
      class="mt-8 rounded-card border border-dashed border-line p-8 text-center text-muted"
    >
      No trips yet. Create your first one above.
    </p>
    <ul v-else class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="t in trips.trips"
        :key="t.id"
        class="flex items-start justify-between rounded-card border border-line p-5"
      >
        <RouterLink
          :to="`/trips/${t.id}`"
          class="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <h2 class="text-lg font-semibold">{{ t.title }}</h2>
          <p class="text-sm text-muted">
            {{ t.days.length }} day(s) ·
            {{ t.days.reduce((n, d) => n + d.items.length, 0) }} item(s)
          </p>
          <p v-if="t.startDate" class="text-sm text-muted">
            {{ t.startDate }}<span v-if="t.endDate"> → {{ t.endDate }}</span>
          </p>
        </RouterLink>
        <button
          type="button"
          class="grid h-11 w-11 place-items-center rounded-full text-danger outline-none hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-primary"
          :aria-label="`Delete trip ${t.title}`"
          @click="remove(t.id, t.title)"
        >
          <Trash2 :size="18" />
        </button>
      </li>
    </ul>
  </div>
</template>
