import type { Destination } from "@/types";
import { curated } from "@/data/destinations";
import { fetchWithTimeout } from "@/utils/http";
const BASE = "https://geocoding-api.open-meteo.com/v1";
function map(r: any): Destination | null {
  if (
    !r ||
    typeof r.id !== "number" ||
    typeof r.latitude !== "number" ||
    typeof r.longitude !== "number" ||
    !r.name
  )
    return null;
  const parts = [r.admin2, r.admin1].filter(
    (p: unknown): p is string => typeof p === "string" && !!p && p !== r.name
  );
  return {
    id: String(r.id),
    name: r.name,
    country: r.country ?? "",
    region: [...new Set(parts)].join(", ") || undefined,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  };
}
export async function searchCities(
  q: string,
  signal?: AbortSignal
): Promise<Destination[]> {
  const res = await fetchWithTimeout(
    `${BASE}/search?name=${encodeURIComponent(
      q
    )}&count=6&language=en&format=json`,
    { signal }
  );
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const json = await res.json();
  return (Array.isArray(json.results) ? json.results : [])
    .map(map)
    .filter((d: Destination | null): d is Destination => !!d);
}
export async function getDestination(id: string): Promise<Destination | null> {
  const local = curated.find((d) => d.id === id);
  if (local) return local;
  const res = await fetchWithTimeout(
    `${BASE}/get?id=${encodeURIComponent(id)}`
  );
  if (!res.ok) return null;
  return map(await res.json());
}
