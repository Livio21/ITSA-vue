<template>
  <div class="sticky top-0" v-if="status()">
    <transition-group name="slide">
      <div class="rounded-br-lg bg-slate-100 p-2 overflow-y-scroll w-72 min-h-screen divide-y-2 text-center"
        v-if="showNav">
        <div class="mainNavigation flex flex-col text-base font-medium gap-3 p-2">
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            to="/">Home</router-link>
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            to="/about">About</router-link>
        </div>
        <div class="signinNavigation flex flex-col text-base font-medium gap-3 p-2">
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            to="/my-profile">My Profile</router-link>
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            to="/edit-profile">Edit Profile</router-link>
        </div>
        <div class="courseNavigation flex flex-col text-base font-medium gap-3 p-2">
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            to="/Course">View Course</router-link>
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            to="/create-course">Create Course</router-link>
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            to="/test">Test Features</router-link>
        </div>
        <div class="courseNavigation flex flex-col text-base font-medium gap-3 p-2">
          <router-link v-for="title in courseTitle" :key="title.id"
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            to="/Course">{{ title.title }}</router-link>

        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>

import { useStore, mapState } from "vuex";
import { db } from "@/firebase";
import { collection, onSnapshot } from "@firebase/firestore";
import { onMounted, ref } from "vue";
export default {
  setup() {
    const store = useStore();
    const courseTitle = ref([])
    const status = () => {
      if (store.state.user) {
        return true;
      } else {
        return false;
      }
    };
    onMounted(() => {
      onSnapshot(collection(db, 'Courses'), (querySnapshot) => {
        const arr = []
        querySnapshot.forEach((doc) => {

          const test = {
            id: doc.id,
            title: doc.data().title,

          }
          arr.push(test)
        })
        courseTitle.value = arr
        console.log(courseTitle.value);
      })
    })
    return { store, status, courseTitle };
  },
  computed: {
    ...mapState(["showNav"]),
  },
};
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
