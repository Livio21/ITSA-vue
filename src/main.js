import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./index.css";
import "material-symbols";
import Croppa from "vue-croppa";

createApp(App).use(store).use(router).use(Croppa).mount("#app");
