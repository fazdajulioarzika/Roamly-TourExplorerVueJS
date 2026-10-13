<script setup lang="ts">
import { computed } from "vue";
import { useWeather } from "@/composables/useWeather";
import { describeCode } from "@/services/weather";
import type { Destination } from "@/types";
const props = defineProps<{ destination: Destination; full?: boolean }>();
const { data, status, retry } = useWeather(
  computed(() => ({
    lat: props.destination.latitude,
    lon: props.destination.longitude,
  }))
);
const day = (d: string) =>
  new Date(d).toLocaleDateString("en", { weekday: "short" });
</script>
<template>
  <section
    class="rounded-card border border-line bg-white p-5"
    :aria-label="`Weather in ${destination.name}`"
  >
    <p class="text-sm text-muted">
      {{ destination.name }}, {{ destination.country }}
    </p>
    <div
      v-if="status === 'loading'"
      class="mt-3 animate-pulse space-y-3"
      role="status"
      aria-label="Loading weather"
    >
      <div class="h-10 w-24 rounded bg-soft" />
      <div class="h-4 w-40 rounded bg-soft" />
      <div class="h-16 rounded bg-soft" />
    </div>
    <div v-else-if="status === 'error'" role="alert" class="mt-3 text-sm">
      <p class="text-danger">Weather is currently unavailable.</p>
      <button
        type="button"
        class="mt-2 font-semibold text-primary underline"
        @click="retry"
      >
        Retry
      </button>
    </div>
    <template v-else-if="data">
      <p class="mt-2 text-4xl font-bold">
        {{ Math.round(data.temperature) }}{{ data.unit }}
      </p>
      <p class="text-muted">
        {{ describeCode(data.weatherCode)
        }}<span v-if="data.windSpeed"> · wind {{ data.windSpeed }} km/h</span>
      </p>
      <ul
        class="mt-4 grid grid-cols-3 gap-2 text-center text-sm"
        :class="full && 'sm:grid-cols-5'"
      >
        <li
          v-for="d in data.daily.slice(0, full ? 5 : 3)"
          :key="d.date"
          class="rounded-lg bg-soft p-2"
        >
          <p class="text-muted">{{ day(d.date) }}</p>
          <p class="font-semibold">{{ Math.round(d.max) }}°</p>
          <p class="text-muted">{{ Math.round(d.min) }}°</p>
        </li>
      </ul>
      <p v-if="data.observedAt" class="mt-3 text-xs text-muted">
        Live from Open-Meteo · updated {{ data.observedAt.replace("T", " ") }}
      </p>
    </template>
  </section>
</template>
