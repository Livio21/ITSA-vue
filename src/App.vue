<template>
  <navBar />
  <div class="flex min-h-screen h-fit overflow-hidden transition-all duration-300">
    <sideNav />
    <div class="p-10 basis-full">
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

.test {
  transition: all flex 0.5s
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
