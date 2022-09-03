<template>
    <div class=" w-full h-full p-5">
        <div class="flex gap-5 bg-slate-100 p-10 rounded-3xl max-w-7xl mx-auto">
            <div>
                <h1 class="text-6xl font-bold text-slate-700 text-center">Quizzes</h1>
                <span class="font-bold text-slate-700 text-center">Previous Quizzes done</span>
            </div>
            <button @click="showAddQuizModal"
                class="w-[100px] h-[100px] flex-shrink-0 self-center  bg-white rounded-full relative shadow-md hover:bg-gray-50 active:scale-95">
                <span class="material-symbols-outlined absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 ">
                    add
                </span>
            </button>
            <div class="flex   overflow-hidden  overflow-x-scroll  gap-4 bg-white p-5 rounded-3xl snap-x"
                id="container">
                <div class="basis-[200px] min-h-[200px] bg-gray-100 rounded-3xl p-5 pb-6 flex flex-col items-center justify-between relative flex-shrink-0 snap-center"
                    id="quiz" v-for="(quiz, index) in quizzesData" :key="index">
                    <div class="self-start flex flex-col">
                        <span class="text-3xl font-semibold">{{ quiz.title }}</span>
                        <span>{{ quiz.subject }}</span>
                    </div>
                    <div class="flex flex-col text-slate-700">
                        <span>Score {{ quiz.points + "/" + quiz.maxpoints }}</span>
                        <span :class="quiz.completed ? 'text-green-500' : 'text-red-500'">{{ quiz.completed ?
                                'Completed' :
                                'Not completed'
                        }}</span>

                    </div>
                    <div class="flex items-center gap-3">
                        <button @click="openQuiz(quiz.code)" class="text-slate-700 font-semibold italic text-lg">View
                            Quiz</button>
                        <span class="material-symbols-outlined" style="font-size: 25px; color: gray;font-weight: 600;">
                            open_in_new
                        </span>
                    </div>
                    <div class=" absolute bottom-2 right-3 italic text-slate-500 ">
                        <span>{{ index + 1 + '/' + quizzesData.length }}</span>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade">
            <div v-if="addQuiz" class="fixed top-0 left-0 w-full h-full z-50 backdrop-blur backdrop-brightness-75 ">
                <div v-click-outside="showAddQuizModal"
                    class="flex flex-col gap-4 justify-center items-center w-[400px] h-[400px] bg-slate-100 rounded-3xl p-10  absolute  top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 ring ring-slate-100">
                    <h1 class="text-5xl font-bold  content-start text-slate-700">Quiz</h1>
                    <span class="text-slate-700 text-sm">Enter quiz code provided:</span>
                    <input type="text"
                        class=" p-3 rounded-2xl shadow-inner ring-2 ring-slate-300 text-center font-semibold text-gray-700"
                        placeholder="Ex. abc123" v-model="quizCode">
                    <button @click="openQuiz(quizCode)"
                        class=" mt-10 w-[150px] h-[50px] bg-blue-600 drop-shadow-lg text-xl rounded-full font-semibold text-white hover:brightness-110 active:bg-blue-700 active:scale-95">Start</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>

import { db } from '@/firebase';
import router from '@/router';
import { arrayUnion, collection, doc, onSnapshot, query, setDoc, updateDoc, where } from '@firebase/firestore';
import { ref } from 'vue'
import { useStore } from 'vuex';
const addQuiz = ref(false)
const store = useStore()
const quizzesData = ref([{}])
const quizCode = ref()
const quizzesRef = collection(db, "Quizzes")

const openQuiz = (code) => {
    const re = /[A-Za-z0-9]{5}/
    if (re.test(quizCode.value)) {
        const quizzesQuery = query(collection(db, "Quizzes"), where("code", "==", code))
        onSnapshot(quizzesQuery, (querySnapshot) => {
            console.log(querySnapshot);
            querySnapshot.forEach((q) => {
                const docRef = doc(db, "Users", store.state.user.uid, "RegisteredQuizzes", q.id)
                const quizQuery = doc(db, "Quizzes", q.id)
                store.commit("SET_QUIZ", q.data().code)
                if (q.data().users) {
                    if (q.data().users.includes(store.state.user.uid)) {
                        setDoc(docRef, {
                            id: q.id,
                            score: '',
                            maxscore: q.data().questions.length,
                            addDate: new Date(),
                            completed: false,
                            completedDate: null
                        }).then(() => {
                            router.push({ name: 'quiz', params: { quizTitle: q.data().title.replaceAll(' ', '-') } })
                        })
                    } else {
                        updateDoc(quizQuery, {
                            users: arrayUnion(store.state.user.uid)
                        })
                    }
                } else {
                    updateDoc(quizQuery, {
                        users: [store.state.user.uid]
                    })
                }
            }
            );
        });
    } else {
        console.log('error');
        quizCode.value = ''
    }
}

const showAddQuizModal = () => {
    addQuiz.value = !addQuiz.value
}



const getQuizzes = () => {
    onSnapshot(quizzesRef, (snapshot) => {
        let arr = []
        snapshot.forEach(doc => {
            let obj = doc.data()
            arr.push(obj)
        })
        quizzesData.value = arr
        console.log(quizzesData.value);
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