<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const props = defineProps<{
  latitude: number;
  longitude: number;
  name: string;
}>();
const el = ref<HTMLDivElement | null>(null);
let map: L.Map | null = null;
let marker: L.Marker | null = null;

// Ikon default Leaflet rusak di bundler, jadi didefinisikan eksplisit.
const icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

onMounted(() => {
  if (!el.value) return;
  const pos: L.LatLngExpression = [props.latitude, props.longitude];
  map = L.map(el.value, { scrollWheelZoom: false }).setView(pos, 11);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  marker = L.marker(pos, {
    icon,
    title: props.name,
    alt: `Map marker for ${props.name}`,
  })
    .addTo(map)
    .bindPopup(props.name);
});

watch(
  () => [props.latitude, props.longitude],
  ([lat, lon]) => {
    if (!map || !marker) return;
    marker.setLatLng([lat, lon]).setPopupContent(props.name);
    map.setView([lat, lon], 11);
  }
);

onBeforeUnmount(() => {
  map?.remove();
  map = null;
  marker = null;
});
</script>

<template>
  <div
    ref="el"
    class="relative z-0 overflow-hidden rounded-card border border-line"
    role="region"
    :aria-label="`Map of ${name}`"
  />
</template>
