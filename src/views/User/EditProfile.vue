<template>
  <div>

    <div
      class="flex flex-col max-w-fit p-10 my-10 mx-auto  justify-center items-center gap-3 bg-slate-200 rounded-lg shadow-lg">
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
      <form action="" @submit="updateUser(), updateEmail()"
        class="editForm flex flex-col gap-3 bg-slate-300 p-10 rounded-lg">
        <label for="username">Full Name</label>
        <input type="text" v-model="userDetails.displayName" :placeholder="userData.displayName" name="username" />
        <label for="email">Email</label>

        <input type="email" v-model="userDetails.email" :placeholder="userData.email" name="email" />
        <label for="pfp">Profile Picture</label>

        <input type="file" v-on:change="handleFileUpload()" accept="image/" />

        <button type="submit"
          class="bg-green-500 w-48 mx-auto rounded-full text-white text-xl p-2 hover:shadow-md hover:scale-105 hover:transition-all">
          Save
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { uploadBytes } from "firebase/storage";
import { profilePicture } from "@/firebase";

import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const userData = store.state.user;
    const userDetails = ref({});
    const file = ref(null);

    const handleFileUpload = async () => {
      await uploadBytes(profilePicture(file.value.name), file).then(() => {
        console.log("Uploaded a blob or file!");
      });
    };

    const updateUser = () => {
      store.dispatch("updateUser", userDetails.value);
    };
    const updateEmail = () => {
      store.dispatch("updateUserEmail", userDetails.value);
    };
    const clipboardF = () => {
      const uid = userData.uid;

      navigator.clipboard.writeText(uid);

      alert("Copied succesfully!");
    };

    const userPfp = () => {
      if (userData.photoURL) {
        // console.log(user.photoURL);
        return userData.photoURL;
      } else {
        return "https://freesvg.org/img/abstract-user-flat-4.png";
      }
    };

    onMounted(() => { });
    return {
      store,
      userData,
      userDetails,
      clipboardF,
      userPfp,
      updateUser,
      updateEmail,
      handleFileUpload,
      file,
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.editForm {
  input {
    padding: 10px;
    border-radius: 5px;
  }
}
</style>
