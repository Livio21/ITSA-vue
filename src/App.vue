<template>
  <navBar></navBar>
  <div class="flex min-h-screen ">
    <SideNav class="flex-shrink"></SideNav>
    <router-view class="flex-grow" />
  </div>
  <FooterComponent></FooterComponent>
</template>
<script>
import { onBeforeMount } from "vue";
import navBar from "@/components/Navigation/navBar.vue";

import FooterComponent from "@/components/footerComponent.vue";
import store from "./store";
import SideNav from "./components/Navigation/sideNav.vue";

export default {
  name: "app",
  components: {
    navBar,
    FooterComponent,
    SideNav,
  },
  setup() {
    onBeforeMount(() => {
      store.dispatch("fetchUser");
    });
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
#app {
  font-family: "Poppins", sans-serif;
}
</style>
