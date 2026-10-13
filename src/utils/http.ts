// fetch dengan batas waktu. Timeout menghasilkan TimeoutError (ditampilkan sebagai error + retry),
// sedangkan pembatalan oleh pemanggil tetap AbortError (diabaikan).
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  ms = 8000
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(
    () => ctrl.abort(new DOMException("Request timed out", "TimeoutError")),
    ms
  );
  const outer = init.signal;
  if (outer) {
    if (outer.aborted) ctrl.abort(outer.reason);
    else
      outer.addEventListener("abort", () => ctrl.abort(outer.reason), {
        once: true,
      });
  }
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}
