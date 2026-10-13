<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-vue-next";
import { useTrips } from "@/stores/trips";
import TripItemForm from "@/components/TripItemForm.vue";
import { setTitle } from "@/utils/title";
const route = useRoute();
const store = useTrips();
const trip = computed(() => store.byId(String(route.params.id)));
watchEffect(() => {
  if (trip.value) setTitle(trip.value.title);
});
const icon =
  "grid h-9 w-9 place-items-center rounded-full outline-none hover:bg-soft focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-30";
const input =
  "rounded-control border border-line px-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary";

const editingTrip = ref(false);
const editingItem = ref<string | null>(null);
const tf = reactive({ title: "", start: "", end: "" });
function startEdit() {
  if (!trip.value) return;
  Object.assign(tf, {
    title: trip.value.title,
    start: trip.value.startDate ?? "",
    end: trip.value.endDate ?? "",
  });
  editingTrip.value = true;
}
function saveTrip() {
  if (!trip.value || !tf.title.trim()) return;
  store.updateTrip(trip.value, {
    title: tf.title,
    startDate: tf.start,
    endDate: tf.end,
  });
  editingTrip.value = false;
}
</script>
<template>
  <div class="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:px-8">
    <div v-if="!trip">
      <p>Trip not found.</p>
      <RouterLink to="/trips" class="text-primary underline"
        >Back to My Trips</RouterLink
      >
    </div>
    <template v-else>
      <RouterLink to="/trips" class="text-sm text-primary underline"
        >← My Trips</RouterLink
      >

      <form
        v-if="editingTrip"
        class="mt-3 grid grid-cols-1 gap-3 rounded-card bg-soft p-4 md:grid-cols-[2fr_1fr_1fr_auto]"
        @submit.prevent="saveTrip"
      >
        <input
          v-model="tf.title"
          :class="input"
          aria-label="Trip title"
          required
        />
        <input
          v-model="tf.start"
          type="date"
          :class="input"
          aria-label="Start date"
        />
        <input
          v-model="tf.end"
          type="date"
          :min="tf.start || undefined"
          :class="input"
          aria-label="End date"
        />
        <div class="flex gap-2">
          <button
            type="submit"
            class="rounded-control bg-primary px-4 py-2.5 font-semibold text-white outline-none hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Save
          </button>
          <button
            type="button"
            class="rounded-control border border-line bg-white px-4 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary"
            @click="editingTrip = false"
          >
            Cancel
          </button>
        </div>
      </form>
      <div v-else class="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="text-3xl font-bold">{{ trip.title }}</h1>
          <p v-if="trip.startDate" class="text-muted">
            {{ trip.startDate
            }}<span v-if="trip.endDate"> → {{ trip.endDate }}</span>
          </p>
        </div>
        <button
          type="button"
          class="flex items-center gap-2 rounded-control border border-line px-4 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary"
          @click="startEdit"
        >
          <Pencil :size="16" aria-hidden="true" />Edit trip
        </button>
      </div>

      <section
        v-for="day in trip.days"
        :key="day.id"
        class="mt-8 rounded-card border border-line p-5"
        :aria-label="`Day ${day.dayIndex}`"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Day {{ day.dayIndex }}</h2>
          <button
            type="button"
            class="text-sm text-danger underline outline-none focus-visible:ring-2 focus-visible:ring-primary"
            @click="store.removeDay(trip, day.id)"
          >
            Remove day
          </button>
        </div>
        <p v-if="!day.items.length" class="mt-3 text-sm text-muted">
          No activities yet.
        </p>
        <ol v-else class="mt-3 divide-y divide-line">
          <li v-for="(item, i) in day.items" :key="item.id" class="py-3">
            <TripItemForm
              v-if="editingItem === item.id"
              :initial="{
                title: item.title,
                startTime: item.startTime,
                notes: item.notes,
              }"
              submit-label="Save"
              cancelable
              @submit="d => { store.updateItem(trip!, item, d); editingItem = null }"
              @cancel="editingItem = null"
            />
            <div v-else class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="font-medium">
                  <span
                    v-if="item.startTime"
                    class="mr-2 text-sm text-primary"
                    >{{ item.startTime }}</span
                  >{{ item.title }}
                </p>
                <p v-if="item.notes" class="text-sm text-muted">
                  {{ item.notes }}
                </p>
                <RouterLink
                  v-if="item.destinationId"
                  :to="`/destination/${item.destinationId}`"
                  class="text-xs text-primary underline"
                  >View destination</RouterLink
                >
              </div>
              <div class="flex shrink-0">
                <button
                  type="button"
                  :class="icon"
                  :aria-label="`Edit ${item.title}`"
                  @click="editingItem = item.id"
                >
                  <Pencil :size="16" />
                </button>
                <button
                  type="button"
                  :class="icon"
                  :disabled="i === 0"
                  :aria-label="`Move ${item.title} up`"
                  @click="store.moveItem(trip, day, i, -1)"
                >
                  <ArrowUp :size="16" />
                </button>
                <button
                  type="button"
                  :class="icon"
                  :disabled="i === day.items.length - 1"
                  :aria-label="`Move ${item.title} down`"
                  @click="store.moveItem(trip, day, i, 1)"
                >
                  <ArrowDown :size="16" />
                </button>
                <button
                  type="button"
                  :class="[icon, 'text-danger']"
                  :aria-label="`Delete ${item.title}`"
                  @click="store.removeItem(trip, day, item.id)"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </div>
          </li>
        </ol>
        <TripItemForm @submit="d => store.addItem(trip!, day, d)" />
      </section>
      <button
        type="button"
        class="mt-6 rounded-control border border-primary px-5 py-2.5 font-semibold text-primary outline-none hover:bg-soft focus-visible:ring-2 focus-visible:ring-primary"
        @click="store.addDay(trip)"
      >
        + Add day
      </button>
    </template>
  </div>
</template>
