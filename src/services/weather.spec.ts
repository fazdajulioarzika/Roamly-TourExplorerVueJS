import { describe, it, expect, vi, afterEach } from "vitest";
import { getWeather, describeCode } from "./weather";

afterEach(() => vi.unstubAllGlobals());
const stub = (res: unknown) =>
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(res));

describe("getWeather", () => {
  it("maps a valid response", async () => {
    stub({
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 21.4,
          weather_code: 1,
          wind_speed_10m: 8,
          time: "2026-10-13T10:00",
        },
        current_units: { temperature_2m: "°C" },
        daily: {
          time: ["2026-10-13"],
          weather_code: [1],
          temperature_2m_max: [24],
          temperature_2m_min: [15],
        },
      }),
    });
    const w = await getWeather(35, 135);
    expect(w.temperature).toBe(21.4);
    expect(w.unit).toBe("°C");
    expect(w.daily[0]).toEqual({
      date: "2026-10-13",
      code: 1,
      max: 24,
      min: 15,
    });
  });
  it("throws on malformed response", async () => {
    stub({ ok: true, json: async () => ({ foo: 1 }) });
    await expect(getWeather(0, 0)).rejects.toThrow("Malformed");
  });
  it("throws on HTTP error", async () => {
    stub({ ok: false, status: 500 });
    await expect(getWeather(0, 0)).rejects.toThrow("500");
  });
  it("describes codes", () => {
    expect(describeCode(0)).toBe("Clear sky");
    expect(describeCode(95)).toBe("Thunderstorm");
  });
});
