<template>
  <div class="flex basis-full mx-auto p-10 bg-slate-300  rounded-lg">
    <img src="" class="courseImg" alt="" />
    <h1>{{ course.title }}</h1>
    <h1>{{ course.grade }}</h1>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, query, where, onSnapshot } from "@firebase/firestore";
import { onMounted, ref } from "vue";
export default {
  props: ['courseName'],
  setup(props) {
    const course = ref({});

    
    console.log(props.courseName);
    const q = query(collection(db, 'Courses'), where('title', "==", props.courseName))
    onSnapshot(q, (snapshot) => {

      snapshot.docs.forEach((doc) => {
        course.value = {
          id: doc.id,
          title: doc.data().title,
          grade: doc.data().grade
        }

      })
      console.log(course.value);
    })
    onMounted(() => {
    })
    return { course, q };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
