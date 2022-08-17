<template>
  <div>
    <div class="flex flex-col max-w-fit p-10 my-10 mx-auto  justify-center items-center gap-3 bg-slate-200 rounded-lg shadow-lg">
      <img :src="userPfp()" width="100" alt="" class="rounded-full ring" />
      <h1>Name: {{ userData.displayName }}</h1>
      <h1>Email: {{ userData.email }}</h1>
      <h1>Provider: {{ userData.providerId }}</h1>
      <h1 class="">
        Unique ID:
        <span @click="clipboardF()" id="uid"
          class="italic hover:text-gray-900 rounded-sm transition-all bg-black hover:bg-inherit p-1 cursor-pointer">{{
              userData.uid
          }}</span>
        <span @click="clipboardF()" class="material-symbols-outlined p-1">
          content_copy
        </span>
      </h1>
    </div>

  </div>
</template>

<script>
import { onMounted } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const userData = store.state.user;

    const clipboardF = () => {
      const uid = userData.uid;

      navigator.clipboard.writeText(uid);

      alert("Copied succesfully!");
    };
    const userPfp = () => {
      if (userData.photoURL) {
        console.log(userData.photoURL);
        return userData.photoURL;
      } else {
        return "https://freesvg.org/img/abstract-user-flat-4.png";
      }
    };

    onMounted(() => {
      // console.log(userData);
    });
    return { store, userData, clipboardF, userPfp };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
