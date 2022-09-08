<template>
    <div
        class="flex flex-col lg:flex-row gap-5 bg-slate-100 p-5 lg:p-10 rounded-3xl max-w-7xl lg:mx-auto my-10 w-screen">
        <div class="min-w-[250px]">
            <h1 class="text-2xl lg:text-6xl font-bold text-slate-700">Quizzes</h1>
            <span class="font-bold text-slate-700">Previous Quizzes done</span>
        </div>
        <button @click="showAddQuizModal"
            class="w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] lg:flex-shrink-0 self-center  bg-white rounded-full relative shadow-md hover:bg-gray-50 active:scale-95">
            <span class="material-symbols-outlined absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 ">
                add
            </span>
        </button>
        <div class=" w-full overflow-hidden  overflow-x-scroll   bg-white p-5 rounded-3xl snap-x" id="container">
            <div v-if="quizzesData" class="flex flex-col lg:flex-row flex-wrap gap-5">
                <transition-group name="slide-fade">
                    <div class=" min-h-[200px] bg-gray-100 rounded-3xl p-5 pb-6 flex flex-col items-center justify-between relative flex-shrink-0 snap-center"
                        id="quiz" v-for="(quiz, index) in quizzesData" :key="index">
                        <div class="self-start flex flex-col">
                            <span class="text-3xl font-semibold">{{ quiz.quizTitle }}</span>
                            <span>{{ quiz.quizSubject }}</span>
                            <span>For: {{ quiz.quizCourse.title }}</span>
                            <span>Created by: {{ quiz.creator.name }}</span>

                        </div>
                        <div class="flex flex-col text-slate-700">
                            <span>Score {{ quiz.score + "/" + quiz.maxscore }}</span>
                            <span>Added on {{ getFullDate(quiz.addDate.toDate()) }}</span>
                            <span :class="quiz.completed ? 'text-green-500' : 'text-red-500'">{{ quiz.completed ?
                            'Completed on ' + getFullDate(quiz.completedAt.toDate()) :
                            'Not completed'
                            }}</span>
                            <span v-if="!quiz.completed"
                                :class="quiz.timelimit.toDate() <= new Date() ? 'text-red-500' : 'text-green-500'">{{
                                                                quiz.timelimit.toDate() <= new Date() ? 'Quiz ended on ' +
                                getFullDate(quiz.timelimit.toDate()) : 'Quiz available till ' +
                                getFullDate(quiz.timelimit.toDate()) }}</span>

                        </div>
                        <div v-if="!quiz.completed" class="flex items-center gap-3">
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
    <div>
        <transition name="fade">
            <div v-if="addQuiz" class="fixed top-0 left-0 w-full h-full z-50 backdrop-blur backdrop-brightness-75 ">
                <div v-click-outside="showAddQuizModal"
                    class="flex flex-col gap-4 justify-center items-center lg:w-[400px] lg:h-[400px] bg-slate-100 rounded-3xl p-10  absolute  top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 ring ring-slate-100">
                    <h1 class="text-5xl font-bold  content-start text-slate-700">Quiz</h1>
                    <span class="text-slate-700 text-sm">Enter quiz code provided:</span>
                    <span v-if="errorDisplay" class="text-red-500 italic text-sm animate-pulse">{{ errorDisplay
                    }}</span>
                    <input type="text"
                        class=" p-3 rounded-3xl drop-shadow-md text-xl text-center font-semibold text-gray-700"
                        pattern="[A-Za-z0-9]{5}" maxlength="5" placeholder="Ex. abc123" v-model="quizCode">
                    <button @click="openQuiz(quizCode)" type="button"
                        class=" mt-10 w-[150px] h-[50px] bg-blue-600 drop-shadow-lg text-xl rounded-full font-semibold text-white hover:brightness-110 active:bg-blue-700 active:scale-95">Start</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>

import { db } from '@/firebase';
import { collection, doc, getDocs, onSnapshot, query, setDoc, where } from '@firebase/firestore';
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const addQuiz = ref(false)
const router = useRouter()
const store = useStore()
const quizzesData = ref([])
const quizCode = ref()
const errorDisplay = ref('')
const quizzesRef = collection(db, "Users", store.state.user.uid, "RegisteredQuizzes")
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
const openQuiz = (code) => {
    const re = /[A-Za-z0-9]{5}/
    if (code) {
        if (re.test(quizCode.value)) {
            const quizzesQuery = query(collection(db, "Quizzes"), where("code", "==", code))
            getDocs(quizzesQuery).then((querySnapshot) => {
                console.log(querySnapshot);
                if (querySnapshot.empty) {
                    errorDisplay.value = "Wrong code or quiz doesn't exist."
                } else {
                    querySnapshot.forEach((q) => {
                        if (q.data().timelimit.toDate() <= new Date()) {
                            errorDisplay.value = "Quiz has finished"
                        } else {
                            const docRef = doc(db, "Users", store.state.user.uid, "RegisteredQuizzes", q.id)
                            const userQuizQuery = doc(db, "Quizzes", q.id, "Students", store.state.user.uid)
                            store.commit("SET_QUIZ", q.data().code)
                            if (!q.data().registeredUsers.includes(store.state.user.uid)) {
                                setDoc(userQuizQuery, {
                                    score: 0,
                                    completed: null,
                                    completedAt: null,
                                    uid: store.state.user.uid
                                })
                                setDoc(docRef, {
                                    id: q.id,
                                    quizTitle: q.data().title,
                                    quizSubject: q.data().subject,
                                    quizCourse: q.data().course,
                                    creator: q.data().creator,
                                    score: 0,
                                    maxscore: q.data().questions.length,
                                    addDate: new Date(),
                                    completed: false,
                                    completedAt: null,
                                    timelimit: q.data().timelimit.toDate()
                                }).then(() => {
                                    router.push({ name: 'quiz', params: { quizId: q.id } })
                                })
                            } else {
                                errorDisplay.value = "User already registered."
                            }
                        }

                    }
                    );
                }
            }).catch((err) => {
                alert(err)
            })
        } else {
            console.log('error');
            quizCode.value = 'Illegal characters/length.'
        }
    } else {
        errorDisplay.value = 'Please insert a code'
    }
}

const showAddQuizModal = () => {
    addQuiz.value = !addQuiz.value
}



const getQuizzes = () => {
    onSnapshot(quizzesRef, (snapshot) => {
        snapshot.forEach(doc => {
            quizzesData.value.push(doc.data())
            console.log(quizzesData.value);
        })
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
    transition: all 0.2s ease-in;
}

.fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
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