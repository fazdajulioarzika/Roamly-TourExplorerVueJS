<script setup lang="ts">
import { reactive } from "vue";
type Data = { title: string; startTime?: string; notes?: string };
const props = defineProps<{
  initial?: Data;
  submitLabel?: string;
  cancelable?: boolean;
}>();
const emit = defineEmits<{ submit: [data: Data]; cancel: [] }>();
const f = reactive({
  title: props.initial?.title ?? "",
  startTime: props.initial?.startTime ?? "",
  notes: props.initial?.notes ?? "",
});
const input =
  "rounded-control border border-line px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary";
function submit() {
  if (!f.title.trim()) return;
  emit("submit", {
    title: f.title.trim(),
    startTime: f.startTime || undefined,
    notes: f.notes.trim() || undefined,
  });
  if (!props.initial) {
    f.title = "";
    f.startTime = "";
    f.notes = "";
  }
}
</script>
<template>
  <form
    class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_8rem_1fr_auto]"
    @submit.prevent="submit"
  >
    <input
      v-model="f.title"
      :class="input"
      aria-label="Activity title"
      placeholder="Activity (e.g. Fushimi Inari)"
      required
    />
    <input
      v-model="f.startTime"
      type="time"
      :class="input"
      aria-label="Start time"
    />
    <input
      v-model="f.notes"
      :class="input"
      aria-label="Notes"
      placeholder="Notes (optional)"
    />
    <div class="flex gap-2">
      <button
        type="submit"
        class="rounded-control bg-primary px-4 py-2 font-semibold text-white outline-none hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {{ submitLabel ?? "Add" }}
      </button>
      <button
        v-if="cancelable"
        type="button"
        class="rounded-control border border-line px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary"
        @click="emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>
