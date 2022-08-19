<template>
  <div class="sticky top-0" v-if="status()">
    <div class="rounded-br-lg bg-slate-100 p-2 w-72  divide-y-2 text-center" v-if="showNav">
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
        <button v-for="courseTitle in courseTitles" :key="courseTitle.id"
          class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
          @click="viewCourse(courseTitle.title)">{{
              courseTitle.title
          }}</button>

      </div>
    </div>
  </div>
</template>

<script>

import { useStore, mapState } from "vuex";
import { db } from "@/firebase";
import { collection, onSnapshot } from "@firebase/firestore";
import { ref } from "vue";
import router from "@/router";
export default {
  setup() {
    const store = useStore();
    const courseTitles = ref([])
    const status = () => {
      if (store.state.user) {
        return true;
      } else {
        return false;
      }
    };
    onSnapshot(collection(db, 'Courses'), (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const test = {
          id: doc.id,
          title: doc.data().title,

        }

        courseTitles.value.push(test)
      })
      console.log(courseTitles.value);
    })
    const viewCourse = (cTitle) => {
      router.push({ name: 'courses', params: { courseName: cTitle } })
      console.log(router.currentRoute.value);
    }
    return { store, status, courseTitles, viewCourse };
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
