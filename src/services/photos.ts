export interface Photo {
  url: string;
  author: string;
  authorUrl: string;
}

const PREFIX = "roamly:photo:";
const TTL = 1 * 24 * 60 * 60 * 1000;
const UTM = "utm_source=roamly&utm_medium=referral";
const mem = new Map<string, Promise<Photo | null>>();
let blocked = false;

function readCache(key: string): Photo | null | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    const { t, v } = JSON.parse(raw);
    return Date.now() - t < TTL ? v : undefined;
  } catch {
    return undefined;
  }
}
function writeCache(key: string, v: Photo | null) {
  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), v }));
  } catch {
    /* storage penuh/tidak tersedia */
  }
}

async function load(title: string): Promise<Photo | null> {
  const key = PREFIX + title.toLowerCase();
  const cached = readCache(key);
  if (cached !== undefined) return cached;
  if (blocked) return null;

  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as
    | string
    | undefined;
  if (!accessKey) {
    console.error("[photos] VITE_UNSPLASH_ACCESS_KEY belum terbaca");
    return null;
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        title
      )}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );
    if (res.status === 403 || res.status === 429) {
      blocked = true;
      console.warn("[photos] Limit Unsplash tercapai");
      return null;
    }
    if (!res.ok) return null;

    const p = (await res.json())?.results?.[0];
    const photo: Photo | null =
      typeof p?.urls?.regular === "string" && p?.user?.name
        ? {
            url: p.urls.regular,
            author: p.user.name,
            authorUrl: `${p.user.links?.html ?? "https://unsplash.com"}?${UTM}`,
          }
        : null;
    writeCache(key, photo);
    return photo;
  } catch {
    return null;
  }
}

export function getPhoto(title: string): Promise<Photo | null> {
  if (!mem.has(title)) mem.set(title, load(title));
  return mem.get(title)!;
}
