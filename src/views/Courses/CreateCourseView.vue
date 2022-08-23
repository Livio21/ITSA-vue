<template>
  <div class="">
    <form @submit.prevent="addCourse"
      class="flex flex-col min-h-screen max-w-[1360px] basis-full mx-auto p-10 ring ring-slate-100 ring-3 rounded-3xl gap-3 relative">
      <div @dragenter.prevent="toggleActive" @dragleave.prevent="toggleActive" @dragover.prevent @drop="toggleActive"
        @drop.prevent="drop" @change="selectedFile" id="a"
        class="flex justify-center items-end relative bg-slate-500 h-[200px] gap-5 w-full  rounded-tr-3xl rounded-tl-3xl shadow-inner p-3 overflow-hidden "
        :class="{
          ' rounded-lg p-5 m-3 transition-all bg-blue-400 duration-200 animate-pulse': active
        }">
        <div class=" absolute flex -top-[7px] -right-[33px] w-[100px] h-[50px] bg-blue-500 rotate-45 z-10 ">
          <label for="coursePicture"
            class="material-symbols-outlined absolute top-[18px] left-[38px] text-white rotate-45 cursor-pointer animate-pulse"
            :class="{ 'animate-spin cursor-wait': !isUploaded, 'opacity-0 animate-none': active }">
            {{ !isUploaded ? 'hourglass_top' : 'add' }}
          </label>
        </div>
        <div class="z-10">
          <input type="text" name="title" v-model="newCourse.title" placeholder="Insert title" id="title"
            class="w-[250px] h-[50px]  p-3 text-center bg-transparent focus:ring-0 focus text-4xl focus:text-white font-semibold focus:outline-none focus:shadow-none "
            required />
          <label for="color" class="material-symbols-outlined cursor-pointer p-3 animate-pulse">colorize</label>
        </div>
        <input type="color" id="color" class="opacity-0" v-model="newCourse.color" @input="colorPicker">
        <input type="file" accept="image/*" id="coursePicture" class="coursePicture hidden" :disabled="!isUploaded">
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
      <div class=" self-end justify-self-end">
        <button type="submit"
          class="bg-blue-500 rounded-full w-[200px] p-3 text-white font-semibold hover:bg-blue-400 hover:scale-105 hover:shadow-xl active:bg-blue-500 active:scale-100 active:shadow-none">Add
          new course</button>
      </div>
    </form>
  </div>
</template>

<script>
import { db } from "@/firebase";

import { ref } from "vue";

import { addDoc, deleteDoc, collection, onSnapshot, doc } from "@firebase/firestore";
import { uploadBytes, getDownloadURL } from "firebase/storage";

import { coursePictureStrg } from "@/firebase"



export default {

  setup() {
    const active = ref(false)
    const newCourse = ref({})
    const courses = ref([])
    const courseID = ref(null)
    const isUploaded = ref(true)


    let coursePicture = ref({})
    const drop = (e) => {
      coursePicture.value = e.dataTransfer.files[0]
      handleFileUpload()
    }
    const selectedFile = () => {
      coursePicture.value = document.querySelector(".coursePicture").files[0]
      handleFileUpload()
    }

    const changeBackground = () => {
      if (isUploaded.value) {
        document.getElementById('a').style.backgroundImage = `url(${newCourse.value.picUrl})`
      }
    }
    const colorPicker = () => {
      if (newCourse.value.color) {
        document.getElementById('a').style.color = newCourse.value.color
      }
      console.log(newCourse.value.color);
    }
    const handleFileUpload = async () => {
      if (coursePicture.value) {
        isUploaded.value = false
        await uploadBytes(coursePictureStrg(coursePicture.value.name), coursePicture.value).then(() => {
          getDownloadURL(coursePictureStrg(coursePicture.value.name)).then((url) => {
            newCourse.value.picUrl = url
            isUploaded.value = true
            changeBackground()
          }).catch((err) => {
            console.log(err.message, 'error getting the img url');
          })
          console.log("Uploaded a file!");
          console.log(coursePicture.value.name);
        })
      }
    };

    const addCourse = async () => {
      await addDoc(collection(db, 'Courses'), newCourse.value)
    }
    // const q = query(doc(collection(db, 'Courses'),where(doc.id == courseID.value)))
    const removeCourse = async () => {
      await deleteDoc(doc(db, 'Courses', courseID.value))
    }
    const toggleActive = () => {
      active.value = !active.value
    }
    console.log(courses.value);
    onSnapshot(collection(db, 'Courses'), (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const test = {
          id: doc.id,
          title: doc.data().title,
          picUrl: doc.data().picUrl,
          color: doc.data().color
        }

        courses.value.push(test)
      })
      console.log(courses.value);
    })
    return { newCourse, removeCourse, addCourse, courseID, toggleActive, drop, selectedFile, isUploaded, handleFileUpload, coursePicture, changeBackground, colorPicker };
  },

};
</script>

<style lang="scss" scoped>
</style>
