<template>
    <div
        class="flex flex-col lg:flex-row gap-5 bg-slate-100 items-center lg:items-start pt-2 lg:p-10 lg:rounded-3xl max-w-7xl lg:mx-auto my-10">
        <div class="lg:min-w-[250px]">
            <h1 class="text-2xl lg:text-6xl font-bold text-slate-700">Quizzes</h1>
            <span class="font-bold text-slate-700">Quizzes Created</span>
        </div>
        <button @click="openCreateQuiz"
            class="w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] flex-shrink-0 self-center  bg-white rounded-full relative shadow-md hover:bg-gray-50 active:scale-95">
            <span class="material-symbols-outlined absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 ">
                add
            </span>
        </button>
        <div class=" w-full overflow-hidden  overflow-x-scroll   bg-white p-5 rounded-3xl snap-x" id="container">
            <div v-if="quizzesData" class="flex flex-col flex-wrap gap-5">
                <transition-group name="slide-fade">
                    <div class=" lg:min-h-[200px] bg-gray-100 rounded-3xl p-5 pb-6 flex flex-col max-w-fit items-center justify-between relative lg:flex-shrink-0 snap-center"
                        id="quiz" v-for="(quiz, index) in quizzesData" :key="index">
                        <button class="material-symbols-outlined absolute -top-3 -right-3 bg-red-500 rounded-full p-1"
                            style="font-size: 25px; color: white;font-weight: 600;"
                            @click="deleteQuiz(quiz.id)">remove</button>
                        <div class="self-start flex flex-col gap-2 text-slate-700 font-semibold">
                            <span class="text-2xl ">{{ quiz.title }}</span>
                            <span class="">{{ quiz.subject }}</span>
                            <span>Course:{{ quiz.course.title }}</span>
                        </div>
                        <div class="self-center flex flex-col">
                            <span class="lg:text-xl font-semibold">Code: {{ quiz.code }}</span>
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
                            <span class="material-symbols-outlined"
                                style="font-size: 25px; color: gray;font-weight: 600;">
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

    </div>
</template>

<script setup>

import { db } from '@/firebase';
import { collection, deleteDoc, doc, onSnapshot, query, where } from '@firebase/firestore';
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const router = useRouter()
const store = useStore()
const quizzesData = ref([])
const q = query(collection(db, "Quizzes"), where("creator.uid", '==', store.state.user.uid))
const getFullDate = (dateobj) => {
    var dd = String(dateobj.getDate()).padStart(2, '0');
    var mm = String(dateobj.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = dateobj.getFullYear();

    return dateobj = mm + '/' + dd + '/' + yyyy + ' '
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