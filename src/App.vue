<script setup lang="ts">
import AppNavbar from "@/components/AppNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";
import { useFavorites } from "@/stores/favorites";
import { useTrips } from "@/stores/trips";
const fav = useFavorites();
const trips = useTrips();
</script>
<template>
  <div class="flex min-h-screen flex-col">
    <AppNavbar />
    <main class="flex-1"><RouterView /></main>
    <AppFooter />
    <div
      role="status"
      aria-live="polite"
      class="pointer-events-none fixed bottom-5 left-1/2 -translate-x-1/2"
    >
      <p
        v-if="fav.toast || trips.toast"
        class="rounded-control bg-heading px-4 py-2 text-sm text-white shadow-lg"
      >
        {{ fav.toast || trips.toast }}
      </p>
    </div>
  </div>
</template>
