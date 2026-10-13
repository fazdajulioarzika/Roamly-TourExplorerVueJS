import type { WeatherSnapshot } from "@/types";
import { fetchWithTimeout } from "@/utils/http";
export async function getWeather(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<WeatherSnapshot> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
  const res = await fetchWithTimeout(url, { signal });
  if (!res.ok) throw new Error(`Weather failed (${res.status})`);
  const j = await res.json();
  if (
    typeof j?.current?.temperature_2m !== "number" ||
    !Array.isArray(j?.daily?.time)
  )
    throw new Error("Malformed weather response");
  return {
    temperature: j.current.temperature_2m,
    weatherCode: j.current.weather_code,
    windSpeed: j.current.wind_speed_10m,
    observedAt: j.current.time,
    unit: j.current_units?.temperature_2m ?? "°C",
    daily: j.daily.time.map((d: string, i: number) => ({
      date: d,
      code: j.daily.weather_code[i],
      max: j.daily.temperature_2m_max[i],
      min: j.daily.temperature_2m_min[i],
    })),
  };
}
export function describeCode(c: number): string {
  if (c === 0) return "Clear sky";
  if (c <= 3) return "Partly cloudy";
  if (c <= 48) return "Fog";
  if (c <= 67) return "Rain";
  if (c <= 77) return "Snow";
  if (c <= 82) return "Rain showers";
  return "Thunderstorm";
}
