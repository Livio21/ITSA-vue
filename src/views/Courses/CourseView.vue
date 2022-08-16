<template>
  <div class="flex mx-auto p-10">
    <header class="bg-slate-300 p-10 rounded-lg">
      <img src="" class="courseImg" alt="" />
      <h1>Course name</h1>
    </header>
    <div></div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, getDocs } from "@firebase/firestore";
import { onMounted } from "vue";
export default {
  setup() {
    const test = async () => {
      try {
        const res = await collection(db, "Courses");
        console.log(res);
      } catch (err) {
        console.log("error");
      }
    };
    const test2 = async () => {
      try {
        const res = await getDocs(collection(db, "Courses"));
        res.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
        });
        console.log(res);   
      } catch (error) {
        console.log("error");
      }
    };

    onMounted(() => {
      test();
      test2();
    });
    return { test, test2 };
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
