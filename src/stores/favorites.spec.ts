import { it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useFavorites } from "./favorites";

const d = {
  id: "kyoto",
  name: "Kyoto",
  country: "Japan",
  latitude: 1,
  longitude: 1,
};
beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});

it("toggles and persists", () => {
  const s = useFavorites();
  s.toggle(d);
  expect(s.has("kyoto")).toBe(true);
  expect(JSON.parse(localStorage.getItem("roamly:favorites")!)).toHaveLength(1);
  setActivePinia(createPinia());
  expect(useFavorites().has("kyoto")).toBe(true); // hydration
  useFavorites().toggle(d);
  expect(useFavorites().has("kyoto")).toBe(false);
});
it("survives corrupted storage", () => {
  localStorage.setItem("roamly:favorites", "{bad");
  setActivePinia(createPinia());
  expect(useFavorites().items).toEqual([]);
});
