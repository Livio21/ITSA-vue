<template>
  <div
    class="flex flex-col min-h-screen max-w-[1360px] basis-full mx-auto ring ring-slate-100 ring-3 rounded-3xl gap-3 bg-slate-50 ">
    <div
      class="flex justify-center items-end bg-slate-500 h-[200px] w-full  rounded-tr-3xl rounded-tl-3xl shadow-inner p-3 bg-cover "
      id="b">
      <span class=" text-6xl  font-semibold " id="title">{{  course.title  }}</span>
    </div>
    <div class="border-b-2">
      <nav class="self-center text-slate-700 ">
        <ul class="flex text-xl  justify-center divide-x-2 divide-slate-100">
          <li class="active:border-b-2 active:bg-slate-300 hover:bg-slate-100 p-5 rounded-tl-lg cursor-pointer"
            @click="show = 'posts'">
            <a>Posts</a>
          </li>
          <li class="active:border-b-2 active:bg-slate-300 hover:bg-slate-100 p-5 cursor-pointer"
            @click="show = 'materials'; ">
            <a>Resources</a>
          </li>
          <li class="active:border-b-2 active:bg-slate-300 hover:bg-slate-100 p-5 rounded-tr-lg cursor-pointer"
            @click="show = 'about'; getCreatorsData()">
            <a>About</a>
          </li>
        </ul>
      </nav>
    </div>
    <div class="p-10 w-full flex flex-col justify-center items-center">
      <div class="w-full flex flex-col items-center divide-y-2" v-if="show == 'posts'">
        <div>
          <div class="flex flex-col w-full p-3 justify-center items-center gap-3" @focusout="expand = false">
            <div class="flex justify-center items-center gap-3 overflow-hidden p-1">
              <div class="flex flex-col items-center gap-3">
                <transition name="fade">
                  <input v-show="expand" type="text" placeholder="Post Title"
                    class="p-3 h-[50px] max-w-[200px] font-bold rounded-full" @focusin="expand = true"
                    v-model="coursePost.title">
                </transition>

                <div class="relative">
                  <textarea name="" id="" :cols="expand || active ? 100 : 80" :rows="expand || active ? 6 : 3"
                    @dragenter.prevent="toggleActive" @dragleave.prevent="toggleActive" @dragover.prevent
                    @drop="toggleActive(); expand = true;" @drop.prevent="drop" @change="selectedFile"
                    :class="{ 'bg-blue-200 animate-pulse backdrop-blur-3xl': active }"
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
              <span class="">Uploading: {{  isUploaded  }}% </span>
              <span class="material-symbols-outlined animate-spin">sync</span>
            </div>
            <div
              class="self-center w-full flex gap-3 h-fit max-h-[200px] flex-nowrap overflow-x-auto overflow-y-hidden p-4"
              v-if="uploadedFiles">
              <div v-for="(file, index) in uploadedFiles" :key="index"
                class="ring-2 bg-white ring-slate-200 px-2 py-1 rounded flex items-center align-middle divide-x-2">
                <div class=" max-w-[200px] max-h-[100px] overflow-hidden">
                  <span class="text-ellipsis p-1">{{  file.fileName  }}</span>
                </div>
                <button @click="removeFile(index)" class="material-symbols-outlined text-black py-1 px-2">delete_forever
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full flex flex-col items-center">
          <div id="timeline" v-for="post in postData" :key="post.id"
            class=" ring ring-slate-200 p-5 rounded-3xl my-10 w-full max-w-3xl divide-y-2 bg-white">
            <div class="flex flex-col  w-full p-3">
              <span class="  self-center text-2xl font-semibold">{{  post.title  }}</span>
              <div class="flex w-fit items-center gap-3  ">
                <img :src="post.photo" alt="" width="50" height="50" class="rounded-full">
                <div class="flex flex-col">
                  <span class="text-slate-900">{{  post.name  }}</span>
                  <span class="text-slate-700 italic text-xs">{{  post.role  }}</span>
                  <span class="text-slate-400 text-xs">{{  post.date  }}</span>
                </div>
              </div>
            </div>
            <div class="p-4">
              <p>{{  post.text  }}</p>
            </div>
            <div
              class="self-center w-full flex gap-3 h-fit max-h-[200px] flex-nowrap overflow-x-auto overflow-y-hidden p-4"
              v-if="post.files">
              <div v-for="(file, index) in post.files" :key="index">
                <div class="ring-2 bg-white ring-slate-200 px-2 py-1 rounded flex items-center align-middle divide-x-2">
                  <div class=" max-w-[200px] max-h-[100px] flex items-center  divide-x-2">
                    <a :href="file.fileUrl" target="_blank" class="text-slate-700 font-semibold px-2">{{  file.fileName 
                      }}</a>
                    <button @click="showFunc(file.fileUrl)" class="material-symbols-outlined active:scale-95 p-2">
                      open_in_full </button>
                  </div>
                  <transition name="fade">
                    <div v-if="showEmbed && file.fileUrl"
                      class="fixed top-0 bottom-0 left-0 right-0 z-50 w-full h-full backdrop-blur backdrop-brightness-75">
                      <button @click="showFunc"
                        class="material-symbols-outlined bg-gray-500 rounded-full p-1 m-10 absolute top-2 right-2">
                        close </button>
                      <iframe :src="url" frameborder='0' class="w-1/2 h-full mx-auto text-center bg-black/25 "
                        v-click-outside="showFunc">
                      </iframe>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
            <button @click="deletePost(post.files, post.id)">delete</button>
          </div>
        </div>
      </div>
      <div>
      </div>
      <MaterialsComponent v-if="show == 'materials'" :materials="course.materials" :posts="postData">
      </MaterialsComponent>
      <div v-if="show == 'about'" class="w-full">
        <div v-if="course.about" class="flex flex-col items-center w-full gap-5">
          <label class="font-semibold text-slate-700 text-lg" for="creator">Course created by: </label>
          <div v-if="course.creator" class="flex gap-3 p-5 bg-white shadow-md rounded-full" id="creator">
            <img :src="course.creator.photo" class="max-w-[50px] max-h-[50px] rounded-full"
              :title="course.creator.name + ' Profile Picture'" srcset="">
            <div class="flex flex-col gap-2">
              <span class="font-semibold text-slate-700">{{  course.creator.name  }}</span>
              <span>{{  course.creator.email  }}</span>
            </div>
          </div>
          <div class="w-1/2 p-5 bg-white rounded-3xl ">
            <h1>{{  course.about  }}</h1>
          </div>
          <div v-if="students" class="w-full">
            <div>
              <div class="overflow-x-auto relative shadow-md sm:rounded-3xl p-5 bg-white">
                <div class="flex justify-between items-center pb-4  ">

                  <label for="table-search" class="sr-only">Search</label>
                  <div class="relative">
                    <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <svg class="w-5 h-5 text-gray-500 " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <input type="text" id="table-search-users"
                      class="block p-2 pl-10 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 00 ray-400 ue-500 blue-500"
                      placeholder="Search for users" v-model="search">
                  </div>
                </div>
                <table class="w-full text-sm text-left text-gray-500">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" class="py-3 px-6">
                        Name
                      </th>
                      <th scope="col" class="py-3 px-6">
                        Position
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-white border-b  hover:bg-gray-50 " v-for="(student, index) in filteredItems()"
                      :key="index">
                      <th scope="row" class="flex items-center py-4 px-6 text-gray-900 whitespace-nowrap">
                        <img class="w-10 h-10 rounded-full" :src="student.photo" alt="Jese image">
                        <div class="pl-3">
                          <div class="text-base font-semibold">{{  student.name  }}</div>
                          <div class="font-normal text-gray-500">{{  student.email  }}</div>
                        </div>
                      </th>
                      <td class="py-4 px-6 text-slate-700"
                        :class="{ 'font-semibold italic': student.role == 'Teacher' }">
                        {{  student.role  }}
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class=" self-end p-5">
      <button class=" bg-red-500 py-3 px-5 rounded-full text-white font-semibold hover:bg-red-400 active:bg-red-500"
        @click="removeCourse"> Delete </button>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, onSnapshot, deleteDoc, doc, addDoc, getDoc, orderBy, query, where, documentId } from "@firebase/firestore";
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { getDownloadURL, deleteObject, ref as refStrg, uploadBytesResumable } from "firebase/storage";
import { coursePostFiles } from "@/firebase";
import { useStore } from "vuex";
import MaterialsComponent from "@/components/Course/MaterialsComponent.vue";
import router from "@/router";

export default {
  props: ["courseName", "courseID"],
  components: { MaterialsComponent },
  setup(props) {
    watch()
    const store = useStore()
    const show = ref('posts')
    const isUploaded = ref()
    const expand = ref(false)
    const active = ref(false)
    const course = ref({});
    const coursePost = ref({})
    const postData = ref([{}])
    const uploadedFiles = ref([])
    const url = ref('')
    const showEmbed = ref(false)
    const students = ref([{}])
    const search = ref('')
    const getUsers = () => {
      const q = query(collection(db, "Users"), where(documentId(), 'in', store.state.courseUsers))
      console.log(q);
      let arrUsers = []
      onSnapshot(q, (snapshot) => {
        snapshot.forEach(doc => {
          let obj = {
            name: doc.data().name,
            email: doc.data().email,
            photo: doc.data().photo,
            role: doc.data().role
          }
          arrUsers.push(obj)
        })
      })
      students.value = arrUsers
      console.log(arrUsers);
    }
    const filteredItems = () => {
      return students.value.filter((student) => {
        console.log(student);
        return student.name.toLowerCase().includes(search.value.toLowerCase());
      });
    }


    const showFunc = (u) => {

      showEmbed.value = !showEmbed.value
      url.value = u

    }
    const toggleActive = () => {
      active.value = !active.value
    }

    console.log(postData.value);
    const getCourseData = () => {
      onSnapshot(doc(db, "Courses", props.courseID), (doc) => {
        console.log(doc.data().users.includes(store.state.user.uid));
        if (doc.data().users.includes(store.state.user.uid)) {
          console.log(doc.data());
          course.value = doc.data()
          console.log(course.value);
          course.value.picUrl ? document.getElementById("b").style.backgroundImage = `url(${course.value.picUrl})` : "";
          course.value.color ? document.getElementById("title").style.color = course.value.color : "black";
        } else {
          alert('You are not registerd in this course!!!')
          router.push('/')
        }
      });
    }

    const getCreatorsData = () => {
      const usrRef = doc(db, 'Users', course.value.uid)
      getDoc(usrRef).then((doc) => {
        course.value.creator = doc.data()
        console.log(doc.data());
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
        const uploadTask = uploadBytesResumable(coursePostFiles(dropzoneFile.value.name, props.courseID), dropzoneFile.value);
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
    console.log(store.state.user);
    const getFullDate = (dateobj) => {
      var dd = String(dateobj.getDate()).padStart(2, '0');
      var mm = String(dateobj.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = dateobj.getFullYear();
      var h = String(dateobj.getHours()).padStart(2, '0');
      var m = String(dateobj.getMinutes()).padStart(2, '0');
      return dateobj = mm + '/' + dd + '/' + yyyy + ' ' + h + ':' + m
    }
    // console.log(store.state.user.role);
    const createPost = async () => {
      if (coursePost.value.files) {
        coursePost.value.files
      } else {
        coursePost.value.files = []
      }
      coursePost.value.date = new Date();

      coursePost.value.uid = store.state.user.uid
      coursePost.value.name = store.state.user.displayName
      coursePost.value.email = store.state.user.email
      coursePost.value.photo = store.state.user.photoURL
      coursePost.value.role = store.state.user.role

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
    const deletePost = async (postFiles, id) => {
      if (postFiles) {
        let counter = postFiles.length
        postFiles.forEach((file) => {
          const delRef = refStrg(coursePostFiles(file.fileName, props.courseID))
          deleteObject(delRef).then(async () => {
            console.log('file deleted');
            counter--
            console.log(counter);
            if (counter == 0) {
              await deleteDoc(doc(collection(db, "Courses", props.courseID, "Course-Posts"), id)).then(() => {
                console.log('Post deleted');
              })
            }
          }).catch((error) => {
            alert(error)
          });
        })
      } else {
        await deleteDoc(doc(collection(db, "Courses", props.courseID, "Course-Posts"), id)).then(() => {
          console.log('Post deleted');
        });
      }

    };
    const removeFile = (i) => {
      const deleteRef = refStrg(coursePostFiles(uploadedFiles.value[i].fileName, props.courseID));
      deleteObject(deleteRef).then(() => {
        uploadedFiles.value.splice(i, 1)
        console.log('file deleted');
      }).catch((error) => {
        alert(error)
      });

    }
    const getPostData = () => {
      const postRef = collection(db, 'Courses', props.courseID, 'Course-Posts')
      const q = query(postRef, orderBy('date', 'desc'))
      onSnapshot(q, (snapshot) => {
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
            date: getFullDate(doc.data().date.toDate()),
            role: doc.data().role
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
      getUsers()

    });
    return {
      course, removeCourse, show, drop, selectedFile, handleFileUpload, coursePost, createPost,
      toggleActive, active, uploadedFiles, deletePost, removeFile, isUploaded, clearFields, getPostData, getCourseData, postData,
      expand, getFullDate, getCreatorsData, showFunc, showEmbed, url, store, getUsers, students, search, filteredItems
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
