import { createRouter, createWebHistory } from "vue-router";
import { setTitle } from "@/utils/title";

const router = createRouter({
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
      meta: { title: "Explore" },
      component: () => import("@/views/ExploreView.vue"),
    },
    {
      path: "/destination/:id",
      name: "destination",
      meta: { title: "Destination" },
      component: () => import("@/views/DestinationDetailView.vue"),
    },
    {
      path: "/saved",
      name: "saved",
      meta: { title: "Saved places" },
      component: () => import("@/views/SavedView.vue"),
    },
    {
      path: "/trips",
      name: "trips",
      meta: { title: "My Trips" },
      component: () => import("@/views/TripsView.vue"),
    },
    {
      path: "/trips/:id",
      name: "trip",
      meta: { title: "Trip" },
      component: () => import("@/views/TripDetailView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      meta: { title: "Page not found" },
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
});
router.afterEach((to) => setTitle(to.meta.title as string | undefined));
export default router;
