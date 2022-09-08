<template>
    <div class="flex gap-5 bg-slate-100 p-10 rounded-3xl max-w-7xl mx-auto my-10">
        <div class="min-w-[250px]">
            <h1 class="text-6xl font-bold text-slate-700">Courses</h1>
            <span class="font-bold text-slate-700">Courses registered</span>
        </div>
        <button @click="showAddCourseModal"
            class="w-[100px] h-[100px] flex-shrink-0 self-center  bg-white rounded-full relative shadow-md hover:bg-gray-50 active:scale-95">
            <span class="material-symbols-outlined absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 ">
                add
            </span>
        </button>
        <div class="flex w-full  overflow-hidden  overflow-x-scroll  gap-4 bg-white p-5 rounded-3xl snap-x text-slate-700"
            id="container">
            <transition-group name="slide-fade">
                <div class="basis-[200px] min-h-[200px] bg-gray-100 rounded-3xl p-5 pb-6 flex flex-col items-center justify-between relative flex-shrink-0 snap-center"
                    id="quiz" v-for="(course, index) in courseData" :key="index">
                    <div class="self-start flex flex-col ">
                        <span class="text-3xl font-semibold">{{ course.title }}</span>
                    </div>
                    <div class="flex flex-col text-slate-700">
                    </div>
                    <div class="flex items-center gap-3">
                        <button @click="goToCourse(course.title, course.id)"
                            class="text-slate-700 font-semibold italic text-lg">View
                            Course</button>
                        <span class="material-symbols-outlined" style="font-size: 25px; color: gray;font-weight: 600;">
                            open_in_new
                        </span>
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
    <div>
        <transition name="fade">
            <div v-if="addCourse" class="fixed top-0 left-0 w-full h-full z-50 backdrop-blur backdrop-brightness-75 ">
                <form v-click-outside="showAddCourseModal" @submit.prevent="setUserAccess(code)"
                    class="flex flex-col gap-4 justify-center items-center w-[400px] h-[400px] bg-slate-100 rounded-3xl p-10  absolute  top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 ring ring-slate-100">
                    <h1 class="text-5xl font-bold  content-start text-slate-700">Course</h1>
                    <span class="text-slate-700 text-sm">Enter Course code provided:</span>
                    <span v-if="displayError" class="text-red-500 italic text-sm animate-pulse">{{displayError}}</span>
                    <input type="text"
                        class=" p-3 rounded-3xl drop-shadow-md text-xl text-center font-semibold text-gray-700"
                        pattern="[A-Za-z0-9]{5}" maxlength="5" placeholder="Ex. abc123" v-model="code">
                    <button type="submit" class=" mt-10 w-[150px] h-[50px] bg-blue-600 drop-shadow-lg text-xl rounded-full font-semibold
                         text-white hover:brightness-110 active:bg-blue-700 active:scale-95">Add</button>
                </form>
            </div>
        </transition>
    </div>
</template>

<script setup>

import { db } from '@/firebase';
import { useRouter } from 'vue-router';
import { arrayUnion, collection, onSnapshot, query, updateDoc, where, doc, getDocs } from '@firebase/firestore';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { auth } from '@/firebase';

const store = useStore()
const router = useRouter()
const code = ref('')
const courseData = ref([])
const addCourse = ref(false)
const displayError = ref('')
const courseRef = query(collection(db, "Courses"), where("users", "array-contains", store.state.user.uid))
const showAddCourseModal = () => {
    addCourse.value = !addCourse.value
}


const getCourses = () => {
    onSnapshot(courseRef, (snapshot) => {
        let arr = []
        snapshot.forEach(doc => {
            let obj = {
                id: doc.id,
                title: doc.data().title,
                code: doc.data().code,
                color: doc.data().color
            }
            arr.push(obj)
        })
        courseData.value = arr
        console.log(courseData.value);
    })
}
getCourses()

const goToCourse = (title, id) => {
    router.push({ name: 'courses', params: { courseName: title, courseID: id } })

}
const setUserAccess = () => {
    const re = /[A-Za-z0-9]{5}/
    if (code.value) {
        if (re.test(code.value)) {
            const q = query(collection(db, "Courses"), where("code", "==", code.value))
            getDocs(q).then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((course) => {
                        console.log(course);
                        console.log(course.data().title.replaceAll(' ', '-'), course.id);
                        console.log(course.data().users);
                        const docRef = doc(db, "Courses", course.id)
                        if (course.data().users) {
                            if (course.data().users.includes(auth.currentUser.uid)) {
                                displayError.value = 'Already registered in this course.'
                                code.value = ''
                            } else {
                                updateDoc(docRef, {
                                    users: arrayUnion(auth.currentUser.uid)
                                }).then(() => {
                                    updateDoc(doc(db, "Users", auth.currentUser.uid), {
                                        courses: arrayUnion(course.id)
                                    }).then(() => {
                                        showAddCourseModal()
                                    }).catch((err) => {
                                        console.log(err);
                                    })
                                }).catch((err) => {
                                    console.log(err);
                                })
                            }
                        } else {
                            updateDoc(docRef, {
                                users: [
                                    auth.currentUser.uid
                                ]
                            })
                        }
                    })
                } else {
                    displayError.value = "Course doesn't exist or wrong code."
                }
            }).catch((err) => {
                console.log(err);
            }
            )
        } else {
            displayError.value = 'Illegal characters / Bad length.'
            code.value = ''
        }
    } else {
        displayError.value = 'Please insert a code.'
        code.value = ''

    }
}
</script>

<style lang="scss" scoped>
.material-symbols-outlined {
    font-size: 50px;
    color: gray;
    font-weight: bold;
}

.fade-enter-active {
    transition: all 0.2s ease-out;
}

.fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active {
    transition: all 0.6s ease-in-out;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
}

#container::-webkit-scrollbar {
    width: 0.6vw;
    border-bottom: 5px solid rgba(255, 255, 255, 0);
}

#container::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 10px 10px rgb(211, 211, 211);
    border-radius: 10px;
    border: solid 3px transparent;
}

#container::-webkit-scrollbar-track {
    box-shadow: inset 0 0 10px 10px rgba(255, 255, 255, 0);
    border: solid 3px transparent;
}

#container::-webkit-scrollbar-button {
    background-color: rgba(240, 248, 255, 0);
}

#container::-webkit-scrollbar-thumb:hover {
    background: rgb(219, 219, 219);
}

#container::-webkit-scrollbar-thumb:active {
    background: rgb(192, 192, 192);
}
</style>