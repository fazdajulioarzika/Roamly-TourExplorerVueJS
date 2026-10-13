<script setup lang="ts">
import { Trees, Waves, Building2, Mountain, Landmark } from "lucide-vue-next";
import { CATEGORIES } from "@/data/destinations";
defineProps<{ modelValue?: string }>();
defineEmits<{ "update:modelValue": [value: string] }>();
const icons: Record<string, unknown> = {
  Nature: Trees,
  Beach: Waves,
  City: Building2,
  Mountains: Mountain,
  Culture: Landmark,
};
</script>
<template>
  <div
    class="flex gap-2 overflow-x-auto pb-1"
    role="group"
    aria-label="Explore by mood"
  >
    <button
      v-for="c in CATEGORIES"
      :key="c"
      type="button"
      :aria-pressed="modelValue === c"
      class="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-primary"
      :class="
        modelValue === c
          ? 'border-primary bg-primary text-white'
          : 'border-line bg-white text-heading hover:border-primary'
      "
      @click="$emit('update:modelValue', modelValue === c ? '' : c)"
    >
      <component :is="icons[c]" :size="16" aria-hidden="true" />{{ c }}
    </button>
  </div>
</template>
