<script setup lang="ts">
import { ref, watch } from "vue";
import { getPhoto, type Photo } from "@/services/photos";
const props = defineProps<{
  name: string;
  query?: string;
  gradient?: string;
  alt: string;
}>();
const photo = ref<Photo | null>(null);
watch(
  () => [props.name, props.query],
  async () => {
    photo.value = null;
    photo.value =
      (props.query ? await getPhoto(props.query) : null) ??
      (await getPhoto(props.name));
  },
  { immediate: true }
);
</script>
<template>
  <div
    class="relative overflow-hidden bg-gradient-to-br"
    :class="gradient ?? 'from-sky-100 to-blue-50'"
    :role="photo ? undefined : 'img'"
    :aria-label="photo ? undefined : alt"
  >
    <img
      v-if="photo"
      :src="photo.url"
      :alt="alt"
      loading="lazy"
      class="absolute inset-0 h-full w-full object-cover transition duration-200 motion-safe:group-hover:scale-[1.03]"
      @error="photo = null"
    />
    <p
      v-if="photo"
      class="absolute bottom-2 left-2 z-10 max-w-[90%] truncate rounded bg-black/55 px-2 py-0.5 text-[11px] text-white"
    >
      Photo by
      <a
        :href="photo.authorUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="underline"
        >{{ photo.author }}</a
      >
      on
      <a
        href="https://unsplash.com/?utm_source=roamly&utm_medium=referral"
        target="_blank"
        rel="noopener noreferrer"
        class="underline"
        >Unsplash</a
      >
    </p>
  </div>
</template>
