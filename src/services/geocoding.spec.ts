import { it, expect, vi, afterEach } from "vitest";
import { searchCities } from "./geocoding";

afterEach(() => vi.unstubAllGlobals());
const stub = (json: unknown) =>
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => json })
  );

it("returns [] when there are no results", async () => {
  stub({});
  expect(await searchCities("zzzz")).toEqual([]);
});
it("drops malformed entries and maps valid ones", async () => {
  stub({
    results: [
      { id: 1, name: "Kyoto", country: "Japan", latitude: 35, longitude: 135 },
      { id: "x", name: "Bad" },
    ],
  });
  const r = await searchCities("kyo");
  expect(r).toHaveLength(1);
  expect(r[0]).toMatchObject({ id: "1", name: "Kyoto", country: "Japan" });
});
