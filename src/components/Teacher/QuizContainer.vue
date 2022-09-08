<template>
    <div class="flex flex-col gap-5 bg-slate-100 p-10 rounded-3xl max-w-7xl mx-auto my-10">
        <div class="min-w-[250px]">
            <h1 class="text-6xl font-bold text-slate-700">Quizzes</h1>
            <span class="font-bold text-slate-700">Quizzes Created</span>
        </div>
        <button @click="openCreateQuiz"
            class="w-[100px] h-[100px] flex-shrink-0 self-center  bg-white rounded-full relative shadow-md hover:bg-gray-50 active:scale-95">
            <span class="material-symbols-outlined absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 ">
                add
            </span>
        </button>
        <div class=" w-full overflow-hidden  overflow-x-scroll   bg-white p-5 rounded-3xl snap-x" id="container">
            <div v-if="quizzesData" class="flex flex-wrap gap-5">
                <transition-group name="slide-fade">
                    <div class=" min-h-[200px] bg-gray-100 rounded-3xl p-5 pb-6 flex flex-col items-center justify-between relative flex-shrink-0 snap-center"
                        id="quiz" v-for="(quiz, index) in quizzesData" :key="index">
                        <button class="material-symbols-outlined absolute -top-3 -right-3 bg-red-500 rounded-full p-1"
                            style="font-size: 25px; color: white;font-weight: 600;"
                            @click="deleteQuiz(quiz.id)">remove</button>
                        <div class="self-start flex flex-col gap-2 text-slate-700 font-semibold">
                            <span class="text-3xl ">{{ quiz.title }}</span>
                            <span class="">{{ quiz.subject }}</span>
                            <span>Course:{{ quiz.course.title }}</span>
                        </div>
                        <div class="self-center flex flex-col">
                            <span class="text-xl font-semibold">Code: {{ quiz.code }}</span>
                        </div>
                        <div class="flex flex-col text-slate-700">
                            <span>Added on {{ getFullDate(quiz.date.toDate()) }}</span>
                            <span :class="quiz.timelimit.toDate() <= new Date() ? 'text-red-500' : 'text-green-500'">{{
                                                        quiz.timelimit.toDate() <= new Date() ? 'Quiz ended on ' +
                            getFullDate(quiz.timelimit.toDate()) : 'Quiz available till ' +
                            getFullDate(quiz.timelimit.toDate()) }}</span>
    
                        </div>
                        <div class="flex items-center gap-3">
                            <button @click="openOldQuiz(quiz.code, quiz.id)"
                                class="text-slate-700 font-semibold italic text-lg">View
                                Quiz</button>
                            <span class="material-symbols-outlined" style="font-size: 25px; color: gray;font-weight: 600;">
                                open_in_new
                            </span>
                        </div>
                        <div class=" absolute bottom-2 right-3 italic text-slate-500 ">
                            <span>{{ index + 1 + '/' + quizzesData.length }}</span>
                        </div>
                    </div>
                </transition-group>
            </div>
        </div>
        <div v-if="students" class="w-full">
            <div>
                <div class="overflow-x-auto relative shadow-md sm:rounded-3xl p-5 bg-white">
                    <div class="flex justify-between items-center pb-4  ">
                        <label for="table-search" class="sr-only">Search</label>
                        <div class="relative">
                            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <svg class="w-5 h-5 text-gray-500 " aria-hidden="true" fill="currentColor"
                                    viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
                                        <div class="text-base font-semibold">{{ student.name }}</div>
                                        <!-- <div class="font-normal text-gray-500">{{ student.email }}</div> -->
                                    </div>
                                </th>
                                <td class="py-4 px-6 text-slate-700">
                                    <!-- {{ student.role }} -->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>

import { db } from '@/firebase';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from '@firebase/firestore';
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const router = useRouter()
const store = useStore()
const quizzesData = ref([])
const students = ref([])
const search = ref('')
const q = query(collection(db, "Quizzes"), where("creator.uid", '==', store.state.user.uid))
const getFullDate = (dateobj) => {
    var dd = String(dateobj.getDate()).padStart(2, '0');
    var mm = String(dateobj.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = dateobj.getFullYear();

    return dateobj = mm + '/' + dd + '/' + yyyy + ' '
}
const filteredItems = () => {
    return students.value.filter((student) => {
        console.log(student);
        return student.name.toLowerCase().includes(search.value.toLowerCase());
    });
}
const openOldQuiz = (code, id) => {
    store.commit("SET_QUIZ", code)
    console.log(id);
    router.push({ name: 'quiz', params: { quizId: id } })
}
const openCreateQuiz = () => {
    router.push('/create-quizzes')
}
const deleteQuiz = (id) => {
    deleteDoc(doc(db, "Quizzes", id))
    
}
const getStudentQuizInfo = () => {
    getDocs(q).then((docs) => {
        docs.forEach((doc) => {
            console.log(doc.data(), doc.id);
        })
    })
}
getStudentQuizInfo()
const getQuizzes = () => {
    onSnapshot(q, (snapshot) => {
        let arr = []
        snapshot.forEach(doc => {
            let obj = {
                id: doc.id,
                maxpoints: doc.data().maxpoints,
                date: doc.data().date,
                course: doc.data().course,
                creator: doc.data().creator,
                title: doc.data().title,
                code: doc.data().code,
                subject: doc.data().subject,
                finished: doc.data().finished,
                registeredUsers: doc.data().registeredUsers,
                timelimit: doc.data().timelimit
            }

            arr.push(obj)
        })
        quizzesData.value = arr
        console.log(quizzesData.value);
    }, (err) => {
        console.log(err);
    })
}
getQuizzes()


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