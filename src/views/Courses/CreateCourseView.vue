<template>
  <div class="bg-slate-200">
    <h1>Creating a course</h1>
    <form class="add" @submit.prevent="addCourse">
      <label for="title">Course title: </label>
      <input type="text" name="title" v-model="newCourse.title" required />
      <label for="grade">Course grade: </label>
      <input type="text" name="grade" v-model="newCourse.grade" required />
      <label for="date">Course Date: </label>
      <input type="text" name="date" v-model="newCourse.date" required />
      <button type="submit">Add new course</button>
    </form>
    <h1>Deleting a course</h1>
    <form class="add" @submit.prevent="removeCourse">
      <label for="title">Course ID: </label>
      <input type="text" name="title" v-model="courseID" required />

      <button type="submit">Remove course</button>
    </form>
  </div>
</template>

<script>
import { db } from "@/firebase";

import { ref } from "vue";

import { addDoc, deleteDoc, collection, onSnapshot, doc } from "@firebase/firestore";


export default {
  setup() {

    const newCourse = ref({})
    const courses = ref([])
    const courseID = ref(null)
    const addCourse = async () => {
      await addDoc(collection(db, 'Courses'), newCourse.value)

    }
    // const q = query(doc(collection(db, 'Courses'),where(doc.id == courseID.value)))
    const removeCourse = async () => {
      await deleteDoc(doc(db, 'Courses', courseID.value))
    }
    console.log(courses.value);
    onSnapshot(collection(db, 'Courses'), (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const test = {
          id: doc.id,
          title: doc.data().title,

        }

        courses.value.push(test)
      })
      console.log(courses.value);
    })
    return { newCourse, removeCourse, addCourse, courseID };
  },
};
</script>

<style lang="scss" scoped>
</style>
