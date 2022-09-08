<template>
    <div v-if="quizData" class="w-full h-full flex flex-col justify-center items-center ">
        <div v-if="!start" class="w-fit bg-slate-200 p-10 rounded-3xl flex flex-col gap-4">
            <span class="text-slate-700 text-3xl font-semibold text-center">{{ quizData.title }}</span>
            <span class="text-slate-700 text-xl font-semibold text-center">{{ quizData.subject }}</span>

            <div class="">
                <span class="text-slate-700 font-semibold text-xl">Rules:</span><br>
                <span class="text-slate-700 font-semibold" v-if="quizData.questionTime">
                    You have {{ Time(quizData.questionTime) }} seconds to finish the quiz.</span><br>
                <span class="text-slate-700 font-semibold">Created by: {{ quizData.creator.name }}</span><br><br>
                <span class="text-slate-700 font-semibold italic">Good luck {{ name }}</span>
            </div>
            <button @click="startQuiz(quizData.questionTime)"
                class="mx-auto  py-3 px-5 text-lg font-semibold bg-blue-500 rounded-full text-white">Start</button>
        </div>
        <div v-if="start && !quizCompleted"
            class="w-fit bg-slate-200 p-10 rounded-3xl flex flex-col items-center gap-4 relative">
            <span>{{ time.minutes + ':' + time.seconds }}s</span>
            <div v-for="(question, index) in quizData.questions" :key="index" class="w-fit flex flex-col gap-3">
                <Transition name="fade" mode="out-in">
                    <div v-if="currentQuestion == index">
                        <span class="text-slate-700 font-semibold">
                            Current Score: {{ points }}/ {{ quizData.maxpoints }}
                        </span>
                        <div class="flex flex-col gap-5">
                            <span class="text-slate-700 text-3xl font-semibold text-center">{{
                                    question.question
                            }}</span>
                            <div class="grid grid-cols-2 grid-rows-2 gap-5 ">
                                <button class="bg-blue-500 text-white px-6 py-2 rounded-3xl"
                                    :class="correct[currentQuestion] == option ? 'bg-green-500' : '' || correct[currentQuestion] != option && correct[currentQuestion] != null ? 'bg-red-500' : ''"
                                    :disabled="quizData.questions[currentQuestion].selected"
                                    v-for="(option, index) in question.options" :key="index"
                                    @click="checkAnswer(question.options[question.answer], option)">{{
                                            option
                                    }}</button>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>

            <span class="absolute bottom-1 right-2 text-sm font-semibold text-slate-900">{{ currentQuestion + 1 }}/ {{
                    quizData.maxpoints
            }}</span>

        </div>
        <div v-if="quizCompleted" class="p-3 rounded flex flex-col">
            <span class="text-slate-700 text-4xl font-semibold text-center">Quiz Finished</span>
            <span class="text-slate-700 text-2xl font-semibold text-center">
                {{ points == quizData.maxpoints ?
        'Exellent ' + name + ', you answered correctly ' + points + " questions out of " +
        quizData.maxpoints
        :
        points == 0 ?
            name + ', all your answers were wrong.' :
            'Congrats ' + name + ', you you answered correctly ' + points + " questions out of " +
            quizData.maxpoints
                }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { doc, getDoc, updateDoc, } from '@firebase/firestore';
import { useStore } from 'vuex';
import { db } from '@/firebase';
import { useRouter } from 'vue-router';

const props = defineProps({
    quizId: String
})
const store = useStore()
const router = useRouter()
const name = store.state.user.displayName.split(" ")[0]
const correct = ref([])
const start = ref(false)
const points = ref(0)
const quizCompleted = ref(false)
const quizId = ref()
const quizData = ref({})
const currentQuestion = ref(0)
const quizQuery = doc(db, "Quizzes", props.quizId)
const time = ref({
    minutes: 0,
    seconds: 0
})
const getQuizData = async () => {
    await getDoc(quizQuery).then((querySnapshot) => {
        quizId.value = querySnapshot.id
        quizData.value = querySnapshot.data()
        console.log(quizData.value);
    });
}
onBeforeMount(() => {
    getDoc(doc(db, "Users", store.state.user.uid, "RegisteredQuizzes", props.quizId)).then((doc) => {
        if (doc.data().completed) {
            alert('Already done this quiz!')
            router.push('/student-dashboard')
        } else {
            getQuizData()
        }
    })
})

const finishQuiz = () => {
    if (quizCompleted.value) {
        setTimeout(() => {
            router.push('/student-dashboard')
        }, 5000)    
        updateDoc(doc(db, "Users", store.state.user.uid, "RegisteredQuizzes", props.quizId),
            {
                score: points.value,
                completed: quizCompleted.value,
                completedAt: new Date()
            })
        updateDoc(doc(db, "Quizzes", props.quizId, "Students", store.state.user.uid),
            {
                score: points.value,
                completed: quizCompleted.value,
                completedAt: new Date()
            })
    }
}
const startQuiz = (time) => {
    start.value = true
    displayTime(time);
    const countDown = setInterval(() => {
        time--;
        displayTime(time);
        if (quizCompleted.value) {
            clearInterval(countDown);
        } else if (time == 0 || time < 1) {
            quizCompleted.value = true
            finishQuiz()
        }
    }, 1000);

}
const displayTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    time.value.minutes = min
    time.value.seconds = sec
}
const Time = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return min + 'm' + ':' + sec + 's'
}
const checkAnswer = (answer, selected) => {
    quizData.value.questions[currentQuestion.value].selected = selected
    console.log(currentQuestion.value);
    if (quizData.value.questions.length != currentQuestion.value + 1) {
        if (quizData.value.questions[currentQuestion.value].selected == answer) {
            if (points.value == quizData.value.maxpoints) {
                points.value
                quizCompleted.value = true
                finishQuiz()
            } else {
                correct.value.push(answer)
                console.log(correct.value);
                points.value++
                setTimeout(() => {
                    changeQuestion()
                }, 1000);
            }
        } else if (quizData.value.questions[currentQuestion.value].selected != answer) {
            correct.value.push(answer)
            console.log(correct.value);
            points.value
            setTimeout(() => {
                changeQuestion()
            }, 1000);
        }
    } else {
        if (quizData.value.questions[currentQuestion.value].selected == answer) {
            if (points.value == quizData.value.maxpoints) {
                points.value
                quizCompleted.value = true
                finishQuiz()
            } else {
                points.value++
                correct.value.push(answer)
                console.log(correct.value);
                setTimeout(() => {
                    changeQuestion()
                }, 1000);
            }
        } else if (quizData.value.questions[currentQuestion.value].selected != answer) {
            correct.value.push(answer)
            points.value
            setTimeout(() => {
                changeQuestion()
            }, 1000);
        }
    }
}
const changeQuestion = () => {
    if (currentQuestion.value < quizData.value.questions.length - 1) {
        currentQuestion.value++
        return currentQuestion.value
    }
    quizCompleted.value = true
    finishQuiz()


    if (currentQuestion.value < quizData.value.questions.length - 1) {
        currentQuestion.value++
        return currentQuestion.value
    }
    quizCompleted.value = true
    finishQuiz()
}
</script>

<style lang="scss" scoped>
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

</style>