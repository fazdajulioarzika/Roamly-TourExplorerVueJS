<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import DestinationPhoto from "@/components/DestinationPhoto.vue";
import HeroSearch from "@/components/HeroSearch.vue";
import ExploreCategories from "@/components/ExploreCategories.vue";
import DestinationCard from "@/components/DestinationCard.vue";
import WeatherPreview from "@/components/WeatherPreview.vue";
import { curated } from "@/data/destinations";
const router = useRouter();
const cat = ref("");
watch(
  cat,
  (c) => c && router.push({ path: "/explore", query: { category: c } })
);
</script>
<template>
  <div>
    <section
      class="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20"
    >
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-primary">
          Travel explorer
        </p>
        <h1
          class="mt-3 text-[32px] font-bold leading-[1.1] sm:text-[40px] lg:text-[56px]"
        >
          Find your next escape.
        </h1>
        <p class="mt-4 max-w-lg text-base text-muted sm:text-lg">
          Discover inspiring places, explore local weather, and turn your ideas
          into a trip worth taking.
        </p>
        <div class="mt-8"><HeroSearch /></div>
      </div>
      <DestinationPhoto
        class="hidden aspect-[4/3] rounded-card lg:block"
        name="Kyoto"
        gradient="from-sky-200 via-blue-100 to-teal-100"
        alt="Kyoto, Japan"
      />
    </section>
    <section class="bg-soft py-12">
      <div class="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <h2 class="mb-5 text-2xl font-bold lg:text-3xl">Explore by mood</h2>
        <ExploreCategories v-model="cat" />
      </div>
    </section>
    <section class="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div class="mb-6 flex items-end justify-between">
        <h2 class="text-2xl font-bold lg:text-3xl">Trending destinations</h2>
        <RouterLink to="/explore" class="text-sm font-semibold text-primary"
          >View all</RouterLink
        >
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DestinationCard
          v-for="d in curated.slice(0, 4)"
          :key="d.id"
          :destination="d"
        />
      </div>
    </section>
    <section class="bg-soft py-12 lg:py-16">
      <div class="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <h2 class="mb-6 text-2xl font-bold lg:text-3xl">Weather discovery</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <WeatherPreview
            v-for="d in curated.slice(0, 3)"
            :key="d.id"
            :destination="d"
          />
        </div>
      </div>
    </section>
    <section class="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div class="rounded-card bg-primary p-8 text-white lg:p-12">
        <h2 class="text-2xl font-bold lg:text-3xl">
          Save places. Build your itinerary.
        </h2>
        <p class="mt-2 max-w-xl text-blue-100">
          Keep the destinations you love and organize them day by day.
        </p>
        <RouterLink
          to="/trips"
          class="mt-6 inline-block rounded-control bg-white px-5 py-3 font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >Start planning</RouterLink
        >
      </div>
    </section>
  </div>
</template>
