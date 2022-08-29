<template>
  <div class=" w-full sticky top-0 max-h-fit overflow-auto z-20 bg-slate-100" id="navbar">
    <div class="">
      <div class="">
        <nav class="grid grid-flow-col py-3 mx-auto text-white">
          <header class="flex items-center max-w-fit px-4">
            <button v-if="userData" @click="SHOW_NAV"
              class="focus:ring focus:ring-black cursor-pointer active:bg-slate-300 rounded-full hover:bg-slate-200 mr-5">
              <span v-if="!showNav" class="material-symbols-outlined text-black p-3">
                menu
              </span>
              <span v-if="showNav" class="material-symbols-outlined text-black p-3">
                menu_open
              </span>
            </button>
            <div class="flex">
              <span class="material-symbols-outlined text-black pr-3">
                school
              </span>
              <span class="font-bold text-black md:text-3xl cursor-pointer text-lg hidden sm:block"
                @click="router.push('/')">ITSA</span>
            </div>
          </header>
          <ul class="flex justify-end gap-5 font-bold list-none px-3">
            <router-link v-show="!userData"
              class="rounded-full w-28 text-center bg-blue-600 hover:cursor-pointer hover:shadow-xl hover:bg-blue-500 active:bg-blue-700 focus:ring focus:ring-black p-3"
              to="/login">Log In</router-link>
            <div v-if="userData" class="flex items-center gap-3">
              <div class="flex items-center" @click="router.push('/my-profile')">
                <div
                  class="w-[50px] h-[50px] mx-3 cursor-pointer rounded-full ring hover:scale-105 hover:shadow-lg active:scale-100 overflow-hidden">
                  <img :src="userData.photoURL" alt="" width="50" height="50" referrerpolicy="no-referrer" />
                </div>
                <h1
                  class="text-black hover:border-b-2 cursor-pointer hover:border-black hover:scale-105 active:scale-100 hidden sm:block">
                  {{ userData.displayName }}
                </h1>
              </div>
              <button @click="$store.dispatch('logout')"
                class="flex items-center gap-3 rounded-full text-center bg-blue-600 hover:cursor-pointer hover:shadow-xl hover:bg-blue-500 active:bg-blue-700 focus:ring focus:ring-black p-3">
                <span class="material-symbols-outlined"> logout </span>
                <h1 class="hidden sm:block">Sign Out</h1>
              </button>
            </div>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
<script>
import { onBeforeMount, onMounted } from "vue";
import { mapMutations, mapState, useStore } from "vuex";
import router from "@/router";
import { computed } from "@vue/reactivity";
export default {
  name: "HomeView",
  components: {},

  setup() {
    const store = useStore();
    const userData = computed(() => store.state.user)

    // const uid = userData.uid;
    // console.log(userData);

    let prevScrollpos = window.scrollY;
    window.onscroll = function () {
      let currentScrollPos = window.scrollY;
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.top = "0px";
      } else {
        document.getElementById("navbar").style.top = "-74px";
      }
      prevScrollpos = currentScrollPos;
    };
    // const status = () => {
    //   if (userData.value) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // };


    onBeforeMount(() => {
      store.dispatch("fetchUser");
    });
    onMounted(() => {

    });
    return { store, router, userData };
  },
  methods: {
    toggleLogIn() {
      this.showSignBtn = !this.showSignBtn;
    },
    ...mapMutations(["SHOW_NAV"]),
  },
  computed: {
    ...mapState(["showNav"]),
    ...mapState(['user']),


  },
};
</script>

    <style lang="css" scoped>
    @import url("https://fonts.googleapis.com/css2?family=Sora&display=swap");
    
    nav {
      font-family: "Sora", sans-serif;
    }
    
    * {
      transition: all 150ms;
    }
    
    #navbar {
      transition: top 0.3s;
    }
    
    .material-symbols-outlined {
      font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
    }
    </style>
