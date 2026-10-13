import type { Destination } from "@/types";

export const placeLabel = (d: Pick<Destination, "region" | "country">) =>
  [d.region, d.country].filter(Boolean).join(", ");
