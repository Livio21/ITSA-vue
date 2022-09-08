<template>
  <div v-if="store.state.user" class="bg-gray-100 h-screen sticky top-0">
    <transition name="slide-fade">
      <div v-show="showNav" class="relative">
        <div class="flex flex-col justify-center  rounded-br-lg  p-2 w-72  divide-y-2 text-center z-0">
          <div class="mainNavigation flex flex-col  text-base font-medium gap-3 p-2">
            <span class="text-xl text-slate-400">Introduction</span>
              <router-link
              class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black text-lg font-[500] focus:bg-blue-300 rounded-2xl px-4 p-3"
              :class="{ ' cursor-not-allowed': !store.state.user.emailVerified }"
              :to="store.state.user.role == 'Teacher' ? '/teacher-dashboard' : '/student-dashboard'">
              Home
            </router-link>
            <router-link class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black text-lg font-[500] focus:bg-blue-300 rounded-2xl px-4 p-3
                " to="/about">About</router-link>
          </div>
          <div class="signinNavigation flex flex-col text-base font-medium gap-3 p-2">
            <span class="text-xl text-slate-400">Profile</span>
            <router-link
              class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black text-lg font-[500] focus:bg-blue-300 rounded-2xl px-4 p-3"
              to="/my-profile">My Profile
            </router-link>
            <router-link
              class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black text-lg font-[500] focus:bg-blue-300 rounded-2xl px-4 p-3"
              :class="{ ' cursor-not-allowed': !store.state.user.emailVerified }" to="/edit-profile">
              Edit Profile
            </router-link>
          </div>
          <div v-if="store.state.user.role == 'Teacher'"
            class="courseNavigation flex flex-col text-base font-medium gap-3 p-2">
            <span class="text-xl text-slate-400">Teacher's options</span>
            <router-link
              class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black text-lg font-[500] focus:bg-blue-300 rounded-2xl px-4 p-3"
              :class="{ ' cursor-not-allowed': !store.state.user.emailVerified }" to="/create-quizzes">Create Quizzes
            </router-link>
            <router-link
              class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black text-lg font-[500] focus:bg-blue-300 rounded-2xl px-4 p-3"
              :class="{ ' cursor-not-allowed': !store.state.user.emailVerified }" to="/create-course">Create Course
            </router-link>
          </div>
          <div class="courseNavigation flex flex-col text-base font-medium gap-3 p-2"
            v-if="store.state.user.emailVerified">
            <span class="text-xl text-slate-400">Courses</span>
            <button v-for="(courseTitle, index) in courseTitles" :key="index"
              class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black text-lg font-[500] focus:bg-blue-300 rounded-2xl px-4 p-3"
              @click="viewCourse(courseTitle.title, courseTitle.id)" :title="courseTitle.title">{{
              courseTitle.title
              }}</button>
          </div>
        </div>
      </div>
    </transition>
    <button @click="store.commit('SHOW_NAV')"
      class="fixed top-1/2 left-0 rounded-tr-lg h-[70px] w-[30px] transition-all duration-300 rounded-br-lg bg-slate-100"
      :class="{ 'h-[100px] w-[50px] left-[288px] ': showNav }">
      <span class="material-symbols-outlined " :class="{ ' -rotate-180 ': showNav }">
        chevron_right
      </span></button>
  </div>
</template>

<script>

import { useStore } from "vuex";
import { computed, onBeforeMount, onBeforeUpdate, ref } from "vue";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useStore();
    const courseTitles = ref([])
    const router = useRouter()
    const getCourseData = () => {
      if (store.state.user.role == 'Teacher') {
        const courseRef = query(collection(db, "Courses"), where("uid", "==", store.state.user.uid))
        onSnapshot(courseRef, (snapshot) => {
          let arr = []
          snapshot.forEach((doc) => {
            let obj = {
              id: doc.id,
              title: doc.data().title,
            }
            arr.push(obj)
          })
          courseTitles.value = arr
          console.log(courseTitles.value);
        })
      } else if (store.state.user.role == 'Student') {
        const courseRef = query(collection(db, "Courses"), where("users", 'array-contains', store.state.user.uid))
        onSnapshot(courseRef, (snapshot) => {
          let arr = []
          snapshot.forEach((doc) => {
            let obj = {
              id: doc.id,
              title: doc.data().title,
            }
            arr.push(obj)
          })
          courseTitles.value = arr
          console.log(courseTitles.value);
        })
      }
    }
    onBeforeUpdate(() => {
      getCourseData()
    })
    const viewCourse = (cTitle, id) => {
      router.push({ name: 'courses', params: { courseName: cTitle.replaceAll(' ', '-'), courseID: id } })
      console.log(router.currentRoute.value);
    }
    onBeforeMount(() => {
      store.dispatch('getCourseInfo')
    })
    return {
      store, courseTitles, viewCourse,
      showNav: computed(() => store.state.showNav)
      // getCourseTitle, 
    };
  },
};
</script>

<style lang="scss" scoped>
#sidebar {
  transition: top 0.3s;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
