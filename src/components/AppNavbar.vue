<script setup lang="ts">
import { ref } from "vue";
import { Compass, Menu, X } from "lucide-vue-next";
const open = ref(false);
const links = [
  { to: "/", label: "Discover" },
  { to: "/explore", label: "Explore" },
  { to: "/trips", label: "My Trips" },
  { to: "/saved", label: "Saved" },
];
const cls =
  "rounded-md px-3 py-2 text-sm font-medium text-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-primary outline-none";
</script>
<template>
  <header
    class="sticky top-0 z-40 border-b border-line bg-white"
    @keydown.esc="open = false"
  >
    <div
      class="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8"
    >
      <RouterLink
        to="/"
        class="flex items-center gap-2 text-xl font-bold text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
        ><Compass :size="24" aria-hidden="true" />Roamly</RouterLink
      >
      <nav aria-label="Main" class="hidden items-center gap-1 md:flex">
        <RouterLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          :class="cls"
          exact-active-class="!text-primary !font-semibold"
          >{{ l.label }}</RouterLink
        >
        <RouterLink
          to="/trips"
          class="ml-3 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >Plan a trip</RouterLink
        >
      </nav>
      <button
        class="rounded-md p-2 outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        aria-label="Toggle menu"
        @click="open = !open"
      >
        <X v-if="open" /><Menu v-else />
      </button>
    </div>
    <nav
      v-if="open"
      id="mobile-nav"
      aria-label="Mobile"
      class="flex flex-col gap-1 border-t border-line bg-white px-5 py-3 md:hidden"
      @click="open = false"
    >
      <RouterLink v-for="l in links" :key="l.to" :to="l.to" :class="cls">{{
        l.label
      }}</RouterLink>
      <RouterLink
        to="/trips"
        class="mt-2 rounded-control bg-primary px-4 py-3 text-center font-semibold text-white"
        >Plan a trip</RouterLink
      >
    </nav>
  </header>
</template>
