import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { AppRouter } from "./route-init.js";

/***************************
 * Author: Runquan Ye
 **************************/

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App),
  router: AppRouter
}).$mount("#app");
