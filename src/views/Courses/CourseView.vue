<template>
  <div class="flex mx-auto p-10">
    <div v-for="course in courses" :key="course.id">
      <header class="bg-slate-300 p-10 rounded-lg">
        <img src="" class="courseImg" alt="" />
        <h1>{{ course.title }}</h1>
        <h1>{{ course.grade }}</h1>
      </header>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, onSnapshot } from "@firebase/firestore";
import { onMounted, ref } from "vue";
export default {
  setup() {
    const courses = ref([]);



    onMounted(() => {

      onSnapshot(collection(db, 'Courses'), (querySnapshot) => {
        const arr = []
        querySnapshot.forEach((doc) => {

          const test = {
            id: doc.id,
            title: doc.data().title,
            grade: doc.data().grade
          }
          arr.push(test)
        })
        courses.value = arr
        console.log(courses.value);
      })
    });
    return { courses };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
