import { it, expect, vi, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
  vi.stubEnv("VITE_UNSPLASH_ACCESS_KEY", "k");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const ok = {
  ok: true,
  status: 200,
  json: async () => ({
    results: [
      {
        urls: { regular: "https://img/x.jpg" },
        user: { name: "Ann", links: { html: "https://unsplash.com/@ann" } },
      },
    ],
  }),
};

it("returns photographer data and caches in localStorage", async () => {
  const f = vi.fn().mockResolvedValue(ok);
  vi.stubGlobal("fetch", f);
  const { getPhoto } = await import("./photos");
  expect(await getPhoto("Kyoto")).toMatchObject({
    url: "https://img/x.jpg",
    author: "Ann",
  });

  vi.resetModules(); // simulasi refresh halaman
  const again = await import("./photos");
  expect((await again.getPhoto("Kyoto"))?.author).toBe("Ann");
  expect(f).toHaveBeenCalledTimes(1);
});

it("stops requesting after rate limit", async () => {
  const f = vi
    .fn()
    .mockResolvedValue({ ok: false, status: 403, json: async () => ({}) });
  vi.stubGlobal("fetch", f);
  const { getPhoto } = await import("./photos");
  expect(await getPhoto("A")).toBeNull();
  expect(await getPhoto("B")).toBeNull();
  expect(f).toHaveBeenCalledTimes(1);
});
