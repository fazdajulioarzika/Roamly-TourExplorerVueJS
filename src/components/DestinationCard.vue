<script setup lang="ts">
import { Heart } from "lucide-vue-next";
import DestinationPhoto from "./DestinationPhoto.vue";
import { useFavorites } from "@/stores/favorites";
import { placeLabel } from "@/utils/place";
import type { Destination } from "@/types";
defineProps<{ destination: Destination }>();
const fav = useFavorites();
</script>
<template>
  <article
    class="group relative overflow-hidden rounded-card border border-line bg-white transition focus-within:ring-2 focus-within:ring-primary hover:shadow-md"
  >
    <DestinationPhoto
      class="aspect-[4/3]"
      :name="destination.name"
      :query="`${destination.name} ${destination.country}`"
      :gradient="destination.gradient"
      :alt="`${destination.name}, ${placeLabel(destination)}`"
    />
    <div class="p-4">
      <h3 class="text-lg font-semibold">
        <RouterLink
          :to="`/destination/${destination.id}`"
          class="outline-none after:absolute after:inset-0"
          >{{ destination.name }}</RouterLink
        >
      </h3>
      <p class="line-clamp-2 text-sm text-muted">
        {{ placeLabel(destination) }}
      </p>
    </div>
    <button
      type="button"
      class="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 outline-none focus-visible:ring-2 focus-visible:ring-primary"
      :aria-pressed="fav.has(destination.id)"
      :aria-label="`${fav.has(destination.id) ? 'Remove' : 'Save'} ${
        destination.name
      } ${fav.has(destination.id) ? 'from' : 'to'} favorites`"
      @click="fav.toggle(destination)"
    >
      <Heart
        :size="20"
        :class="
          fav.has(destination.id) ? 'fill-danger text-danger' : 'text-heading'
        "
      />
    </button>
  </article>
</template>
