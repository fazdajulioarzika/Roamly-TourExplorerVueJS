<script setup lang="ts">
import DestinationCard from "@/components/DestinationCard.vue";
import { useFavorites } from "@/stores/favorites";
const fav = useFavorites();
</script>
<template>
  <div class="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold">Saved places</h1>
    <p class="mt-1 text-sm text-muted">Stored locally in this browser only.</p>
    <div
      v-if="!fav.items.length"
      class="mt-8 rounded-card bg-soft p-8 text-center"
    >
      <p>No saved places yet.</p>
      <RouterLink
        to="/explore"
        class="mt-2 inline-block font-semibold text-primary"
        >Explore destinations</RouterLink
      >
    </div>
    <div v-else class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <DestinationCard v-for="d in fav.items" :key="d.id" :destination="d" />
    </div>
  </div>
</template>
