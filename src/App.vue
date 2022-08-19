<template>
  <navBar></navBar>
  <div class="flex min-h-screen">
    <SideNav class="flex-shrink"></SideNav>
    <div class="p-10 flex-grow">
      <router-view class="" :key="$route.path" />
    </div>
  </div>
  <FooterComponent></FooterComponent>
</template>
<script>
import { onBeforeMount } from "vue";
import navBar from "@/components/Navigation/navBar.vue";

import FooterComponent from "@/components/footerComponent.vue";
import { useStore } from "vuex";
import SideNav from "./components/Navigation/sideNav.vue";

export default {
  name: "app",
  components: {
    navBar,
    FooterComponent,
    SideNav,
  },
  setup() {
    const store = useStore();
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
