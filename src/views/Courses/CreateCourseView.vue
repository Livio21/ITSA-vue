<template>
  <div class="">
    <form @submit.prevent="addCourse"
      class="flex flex-col min-h-screen max-w-[1360px] basis-full mx-auto ring ring-slate-100 ring-3 rounded-3xl gap-3 relative bg-slate-50">
      <div @dragenter.prevent="toggleActive" @dragleave.prevent="toggleActive" @dragover.prevent @drop="toggleActive"
        @drop.prevent="drop" @change="selectedFile" id="a"
        class="flex justify-center items-end relative bg-slate-500 h-[200px] gap-5 w-full  rounded-tr-3xl rounded-tl-3xl shadow-inner p-3 overflow-hidden bg-cover "
        :class="{
          ' rounded-lg p-5 m-3 transition-all bg-blue-400 duration-200 animate-pulse': active
        }">
        <div class=" absolute flex -top-[7px] -right-[33px] w-[100px] h-[50px] bg-blue-500 rotate-45 z-10 ">
          <label for="coursePicture"
            class="material-symbols-outlined absolute top-[18px] left-[38px] text-white rotate-45 cursor-pointer animate-pulse"
            :class="{ 'animate-spin cursor-wait': !isUploaded, 'opacity-0 animate-none': active }">
            {{  !isUploaded ? 'hourglass_top' : 'add'  }}
          </label>
        </div>
        <div class="z-10">
          <input type="text" name="title" v-model="newCourse.title" placeholder="Insert title" id="title"
            class="w-[250px] h-[50px] hover:bg-white/5 p-3 text-center bg-transparent focus:ring-0 focus text-4xl focus:text-white font-semibold focus:outline-none focus:shadow-none "
            required />
          <label for="color" class="material-symbols-outlined cursor-pointer p-3 animate-pulse">colorize</label>
        </div>
        <input type="color" id="color" class="opacity-0" v-model="newCourse.color" @input="textColorPicker">
        <input type="file" accept="image/*" id="coursePicture" class="coursePicture hidden" :disabled="!isUploaded">
      </div>
      <div class="flex flex-col items-center gap-5 p-10 w-full">
        <div class="flex flex-col">
          <label for="description" class="mb-3 font-semibold  text-slate-700">About:</label>
          <span class="italic text-slate-500 text-xs">Course description.</span>
          <textarea name="description" id="" cols="70" rows="6" class="p-3 shadow-inner rounded-3xl resize-none"
            v-model="newCourse.about"></textarea>
        </div>
        <div>
          <label for="coursecode" class="font-semibold text-slate-700 ">Course code:</label><br>
          <span class="italic text-slate-500 text-xs">Code to be used by students to register.</span><br>
          <input type="text" class=" p-3 shadow-inner rounded-full text-center font-semibold" v-model="newCourse.code"
            pattern="[A-Za-z0-9]{5}" maxlength="5" required>
          <button @click="randomCodeGen" type="button"
            class="ml-5 bg-green-600 px-3 py-2 rounded-full text-white font-semibold hover:bg-green-500 active:scale-95 active:bg-green-700">Random</button>
        </div>
      </div>

      <div class="p-10 border-t-2">
        <h1 class="mb-3 font-semibold text-slate-700 ">Upload course resources here:</h1>
        <div class="w-full">
          <span class="italic text-slate-500 text-xs">Course materials.</span>
          <div @dragenter.prevent="toggleActive" @dragleave.prevent="toggleActive" @dragover.prevent
            @drop="toggleActive" @drop.prevent="materialsDrop" @change="selectedMaterial"
            class=" rounded-3xl overflow-hidden relative w-1/2 h-[200px] bg-white shadow-inner mx-auto  "
            :class="{ ' rounded-lg  transition-all bg-blue-400 duration-200 animate-pulse': active }">
            <div class=" text-white  absolute bottom-0 right-0 active:scale-95 active:transition-all ">
              <label for="dropzoneTool" :class="{ 'opacity-0 animate-none': active }"
                class=" w-[50px] h-[50px] bg-blue-500 flex hover:animate-none hover:scale-105 animate-pulse justify-center  z-10  cursor-pointer ">
                <span class="material-symbols-outlined  self-center ">add</span>
              </label>
            </div>
            <input type="file"
              accept="image/*,.pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              id="courseTool" class="courseTool hidden">
          </div>
          <span v-if="upProgress">{{  upProgress + '%'  }}</span>
          <div
            class="self-center w-full flex gap-3 h-fit max-h-[200px] flex-nowrap overflow-x-auto overflow-y-hidden p-4"
            v-if="newCourse.materials">
            <div v-for="(file, index) in newCourse.materials" :key="index"
              class="ring-2 bg-white ring-slate-200 px-2 py-1 rounded flex items-center align-middle divide-x-2">
              <div class=" max-w-[200px] max-h-[100px] ">
                <a :href="file.url" target="_blank" class=" text-ellipsis p-1">{{  file.name  }}</a>
              </div>
            </div>
          </div>
        </div>
        <div>
        </div>
      </div>
      <div class="self-end justify-self-end p-10">
        <button type="submit"
          class="bg-blue-500 rounded-full w-[200px] p-3 text-white font-semibold hover:bg-blue-400 hover:scale-105 hover:shadow-xl active:bg-blue-500 active:scale-100 active:shadow-none">Add
          new course</button>
      </div>
    </form>
  </div>
</template>

<script>
import { db, auth } from "@/firebase";
import { ref } from "vue";
import { addDoc, deleteDoc, collection, onSnapshot, doc, } from "@firebase/firestore";
import { uploadBytes, getDownloadURL, ref as refStrg, deleteObject, uploadBytesResumable } from "firebase/storage";
import { coursePictureStrg, courseMaterials } from "@/firebase"
import router from "@/router";



export default {
  components: {},

  setup() {
    const active = ref(false)
    const newCourse = ref({})
    const courses = ref([])
    const courseID = ref(null)
    const isUploaded = ref(true)
    const upProgress = ref()
    const materials = ref([{}])

    const addResources = () => {
    }
    const deleteResource = (i) => {
      const deleteRef = refStrg(courseMaterials(materials.value[i].fileName));
      // Delete the file
      deleteObject(deleteRef).then(() => {
        materials.value.splice(i, 1)
        console.log('file deleted');
      }).catch((error) => {
        alert(error)
      });
    }
    const randomCodeGen = () => {
      var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      var result = ""
      var charactersLength = characters.length;

      for (var i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      newCourse.value.code = result
    }

    let coursePicture = ref({})
    const drop = (e) => {
      coursePicture.value = e.dataTransfer.files[0]
      handleFileUpload()
    }
    const selectedFile = () => {
      coursePicture.value = document.querySelector(".coursePicture").files[0]
      handleFileUpload()
    }
    let material = ref()
    const materialsDrop = (e) => {
      material.value = e.dataTransfer.files[0]
      handleMaterialsUpload()
    }
    const selectedMaterial = () => {
      material.value = document.querySelector(".courseTool").files[0]
      handleMaterialsUpload()
    }
    const changeBackground = () => {
      if (isUploaded.value) {
        document.getElementById('a').style.backgroundImage = `url(${newCourse.value.picUrl})`
      }
    }
    const textColorPicker = () => {
      if (newCourse.value.color) {
        document.getElementById('title').style.color = newCourse.value.color
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
    const handleMaterialsUpload = async () => {
      if (material.value) {
        const uploadTask = uploadBytesResumable(courseMaterials(material.value.name), material.value);
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            upProgress.value = parseInt(progress)
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            switch (error.code) {
              case 'storage/unauthorized':
                break;
              case 'storage/canceled':
                break;
              case 'storage/unknown':
                break;
            }
          },
          () => {
            upProgress.value = 0
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              let obj = {
                url: downloadURL,
                name: material.value.name
              }
              materials.value.push(obj)
              newCourse.value.materials = materials.value
              console.log(materials.value);
            }).catch((error) => {
              alert(error)
            })
          }
        );
      }
    };
    const addCourse = async () => {
      newCourse.value.uid = auth.currentUser.uid
      newCourse.value.users = []
      newCourse.value.users.push(auth.currentUser.uid)
      await addDoc(collection(db, 'Courses'), newCourse.value).then((result) => {
        console.log(result);
        router.push({ name: 'courses', params: { courseName: newCourse.value.title.replaceAll(' ', '-'), courseID: result.id } })
        console.log(router.currentRoute.value);
      })
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
          color: doc.data().color,
          code: doc.data().code,
          about: doc.data().about
        }
        courses.value.push(test)
      })
      console.log(courses.value);
    })
    return {
      newCourse, removeCourse, addCourse, courseID, toggleActive, drop, selectedFile,
      isUploaded, handleFileUpload, coursePicture, changeBackground, textColorPicker, randomCodeGen,
      addResources, materials, deleteResource, selectedMaterial, materialsDrop, material, handleMaterialsUpload, upProgress
    };
  },

};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
