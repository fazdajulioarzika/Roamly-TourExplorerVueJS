import { ref, watch, type Ref } from "vue";
import { getWeather } from "@/services/weather";
import type { WeatherSnapshot } from "@/types";
export function useWeather(coords: Ref<{ lat: number; lon: number } | null>) {
  const data = ref<WeatherSnapshot | null>(null);
  const status = ref<"idle" | "loading" | "success" | "error">("idle");
  let ctrl: AbortController | null = null;
  async function load() {
    if (!coords.value) return;
    ctrl?.abort();
    ctrl = new AbortController();
    status.value = "loading";
    try {
      data.value = await getWeather(
        coords.value.lat,
        coords.value.lon,
        ctrl.signal
      );
      status.value = "success";
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        data.value = null;
        status.value = "error";
      }
    }
  }
  watch(coords, load, { immediate: true });
  return { data, status, retry: load };
}
