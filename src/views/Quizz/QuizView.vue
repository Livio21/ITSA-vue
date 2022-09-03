<template>
    <div class="w-full h-full flex flex-col justify-center items-center">
        <div class="w-fit bg-slate-200 p-10 rounded-3xl">
            <div v-if="quizQuestions" class="w-fit">
                <div class="flex flex-col">
                    <span>{{ quizQuestions[currentQuestion].question }}</span>
                    <div v-for="(option, index) in quizQuestions[currentQuestion].options" :key="index">
                        <span>{{ option }}</span>
                        <input type="radio" :value="option" v-model.lazy="selectedOption"
                            @change="checkAnswer(quizQuestions[currentQuestion].answer)">
                        <!-- <button @click="checkAnswer(index, quizQuestions[currentQuestion].answer)">test</button> -->
                    </div>
                </div>
            </div>
            <div class="flex gap-5">
                <button @click="changeQuestion(false, true)">Previous Question</button>
                <button @click="changeQuestion(true, false)">Skip Question</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { collection, onSnapshot, query, where } from '@firebase/firestore';
import { useStore } from 'vuex';
import { db } from '@/firebase';

const store = useStore()
// const docRef = doc(db, "Users", store.state.user.uid, "RegisteredQuizzes", q.id)
const quizData = ref({})
const quizQuestions = ref([{}])
const selectedOption = ref('')
const currentQuestion = ref(0)

const checkAnswer = (answer) => {
    if (selectedOption.value == answer) {
        console.log(selectedOption.value, answer);
        alert('correct')
        quizData.value.points++
        if (currentQuestion.value == quizQuestions.value.length - 1) {
            quizData.value.completed = true
            alert('Quiz completed you scored' + quizData.value.points + '/' + quizQuestions.value.length)
            console.log(quizData.value.completed);
        } else {
            changeQuestion(true, false)
        }
    } else {
        quizData.value.points--
        console.log(selectedOption.value);
        alert('wrong')
    }
    console.log(quizData.value.points);
}
const changeQuestion = (next, prev) => {
    if (next) {
        currentQuestion.value++
        selectedOption.value = ''
        if (currentQuestion.value >= 0 && currentQuestion.value < quizQuestions.value.length) {
            return currentQuestion.value
        } else {
            currentQuestion.value--
            return currentQuestion.value
        }
    } else if (prev) {
        currentQuestion.value--
        selectedOption.value = ''
        if (currentQuestion.value >= 0 && currentQuestion.value < quizQuestions.value.length) {
            return currentQuestion.value
        } else {
            currentQuestion.value++
            return currentQuestion.value
        }
    } else {
        alert('error')
    }
}
const getQuizData = () => {
    const quizQuery = query(collection(db, "Quizzes"), where("code", "==", store.state.currentQuiz))
    onSnapshot(quizQuery, (querySnapshot) => {
        console.log(querySnapshot);
        querySnapshot.forEach((q) => {
            quizData.value = q.data()
            quizQuestions.value = q.data().questions
        }
        );
    });

}
getQuizData()
</script>

<style lang="scss" scoped>
</style>