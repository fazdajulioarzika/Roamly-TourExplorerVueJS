import { it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import HeroSearch from "./HeroSearch.vue";
import { searchCities } from "@/services/geocoding";

vi.mock("@/services/geocoding", () => ({
  searchCities: vi.fn().mockResolvedValue([]),
}));
beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
});
afterEach(() => vi.useRealTimers());

it("debounces and requires 2+ characters", async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div/>" } },
      { path: "/explore", component: { template: "<div/>" } },
    ],
  });
  const input = mount(HeroSearch, { global: { plugins: [router] } }).get(
    "input"
  );

  await input.setValue("k");
  vi.advanceTimersByTime(500);
  expect(searchCities).not.toHaveBeenCalled();

  await input.setValue("ky");
  await input.setValue("kyo");
  vi.advanceTimersByTime(299);
  expect(searchCities).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(searchCities).toHaveBeenCalledTimes(1);
  expect(searchCities).toHaveBeenCalledWith("kyo", expect.anything());
});
