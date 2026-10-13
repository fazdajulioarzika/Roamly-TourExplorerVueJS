import { it, expect, vi, beforeEach, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useFavorites } from "./favorites";
import { useTrips } from "./trips";

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});
afterEach(() => vi.restoreAllMocks());

const d = {
  id: "kyoto",
  name: "Kyoto",
  country: "Japan",
  latitude: 1,
  longitude: 1,
};

it("favorites keep working in memory when writing storage fails", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota");
  });
  const s = useFavorites();
  expect(() => s.toggle(d)).not.toThrow();
  expect(s.has("kyoto")).toBe(true);
});

it("trips keep working in memory when writing storage fails", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota");
  });
  const s = useTrips();
  expect(() => s.createTrip("Japan")).not.toThrow();
  expect(s.trips).toHaveLength(1);
});

it("stores start empty when reading storage throws", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("denied");
  });
  setActivePinia(createPinia());
  expect(useFavorites().items).toEqual([]);
  expect(useTrips().trips).toEqual([]);
});
