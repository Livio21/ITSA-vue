<template>
  <navBar class=""></navBar>
  <div class="flex min-h-screen overflow-hidden transition-all duration-300">
    <SideNav class="flex-shrink"></SideNav>
    <div class="py-5 sm:p-10 flex-grow ">
      <!-- <router-view class="" :key="$route.path" /> -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>
    </div>
  </div>
  <FooterComponent></FooterComponent>
</template>
<script>
import { onBeforeMount } from "vue";
import navBar from "@/components/Navigation/navBar.vue";

import FooterComponent from "@/components/footerComponent.vue";
import { useStore, mapState } from "vuex";
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
  computed: {
    ...mapState(["showNav"]),
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

#app {
  font-family: "Poppins", sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
