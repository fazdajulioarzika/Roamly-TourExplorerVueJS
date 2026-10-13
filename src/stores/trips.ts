import { defineStore } from "pinia";
import type { Destination, ItineraryItem, Trip, TripDay } from "@/types";
const KEY = "roamly:trips";
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();
function read(): Trip[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
export const useTrips = defineStore("trips", {
  state: () => ({ trips: read() as Trip[], toast: "" }),
  getters: { byId: (s) => (id: string) => s.trips.find((t) => t.id === id) },
  actions: {
    save(msg?: string) {
      try {
        localStorage.setItem(KEY, JSON.stringify(this.trips));
      } catch {
        /* storage unavailable */
      }
      if (msg) {
        this.toast = msg;
        setTimeout(() => (this.toast = ""), 2000);
      }
    },
    touch(t: Trip, msg?: string) {
      t.updatedAt = now();
      this.save(msg);
    },
    createTrip(title: string, startDate?: string, endDate?: string) {
      const t: Trip = {
        id: uid(),
        title: title.trim(),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        createdAt: now(),
        updatedAt: now(),
        days: [],
      };
      this.addDay(t);
      this.trips.unshift(t);
      this.save("Trip created");
      return t.id;
    },
    deleteTrip(id: string) {
      this.trips = this.trips.filter((t) => t.id !== id);
      this.save("Trip deleted");
    },
    addDay(t: Trip) {
      t.days.push({
        id: uid(),
        tripId: t.id,
        dayIndex: t.days.length + 1,
        items: [],
      });
      this.touch(t);
    },
    removeDay(t: Trip, dayId: string) {
      t.days = t.days
        .filter((d) => d.id !== dayId)
        .map((d, i) => ({ ...d, dayIndex: i + 1 }));
      this.touch(t, "Day removed");
    },
    addItem(
      t: Trip,
      day: TripDay,
      data: Pick<
        ItineraryItem,
        "title" | "notes" | "startTime" | "destinationId"
      >
    ) {
      day.items.push({ id: uid(), ...data, order: day.items.length });
      this.touch(t, "Item added");
    },
    removeItem(t: Trip, day: TripDay, id: string) {
      day.items = day.items
        .filter((i) => i.id !== id)
        .map((i, n) => ({ ...i, order: n }));
      this.touch(t, "Item removed");
    },
    moveItem(t: Trip, day: TripDay, index: number, dir: -1 | 1) {
      const j = index + dir;
      if (j < 0 || j >= day.items.length) return;
      const a = day.items;
      [a[index], a[j]] = [a[j], a[index]];
      a.forEach((i, n) => (i.order = n));
      this.touch(t);
    },
    updateTrip(
      t: Trip,
      d: { title: string; startDate?: string; endDate?: string }
    ) {
      t.title = d.title.trim() || t.title;
      t.startDate = d.startDate || undefined;
      t.endDate = d.endDate || undefined;
      this.touch(t, "Trip updated");
    },
    updateItem(
      t: Trip,
      item: ItineraryItem,
      d: { title: string; startTime?: string; notes?: string }
    ) {
      item.title = d.title.trim() || item.title;
      item.startTime = d.startTime || undefined;
      item.notes = d.notes?.trim() || undefined;
      this.touch(t, "Item updated");
    },
    addDestination(tripId: string, d: Destination) {
      const t = this.byId(tripId);
      if (!t) return;
      if (!t.days.length) this.addDay(t);
      this.addItem(t, t.days[t.days.length - 1], {
        title: d.name,
        destinationId: d.id,
      });
    },
  },
});
