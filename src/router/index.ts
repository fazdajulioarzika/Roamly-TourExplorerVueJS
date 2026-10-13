import { createRouter, createWebHistory } from "vue-router";
export default createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/explore",
      name: "explore",
      component: () => import("@/views/ExploreView.vue"),
    },
    {
      path: "/destination/:id",
      name: "destination",
      component: () => import("@/views/DestinationDetailView.vue"),
    },
    {
      path: "/saved",
      name: "saved",
      component: () => import("@/views/SavedView.vue"),
    },
    {
      path: "/trips",
      name: "trips",
      component: () => import("@/views/TripsView.vue"),
    },
    {
      path: "/trips/:id",
      name: "trip",
      component: () => import("@/views/TripDetailView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
});
