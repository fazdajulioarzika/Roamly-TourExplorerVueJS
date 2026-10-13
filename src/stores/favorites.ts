import { defineStore } from "pinia";
import type { Destination } from "@/types";
const KEY = "roamly:favorites";
function read(): Destination[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
export const useFavorites = defineStore("favorites", {
  state: () => ({ items: read() as Destination[], toast: "" }),
  getters: { has: (s) => (id: string) => s.items.some((d) => d.id === id) },
  actions: {
    toggle(d: Destination) {
      const on = this.has(d.id);
      this.items = on
        ? this.items.filter((x) => x.id !== d.id)
        : [...this.items, d];
      try {
        localStorage.setItem(KEY, JSON.stringify(this.items));
      } catch {
        /* storage unavailable */
      }
      this.toast = on ? `${d.name} removed from saved` : `${d.name} saved`;
      setTimeout(() => (this.toast = ""), 2000);
    },
  },
});
