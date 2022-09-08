<template>
    <div class="flex gap-5 bg-slate-100 p-10 rounded-3xl max-w-7xl mx-auto my-10">
        <div class="min-w-[250px]">
            <h1 class="text-6xl font-bold text-slate-700 ">Courses</h1>
            <span class="font-bold text-slate-700 ">Courses created</span>
        </div>
        <button @click="router.push('/create-course')"
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
                    <div class="flex flex-col ">
                        <span class="text-xl font-semibold">Course code: {{ course.code }}</span>
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

</template>

<script setup>

import { db } from '@/firebase';
import { useRouter } from 'vue-router';
import { collection, onSnapshot, query, where, } from '@firebase/firestore';
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const router = useRouter()
const courseData = ref([])
const courseRef = query(collection(db, "Courses"), where("uid", "==", store.state.user.uid))



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


</script>

<style lang="scss" scoped>
.material-symbols-outlined {
    font-size: 50px;
    color: gray;
    font-weight: bold;
}

.fade-enter-active {
    transition: all 0.3s ease-out;
}

.fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active {
    transition: all 0.3s ease-in-out;
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