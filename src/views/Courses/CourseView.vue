<template>
  <div
    class="flex flex-col min-h-screen max-w-[1360px] basis-full mx-auto p-10 ring ring-slate-100 ring-3 rounded-3xl gap-3 bg-slate-50">
    <div class=" self-end">
      <button class=" bg-red-500 py-3 px-5 rounded-full text-white font-semibold hover:bg-red-400 active:bg-red-500"
        @click="removeCourse"> Delete </button>
    </div>
    <div
      class="flex justify-center items-end bg-slate-500 h-[200px] w-full  rounded-tr-3xl rounded-tl-3xl shadow-inner p-3 bg-cover"
      id="b">
      <span class=" text-4xl text-white font-semibold " id="title">{{ course.title }}</span>
    </div>
    <!-- <div class="flex justify-start ring ring-slate-100 max-w-fit rounded-full">
      <input class="text-xl rounded-l-full w-[300px] px-5 z-10" placeholder="Search" />
      <button
        class=" bg-slate-100 rounded-r-full hover:bg-slate-200 active:scale-95 active:transition-all active:bg-slate-300 z-0">
        <span class="material-symbols-outlined text-black p-3">
          search
        </span>
      </button>
    </div> -->
    <div class="border-b-2">
      <nav class="self-center text-slate-700 ">
        <ul class="flex text-xl  justify-center divide-x-2 divide-slate-100">
          <li class="active:border-b-2 active:bg-slate-300 hover:bg-slate-100 p-5 rounded-tl-lg cursor-pointer"
            @click="show = 'posts'">
            <a>Posts</a>
          </li>
          <li class="active:border-b-2 active:bg-slate-300 hover:bg-slate-100 p-5 cursor-pointer"
            @click="show = 'tools'">
            <a>Tools</a>
          </li>
          <li class="active:border-b-2 active:bg-slate-300 hover:bg-slate-100 p-5 rounded-tr-lg cursor-pointer"
            @click="show = 'quizzes'">
            <a>Quizzes</a>
          </li>
        </ul>
      </nav>
    </div>
    <div>
      <div class="w-100 flex flex-col justify-center items-center" v-if="show == 'posts'">
        <div class="flex flex-col w-full p-3 justify-center items-center gap-3 border-b-2" @focusout="expand = false">
          <div class="flex justify-center items-center gap-3 overflow-hidden p-1">
            <div class="flex flex-col items-center gap-3">
              <transition name="fade">
                <input v-show="expand" type="text" placeholder="Post Title"
                  class="p-3 h-[50px] max-w-[200px] font-bold rounded-full" @focusin="expand = true"
                  v-model="coursePost.title">
              </transition>

              <div class="relative">
                <textarea name="" id="" :cols="expand ? 100 : 80" :rows="expand ? 6 : 3"
                  @dragenter.prevent="toggleActive" @dragleave.prevent="toggleActive" @dragover.prevent
                  @drop="toggleActive" @drop.prevent="drop" @change="selectedFile"
                  :class="{ 'bg-blue-200 animate-pulse': active }"
                  class="rounded-3xl p-3 resize-none shadow-inner focus:outline-slate-200 transition-all"
                  placeholder="Hello..." v-model="coursePost.text" @focusin="expand = true"
                  title="Drag files."></textarea>
                <label for="dropzoneFile"
                  class="material-symbols-outlined absolute bottom-4  right-3 z-10 bg-blue-500 rounded-3xl cursor-pointer text-white hover:scale-105"
                  title="Add files">add</label>
                <input type="file" id="dropzoneFile"
                  accept="image/*,.pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  class="dropzoneFile hidden">
              </div>
            </div>
            <transition name="fade">
              <button @click="createPost" v-show="expand" @focus="expand = true"
                class="bg-blue-500 text-white p-3 h-[60px] w-[150px] rounded-full text-xl hover:bg-blue-600 active:bg-blue-500 active:scale-95">Post</button>
            </transition>
          </div>
          <div v-if="isUploaded" class="flex align-middle justify-center p-1">
            <span class="">Uploading: {{ isUploaded }}% </span>
            <span class="material-symbols-outlined animate-spin">sync</span>
          </div>
          <div
            class="self-center w-full flex gap-3 h-fit max-h-[200px] flex-nowrap overflow-x-auto overflow-y-hidden p-4"
            v-if="uploadedFiles">
            <div v-for="(file, index) in uploadedFiles" :key="index"
              class="ring-2 bg-white ring-slate-200 px-2 py-1 rounded flex items-center align-middle divide-x-2">
              <div class=" max-w-[200px] max-h-[100px] ">
                <p class=" text-ellipsis p-1">{{ file.fileName }}</p>
              </div>
              <button @click="removeFile(index)" class="material-symbols-outlined text-black py-1 px-2">delete_forever
              </button>
            </div>
          </div>
        </div>
        <div id="timeline" v-for="post in postData" :key="post.id"
          class=" ring ring-slate-200 p-5 rounded-3xl my-10 w-full max-w-3xl divide-y-2 bg-white">
          <div class="flex flex-col  w-full p-3">
            <span class="  self-center text-2xl font-semibold">{{ post.title }}</span>
            <div class="flex w-fit items-center gap-3  ">
              <img :src="post.photo" alt="" width="50" height="50" class="rounded-full">
              <div class="flex flex-col">
                <span class="text-slate-900">{{ post.name }}</span>
                <span class="text-slate-400 text-xs">{{ post.date }}</span>
              </div>
            </div>
          </div>
          <div class="p-4">
            <p>{{ post.text }}</p>
          </div>
          <div
            class="self-center w-full flex gap-3 h-fit max-h-[200px] flex-nowrap overflow-x-auto overflow-y-hidden p-4"
            v-if="post.files">
            <div v-for="(file, index) in post.files" :key="index"
              class="ring-2 bg-white ring-slate-200 px-2 py-1 rounded flex items-center align-middle divide-x-2">
              <div class=" max-w-[200px] max-h-[100px] ">
                <a :href="file.fileUrl" target="_blank" class=" text-ellipsis p-1">{{ file.fileName }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
      </div>
      <ToolsComponent v-if="show == 'tools'"></ToolsComponent>
      <QuizzesComponent v-if="show == 'quizzes'"></QuizzesComponent>
    </div>

  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, onSnapshot, deleteDoc, doc, addDoc } from "@firebase/firestore";
import { onBeforeMount, onMounted, ref } from "vue";
import ToolsComponent from "@/components/Course/ToolsComponent.vue";
import QuizzesComponent from "@/components/Course/QuizzesComponent.vue";
import { getDownloadURL, deleteObject, ref as refStrg, uploadBytesResumable } from "firebase/storage";
import { coursePostFiles } from "@/firebase";
import { auth } from "@/firebase";

export default {
  props: ["courseName", "courseID"],
  components: { ToolsComponent, QuizzesComponent },
  setup(props) {
    const show = ref('posts')
    const isUploaded = ref()
    const expand = ref(false)
    const active = ref(false)
    const course = ref({});
    const coursePost = ref({})
    const postData = ref([{}])
    const uploadedFiles = ref([])

    const toggleActive = () => {
      active.value = !active.value
    }
    const getCourseData = () => {
      onSnapshot(doc(db, "Courses", props.courseID), (doc) => {
        console.log(doc.data());
        course.value = doc.data()
        console.log(course.value);
        course.value.picUrl ? document.getElementById("b").style.backgroundImage = `url(${course.value.picUrl})` : "";
        course.value.color ? document.getElementById("title").style.color = course.value.color : "black";
      });
    }



    const removeCourse = async () => {
      await deleteDoc(doc(db, "Courses", props.courseID)).then(() => {
        location.reload();
      });
    };
    const dropzoneFile = ref({})
    const drop = (e) => {
      dropzoneFile.value = e.dataTransfer.files[0]
      handleFileUpload()
    }
    const selectedFile = () => {
      dropzoneFile.value = document.querySelector(".dropzoneFile").files[0]
      handleFileUpload()
    }

    const handleFileUpload = () => {
      if (dropzoneFile.value) {
        const uploadTask = uploadBytesResumable(coursePostFiles(dropzoneFile.value.name), dropzoneFile.value);
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            isUploaded.value = parseInt(progress)
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

            isUploaded.value = 0
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              let obj = {
                fileUrl: downloadURL,
                fileName: dropzoneFile.value.name
              }
              uploadedFiles.value.push(obj)
              coursePost.value.files = uploadedFiles.value
              console.log(uploadedFiles.value);
            }).catch((error) => {
              alert(error)
            })
          }
        );
      }
    };

    console.log(props.courseName);

    const getFullDate = (dateobj) => {
      var dd = String(dateobj.getDate()).padStart(2, '0');
      var mm = String(dateobj.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = dateobj.getFullYear();
      var h = String(dateobj.getHours()).padStart(2, '0');
      var m = String(dateobj.getMinutes()).padStart(2, '0');
      return dateobj = mm + '/' + dd + '/' + yyyy + ' ' + h + ':' + m
    }

    const createPost = async () => {
      if (coursePost.value.files) {
        coursePost.value.files
      } else {
        coursePost.value.files = []
      }
      coursePost.value.date = new Date();

      coursePost.value.uid = auth.currentUser.uid
      coursePost.value.name = auth.currentUser.displayName
      coursePost.value.email = auth.currentUser.email
      coursePost.value.photo = auth.currentUser.photoURL

      console.log(coursePost.value);
      if (coursePost.value) {
        const postRef = collection(db, 'Courses', props.courseID, 'Course-Posts')
        await addDoc(postRef, coursePost.value).then(() => {
          clearFields()
        })

      }
    }
    const clearFields = () => {
      coursePost.value.text = ''
      coursePost.value.title = ''
      uploadedFiles.value = null
    }
    const deletePost = async () => {
      await deleteDoc(doc(collection(db, "Courses", props.courseID), "Course-Posts", coursePost.value.id)).then(() => {
        location.reload();
      });
    };
    const removeFile = (i) => {
      const deleteRef = refStrg(coursePostFiles(uploadedFiles.value[i].fileName));
      // Delete the file
      deleteObject(deleteRef).then(() => {
        uploadedFiles.value.splice(i, 1)
        console.log('file deleted');
      }).catch((error) => {
        alert(error)
      });

    }
    const getPostData = () => {
      const postRef = collection(db, 'Courses', props.courseID, 'Course-Posts')
      onSnapshot(postRef, (snapshot) => {
        let arr = []
        snapshot.docs.forEach((doc) => {
          let obj = {
            id: doc.id,
            title: doc.data().title,
            text: doc.data().text,
            files: doc.data().files,
            uid: doc.data().uid,
            email: doc.data().email,
            name: doc.data().name,
            photo: doc.data().photo,
            date: getFullDate(doc.data().date.toDate())
          }
          console.log(doc.data().user);
          arr.push(obj);
        })
        postData.value = arr
        console.log(postData.value);
      })
    }
    onBeforeMount(() => {

    })
    onMounted(() => {
      getCourseData()
      getPostData()
    });
    return {
      course, removeCourse, show, drop, selectedFile, handleFileUpload, coursePost, createPost,
      toggleActive, active, uploadedFiles, deletePost, removeFile, isUploaded, clearFields, getPostData, getCourseData, postData,
      expand, getFullDate
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
