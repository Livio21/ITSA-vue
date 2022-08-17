<template>
  <div class="bg-slate-200">
    <h1>Creating a course</h1>
    <form class="add">
      <label for="title">Course title: </label>
      <input type="text" name="title" required />
      <label for="grade">Course grade: </label>
      <input type="text" name="grade" required />
      <label for="grade">Course grade: </label>
      <input type="text" name="grade" required />
      <button>Add new course</button>
    </form>

  </div>
</template>

<script>
// import { db } from "@/firebase";

// import { ref } from "vue";

// import { addDoc, collection } from "@firebase/firestore";

export default {
  setup() {
    // const store = useStore();
    // const addCourse = document.querySelector(".add");

    // addDoc(collection(db, "Courses"), {
    //   title: addCourse.title.value,
    //   grade: addCourse.grade.value,
    // }).then(() => {
    //   addCourse.reset();
    // });
    // const removeCourse = () => {};
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>
