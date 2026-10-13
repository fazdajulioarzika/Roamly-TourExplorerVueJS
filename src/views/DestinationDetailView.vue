<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import DestinationPhoto from "@/components/DestinationPhoto.vue";
import AddToTrip from "@/components/AddToTrip.vue";
import WeatherPreview from "@/components/WeatherPreview.vue";
import { getDestination } from "@/services/geocoding";
import { useFavorites } from "@/stores/favorites";
import type { Destination } from "@/types";
import DestinationMap from "@/components/DestinationMap.vue";
import { setTitle } from "@/utils/title";
const route = useRoute();
const fav = useFavorites();
const dest = ref<Destination | null>(null);
const state = ref<"loading" | "ok" | "missing">("loading");
watch(
  () => route.params.id,
  async (id) => {
    state.value = "loading";
    try {
      dest.value = await getDestination(String(id));
      state.value = dest.value ? "ok" : "missing";
      if (dest.value) setTitle(dest.value.name);
    } catch {
      state.value = "missing";
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
    <p v-if="state === 'loading'" class="text-muted">Loading…</p>
    <div v-else-if="state === 'missing' || !dest">
      <p>Destination not found.</p>
      <RouterLink to="/" class="text-primary underline"
        >Back to Home</RouterLink
      >
    </div>
    <template v-else>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold lg:text-5xl">{{ dest.name }}</h1>
          <p class="mt-1 text-muted">
            {{ dest.country }} · {{ dest.latitude.toFixed(3) }},
            {{ dest.longitude.toFixed(3) }}
          </p>
        </div>
        <button
          type="button"
          class="rounded-control border border-line px-4 py-2.5 font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary"
          :aria-pressed="fav.has(dest.id)"
          @click="fav.toggle(dest)"
        >
          {{ fav.has(dest.id) ? "Saved ✓" : "Save to favorites" }}
        </button>
      </div>
      <DestinationPhoto
        class="mt-6 h-56 rounded-card sm:h-72"
        :name="dest.name"
        :gradient="dest.gradient"
        :alt="`${dest.name}, ${dest.country}`"
      />
      <AddToTrip class="mt-6" :destination="dest" />
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WeatherPreview :destination="dest" full />
        <DestinationMap
          class="h-80 w-full"
          :latitude="dest.latitude"
          :longitude="dest.longitude"
          :name="dest.name"
        />
      </div>
    </template>
  </div>
</template>
