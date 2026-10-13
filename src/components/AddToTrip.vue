<script setup lang="ts">
import { ref } from "vue";
import { useTrips } from "@/stores/trips";
import type { Destination } from "@/types";
const props = defineProps<{ destination: Destination }>();
const trips = useTrips();
const sel = ref("");
function add() {
  if (sel.value) trips.addDestination(sel.value, props.destination);
}
</script>
<template>
  <div class="flex flex-wrap items-center gap-3 rounded-card bg-soft p-4">
    <template v-if="trips.trips.length">
      <label for="trip-select" class="text-sm font-medium"
        >Add to itinerary</label
      >
      <select
        id="trip-select"
        v-model="sel"
        class="rounded-control border border-line bg-white px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <option value="" disabled>Choose a trip</option>
        <option v-for="t in trips.trips" :key="t.id" :value="t.id">
          {{ t.title }}
        </option>
      </select>
      <button
        type="button"
        :disabled="!sel"
        class="rounded-control bg-primary px-4 py-2 font-semibold text-white outline-none hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
        @click="add"
      >
        Add
      </button>
    </template>
    <p v-else class="text-sm text-muted">
      No trips yet.
      <RouterLink to="/trips" class="font-semibold text-primary underline"
        >Create one</RouterLink
      >
      to add this place.
    </p>
  </div>
</template>
