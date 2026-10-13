import { it, expect, vi, afterEach } from "vitest";
import { fetchWithTimeout } from "./http";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

// fetch palsu yang menggantung sampai di-abort
const hanging = () =>
  vi.fn(
    (_u: string, init: RequestInit) =>
      new Promise((_res, rej) => {
        init.signal!.addEventListener("abort", () => rej(init.signal!.reason));
      })
  );

it("rejects with TimeoutError after the limit", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", hanging());
  const p = fetchWithTimeout("https://x", {}, 1000);
  const assertion = expect(p).rejects.toMatchObject({ name: "TimeoutError" });
  await vi.advanceTimersByTimeAsync(1000);
  await assertion;
});

it("keeps caller abort as AbortError", async () => {
  vi.stubGlobal("fetch", hanging());
  const c = new AbortController();
  const p = fetchWithTimeout("https://x", { signal: c.signal }, 5000);
  c.abort();
  await expect(p).rejects.toMatchObject({ name: "AbortError" });
});
