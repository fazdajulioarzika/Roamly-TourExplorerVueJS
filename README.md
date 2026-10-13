# Roamly — Travel Explorer & Trip Planner

Find destinations, check live weather, save favorites, and plan a simple day-by-day itinerary.
A frontend portfolio project focused on UI/UX, public API integration, state management,
accessibility, and testing.

> **Demo:** _add your deployed URL here_ > **Screenshots:** _add images to `docs/` and link them here_

## Features

- **Home / Discover** — sticky navbar, hero with search, mood categories, trending destinations,
  live weather preview, trip-planning CTA, footer with attributions.
- **Search** — debounced autocomplete (Open-Meteo Geocoding), full keyboard support
  (↑ ↓ Enter Esc), labeled results with region and country, loading / empty / error / retry states.
- **Explore** — results and category filter kept in the URL (`/explore?q=...&category=...`),
  so pages can be shared and refreshed.
- **Destination detail** — photo, coordinates, current weather and 5-day forecast, interactive
  Leaflet map with marker, save to favorites, add to itinerary.
- **Favorites** — saved in `localStorage`, dedicated Saved page.
- **Trip planner** — create / edit / delete trips, add and remove days, add / edit / delete /
  reorder activities with time and notes, persisted in `localStorage`.
- **Photos** — Unsplash API with 7-day `localStorage` cache, rate-limit handling,
  photographer credit, and gradient fallback.
- **Quality** — responsive (320 px to desktop), `focus-visible` styles, semantic HTML,
  `prefers-reduced-motion` support, honest failure handling (no fake "live" data).

## Tech stack

| Area                | Choice                                                 |
| ------------------- | ------------------------------------------------------ |
| UI                  | Vue 3 (Composition API) + TypeScript                   |
| Build               | Vite                                                   |
| Styling             | Tailwind CSS v4 (CSS-first, tokens in `src/style.css`) |
| Routing             | Vue Router                                             |
| State               | Pinia                                                  |
| Icons               | Lucide Vue Next                                        |
| Map                 | Leaflet + OpenStreetMap tiles                          |
| Weather / geocoding | Open-Meteo                                             |
| Photos              | Unsplash API                                           |
| Testing             | Vitest + Vue Test Utils, Playwright                    |

## Getting started

### Prerequisites

- Node.js 20+ and npm
- A free [Unsplash developer](https://unsplash.com/developers) account (Access Key)

### Install

```bash
git clone <your-repo-url>
cd roamly
npm install
```

### Environment variables

Create a `.env` file in the project root (next to `package.json`):

```
VITE_UNSPLASH_ACCESS_KEY=your_access_key_here
```

- Use the **Access Key**, never the Secret Key.
- All `VITE_*` variables are bundled into the browser build and are therefore public.
- Restart the dev server after changing `.env`.
- Without the key the app still works; photos fall back to gradients.

### Run

```bash
npm run dev        # http://localhost:5173
```

## Scripts

| Command             | Description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the dev server                           |
| `npm run build`     | Production build to `dist/`                    |
| `npm run preview`   | Preview the production build                   |
| `npm run typecheck` | Type-check with `vue-tsc`                      |
| `npm test`          | Unit and component tests (Vitest)              |
| `npm run e2e`       | End-to-end tests (Playwright; APIs are mocked) |

First time running E2E: `npx playwright install chromium`.

## Routes

| Route                   | Purpose                            |
| ----------------------- | ---------------------------------- |
| `/`                     | Home / Discover                    |
| `/explore?q=&category=` | Search results and category filter |
| `/destination/:id`      | Destination detail                 |
| `/trips`                | Trip list and creation             |
| `/trips/:id`            | Trip itinerary                     |
| `/saved`                | Saved places                       |
| `*`                     | 404                                |

## Project structure

```
src/
├── components/     AppNavbar, AppFooter, HeroSearch, ExploreCategories,
│                   DestinationCard, DestinationPhoto, DestinationMap,
│                   WeatherPreview, AddToTrip, TripItemForm
├── composables/    useWeather
├── data/           curated editorial destinations and categories
├── router/
├── services/       geocoding, weather, photos (API boundary + validation)
├── stores/         favorites, trips (Pinia + localStorage)
├── types/
├── utils/
├── views/          Home, Explore, DestinationDetail, Trips, TripDetail, Saved, NotFound
└── main.ts
e2e/                Playwright tests
```

## Testing

| Type             | Coverage                                                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unit / component | Search debounce, weather and geocoding response mapping, malformed responses, favorites and trips stores (toggle, reorder, edit, hydration, corrupted storage), photo cache and rate limit |
| E2E              | Home → destination, favorite persists after refresh, trip create → add item → refresh, trip edit, map with marker                                                                          |

External APIs and map tiles are mocked in E2E so tests are deterministic.

## Deployment

Static build, works on Vercel or Cloudflare Pages.

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: set `VITE_UNSPLASH_ACCESS_KEY` in the host dashboard, then redeploy
  (values are inlined at build time).
- SPA fallback is required so deep links like `/destination/kyoto` survive a refresh:
  - Vercel: `vercel.json` with a rewrite of `/(.*)` to `/index.html`
  - Cloudflare Pages: `public/_redirects` containing `/* /index.html 200`

## Design decisions

- **Modern Explorer, light mode:** white surfaces, blue primary (`#2563EB`), Inter, consistent radius
  and spacing tokens defined once in `@theme`.
- **Tailwind v4 only:** version-locked; v3 configuration guidance does not apply.
- **API boundary validation:** responses are validated and mapped in `services/`;
  components never consume raw API shapes.
- **Honest data:** weather is labeled live only when the request succeeds. Editorial destinations come from
  a local dataset and carry no invented ratings, prices, or visitor numbers.
- **Resilience:** one failing API does not blank the page; each section has its own state and retry.
- **Accessible cards:** a single stretched link per card (no nested links), 44 px favorite button
  with a descriptive accessible name.

## Data sources and attribution

- Weather and geocoding: [Open-Meteo](https://open-meteo.com/)
- Map: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, rendered with [Leaflet](https://leafletjs.com/).
  Follow the [tile usage policy](https://operations.osmfoundation.org/policies/tiles/); evaluate another tile provider if traffic grows.
- Photos: [Unsplash](https://unsplash.com/?utm_source=roamly&utm_medium=referral), with photographer credit
  shown on each image. Follow the Unsplash API guidelines.

## Privacy

No accounts and no personal data are collected. Favorites, trips, and cached photo metadata live in this browser's
`localStorage` only and are not synced across devices.

## Known limitations

- Unsplash demo apps are rate limited (about 50 requests per hour); cached photos reduce usage,
  and cards fall back to gradients when the limit is hit.
- Photos are matched by text search, so same-named cities can share an image.
- Place information is not guaranteed to be complete for every city.
- Activities are reordered with buttons, not drag and drop.
- Data is per browser; clearing site data removes favorites and trips.

## Roadmap

- Loading skeletons and request timeouts
- Sorting and filtering for search results
- Drag-and-drop reordering
- Export / import trips as JSON
