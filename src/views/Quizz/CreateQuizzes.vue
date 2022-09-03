<template>
    <div>
        <form action="" @submit.prevent="test">
            <input type="text" placeholder="Question" v-model="quizQuestion.question">
            <form>
                <input type="text" placeholder="Options" v-model="options">
                <button type="submit" @click="optionAdd">Add Option</button>
            </form>
            <div v-if="quizQuestion.ansOptions">
                <table class="table-fixed">
                    <thead>
                        <tr>
                            <th>Option</th>
                            <th>Correct Answer</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(option, index) in quizQuestion.ansOptions" :key="index">
                            <td> {{ index + 1 + "." }}</td>
                            <td>{{ option }}</td>

                            <td> <button @click="deleteOption(index)">
                                    <span class="material-symbols-outlined text-black p-3">
                                        delete
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="quizQuestion1">
                <div v-for="(questions, index) in quizQuestion1" :key="index">
                    <table class="table-fixed">
                        <thead>
                            <tr>
                                <th>{{ index + ') ' + questions.question }}</th>
                                <th>{{ ' - ' + questions.answer }}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(option, index) in questions.ansOptions" :key="index">
                                <td> {{ index + 1 + "." }}</td>
                                <td>{{ option }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <input type="text" placeholder="Correct option" v-model="quizQuestion.answer">
            <button type="submit" @click="addQuestion">Add Question</button>
        </form>
        <div>

        </div>
    </div>
</template>

<script>
// import { db } from "@/firebase";
import { ref } from "vue";
// import { addDoc, collection, } from "@firebase/firestore";


export default {
    setup() {
        // let arr = []
        // let arr1 = []

        const options = ref()
        const quizQuestion = {}
        const quizQuestion1 = ref([])


        // const addQuestion = () => {
        //     arr1.push(quizQuestion)
        //     quizQuestion1.value.push(quizQuestion.value)
        //     console.log(quizQuestion1.value);
        //     options.value = ''
        // }
        // const createQuiz = async () => {
        //     arr1.push(quizQuestion.value)
        //     quizQuestion1.value = arr1
        //     console.log(quizQuestion1.value);
        //     await addDoc(collection(db, 'Quizzes'), quizQuestion1.value)

        // }
        // const optionAdd = () => {

        //     arr.push(options.value)
        //     quizQuestion.ansOptions = arr
        //     console.log(arr, ' <<=>> ', quizQuestion);
        //     options.value = ''

        // }
        // const deleteOption = i => {
        //     quizQuestion.value.ansOptions.splice(i, 1)
        //     console.log(quizQuestion.value.ansOptions);
        // }

        return {
            quizQuestion, quizQuestion1,
            //  addQuestion, optionAdd, deleteOption, 
            options,
            //  createQuiz 
        }
    }
};
</script>

<style lang="scss" scoped>
</style>