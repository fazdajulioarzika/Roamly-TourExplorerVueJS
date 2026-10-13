import { it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import WeatherPreview from "./WeatherPreview.vue";
import { getWeather } from "@/services/weather";

vi.mock("@/services/weather", async (orig) => ({
  ...(await orig<typeof import("@/services/weather")>()),
  getWeather: vi.fn(),
}));

const destination = {
  id: "kyoto",
  name: "Kyoto",
  country: "Japan",
  latitude: 35,
  longitude: 135,
};

it("shows an error with retry, then recovers", async () => {
  vi.mocked(getWeather)
    .mockRejectedValueOnce(new Error("network"))
    .mockResolvedValueOnce({
      temperature: 20,
      weatherCode: 0,
      unit: "°C",
      daily: [],
    });

  const w = mount(WeatherPreview, { props: { destination } });
  await flushPromises();
  expect(w.text()).toContain("currently unavailable");

  await w.get("button").trigger("click");
  await flushPromises();
  expect(w.text()).toContain("20°C");
  expect(w.text()).not.toContain("currently unavailable");
});
