import Budget from "@/components/Budget.vue";
import Login from "@/components/Login.vue";
import Vue from "vue";
import VueRouter from "vue-router";

/***************************
 * Author: Runquan Ye
 **************************/

Vue.use(VueRouter);

/* Map path to component */
const routeTable = [
  { path: "/", component: Login },
  { path: "/budget", component: Budget }
];

const AppRouter = new VueRouter({
  routes: routeTable,
  mode: "history",
  base:
    process.env.NODE_ENV === "production" ? "/~yer/hw05/myvuefirebase/" : "/"
});
export { AppRouter };
