import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./index.css";
import "material-symbols";
import vClickOutside from "click-outside-vue3";
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

createApp(App).use(store).use(router).use(vClickOutside).use(VueViewer).mount("#app");
