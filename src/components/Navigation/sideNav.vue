<template>
  <div v-if="store.state.user" class="bg-slate-100 ">
    <transition name="slide-fade">
      <div class="sticky top-2 flex flex-col justify-center  rounded-br-lg  p-2 w-72  divide-y-2 text-center z-0"
        v-show="showNav">
        <div class="mainNavigation flex flex-col  text-base font-medium gap-3 p-2">
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            to="/">Home</router-link>
          <router-link class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3
              " to="/about">About</router-link>
        </div>
        <div class="signinNavigation flex flex-col text-base font-medium gap-3 p-2">
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            to="/my-profile">My Profile
          </router-link>
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            :class="{ ' cursor-not-allowed': !store.state.user.emailVerified }" to="/edit-profile">
            Edit Profile
          </router-link>
        </div>
        <div class="quizNavigation flex flex-col text-base font-medium gap-3 p-2">
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            :class="{ ' cursor-not-allowed': !store.state.user.emailVerified }" to="/view-quizzes">View Quizzes
          </router-link>
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            :class="{ ' cursor-not-allowed': !store.state.user.emailVerified }" to="/create-quizzes">Create Quizzes
          </router-link>
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            :class="{ ' cursor-not-allowed': !store.state.user.emailVerified }" to="/quiz">Quiz
          </router-link>
        </div>
        <div class="courseNavigation flex flex-col text-base font-medium gap-3 p-2">

          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            :class="{ ' cursor-not-allowed': !store.state.user.emailVerified }" to="/register-course">Register to Course
          </router-link>
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            :class="{ ' cursor-not-allowed': !store.state.user.emailVerified }" to="/create-course">Create Course
          </router-link>
          <router-link
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            :class="{ ' cursor-not-allowed': !store.state.user.emailVerified }" to="/register-course">Register to Course
          </router-link>
        </div>
        <div class="courseNavigation flex flex-col text-base font-medium gap-3 p-2"
          v-show="store.state.user.emailVerified">
          <button v-for="(courseTitle, index) in store.state.courseTitle" :key="index"
            class="hover:bg-slate-200 active:hover:bg-blue-200 active:bg-blue-300 focus:ring focus:ring-black focus:bg-blue-300 rounded-2xl px-4 p-3"
            @click="viewCourse(courseTitle.title, courseTitle.id)" :title="courseTitle.title">{{
                courseTitle.title
            }}</button>
        </div>
      </div>
    </transition>
  </div>
  <button @click="store.commit('SHOW_NAV')" v-if="store.state.user"
    class="fixed top-1/2 left-0 rounded-tr-lg h-[70px] w-[30px]  rounded-br-lg bg-slate-100"
    :class="{ 'h-[100px] w-[50px] sticky top-[50%] left-[288px] transition-all': showNav }"><span
      class="material-symbols-outlined rotate-90 transition-all duration-200" :class="{ ' -rotate-90  ': !showNav }">
      expand_more
    </span></button>
</template>

<script>

import { useStore, mapState } from "vuex";
import { onBeforeMount, onMounted, ref } from "vue";
import router from "@/router";

export default {
  setup() {
    const store = useStore();
    const courseTitles = ref([])
    onBeforeMount(() => {
    })
    onMounted(() => {
      store.dispatch('getCourseInfo')
    })
    const viewCourse = (cTitle, id) => {
      router.push({ name: 'courses', params: { courseName: cTitle.replaceAll(' ', '-'), courseID: id } })
      console.log(router.currentRoute.value);
    }
    return {
      store, courseTitles, viewCourse,
      // getCourseTitle, 
    };
  },
  computed: {
    ...mapState(["showNav"]),
    // ...mapState(["user"]), 


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
