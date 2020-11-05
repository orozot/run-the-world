import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// init element-ui components
import "@/common/initElement";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
