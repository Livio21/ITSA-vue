<template>
  <div
    class="flex flex-col min-h-screen max-w-[1360px] basis-full mx-auto p-10 ring ring-slate-100 ring-3 rounded-lg gap-3">


    <div class="flex justify-center items-end bg-slate-500 h-[200px] w-full  rounded-3xl shadow-inner p-3">
      <h1 class=" text-4xl text-white font-semibold ">{{ course.title }} {{ course.grade }} <span
          class="text-xl font-normal">{{ course.date }}</span></h1>
    </div>
    <div class="flex justify-start ring ring-slate-100 max-w-fit rounded-full">
      <input class="text-xl rounded-l-full w-[300px] px-5 z-10" placeholder="Search" />
      <button
        class=" bg-slate-100 rounded-r-full hover:bg-slate-200 active:scale-95 active:transition-all active:bg-slate-300 z-0">
        <span class="material-symbols-outlined text-black p-3">
          search
        </span>
      </button>
    </div>
    <div class="border-b-2">
      <nav class="self-center text-slate-700 ">
        <ul class="flex text-xl  justify-center divide-x-2 divide-slate-100">
          <li class="active:border-b-2 active:bg-slate-300 hover:bg-slate-100 p-5 rounded-tl-lg">
            <a href="">Materials</a>
          </li>
          <li class="active:border-b-2 active:bg-slate-300 hover:bg-slate-100 p-5">
            <a href="">Tools</a>
          </li>
          <li class="active:border-b-2 active:bg-slate-300 hover:bg-slate-100 p-5 rounded-tr-lg">
            <a href="">Quizzes</a>
          </li>
        </ul>
      </nav>
    </div>

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
          grade: doc.data().grade,
          date: doc.data().date

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
