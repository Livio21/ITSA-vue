<template>
  <div class="grid grid-cols-2 transition-all duration-300 relative  ">
    <navBar class="col-span-2" />
    <div class="col-span-2 flex min-h-screen">
      <SideNav v-if="store.state.user"></SideNav>
      <div class="p-10 basis-full">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="$route.path" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
  <FooterComponent></FooterComponent>
</template>
<script>
import { onBeforeMount, onMounted, ref } from "vue";
import navBar from "@/components/Navigation/navBar.vue";
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import FooterComponent from "@/components/footerComponent.vue";
import { useStore, mapState } from "vuex";
import SideNav from "./components/Navigation/sideNav.vue";

export default {
  name: "app",
  components: {
    navBar,
    FooterComponent,
    SideNav,
    PulseLoader
  },
  setup() {
    const store = useStore();
    const loaded = ref(false)
    onBeforeMount(() => {
      store.dispatch("fetchUser");
    });
    // console.log(store.state.user);



    onMounted(() => {
      document.onreadystatechange = () => {
        if (document.readyState == "complete") {
          loaded.value = true;
        }
      }
    })
    return {
      store, loaded
    }
  },
  computed: {
    ...mapState(["showNav"]),
  },
}
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
