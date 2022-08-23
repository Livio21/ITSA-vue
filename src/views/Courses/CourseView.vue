<template>
  <div
    class="flex flex-col min-h-screen max-w-[1360px] basis-full mx-auto p-10 ring ring-slate-100 ring-3 rounded-3xl gap-3">
    <div class=" self-end">
      <button class=" bg-red-500 py-3 px-5 rounded-full text-white font-semibold hover:bg-red-400 active:bg-red-500"
        @click="removeCourse"> Delete </button>
    </div>
    <div
      class="flex justify-center items-end bg-slate-500 h-[200px] w-full  rounded-tr-3xl rounded-tl-3xl shadow-inner p-3"
      id="b">
      <span class=" text-4xl text-white font-semibold " id="title">{{ course.title }}</span>
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
import { collection, query, where, onSnapshot, deleteDoc, doc } from "@firebase/firestore";


import { onMounted, ref } from "vue";
export default {
  props: ['courseName'],
  setup(props) {
    const course = ref({});


    const removeCourse = async () => {
      await deleteDoc(doc(db, 'Courses', course.value.id)).then(() => {
        location.reload()
      })
    }
    console.log(props.courseName);
    const q = query(collection(db, 'Courses'), where('title', "==", props.courseName))
    onSnapshot(q, (snapshot) => {

      snapshot.docs.forEach((doc) => {
        course.value = {
          id: doc.id,
          title: doc.data().title,
          // grade: doc.data().grade,
          // date: doc.data().date
          picUrl: doc.data().picUrl,
          color: doc.data().color

        }

      })
      console.log(course.value);

      course.value.picUrl ? document.getElementById('b').style.backgroundImage = `url(${course.value.picUrl})` : '';

      course.value.color ? document.getElementById('title').style.color = course.value.color : 'black';

    })
    onMounted(() => {

    })
    return { course, q, removeCourse };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
