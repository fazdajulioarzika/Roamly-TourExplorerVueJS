import { it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useTrips } from "./trips";

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});

it("creates a trip with Day 1 and reorders items", () => {
  const s = useTrips();
  const id = s.createTrip("Japan");
  const t = s.byId(id)!;
  expect(t.days).toHaveLength(1);
  s.addItem(t, t.days[0], { title: "A" });
  s.addItem(t, t.days[0], { title: "B" });
  s.moveItem(t, t.days[0], 0, 1);
  expect(t.days[0].items.map((i) => i.title)).toEqual(["B", "A"]);
  expect(t.days[0].items.map((i) => i.order)).toEqual([0, 1]);
});
it("persists and hydrates", () => {
  const s = useTrips();
  s.createTrip("Bali");
  setActivePinia(createPinia());
  expect(useTrips().trips[0].title).toBe("Bali");
});
it("survives corrupted storage", () => {
  localStorage.setItem("roamly:trips", "{bad");
  setActivePinia(createPinia());
  expect(useTrips().trips).toEqual([]);
});
it("updates trip and item", () => {
  const s = useTrips();
  const t = s.byId(s.createTrip("Old"))!;
  s.updateTrip(t, { title: "New", startDate: "2026-12-01" });
  expect(t.title).toBe("New");
  expect(t.startDate).toBe("2026-12-01");
  s.addItem(t, t.days[0], { title: "A" });
  s.updateItem(t, t.days[0].items[0], { title: "B", notes: " hi " });
  expect(t.days[0].items[0]).toMatchObject({ title: "B", notes: "hi" });
});
