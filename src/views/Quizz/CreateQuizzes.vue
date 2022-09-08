<template>
    <div class="w-full h-full ">
        <form @submit.prevent="createQuiz()" class="max-w-6xl mx-auto">
            <div class="p-10 bg-slate-100 flex flex-col gap-4 items-center rounded-t-3xl">
                <div class="flex  items-center">
                    <label for="title" class="text-slate-700 font-semibold text-3xl">Quiz Title:</label>
                    <input type="text" name="title" id="title" class="p-3 ml-4 rounded-full text-center text-xl"
                        placeholder="Title..." v-model="quizTitle">
                </div>
                <div class="flex gap-5">
                    <div class="flex justify-between items-center">
                        <label for="subject" class="text-slate-700 font-semibold text-lg">Subject:</label>
                        <input type="text" id="subject" v-model="quizSubject"
                            class="p-3 ml-4 rounded-full text-center  text-lg" placeholder="Subject...">
                    </div>
                    <div class=" flex justify-between items-center gap-3">
                        <label for="courseSelect" class="text-slate-700 font-semibold text-lg">Course: </label>
                        <select id=" courseSelect" v-model="course"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full p-2.5">
                            <option selected>Choose a Course</option>
                            <option :value="info" v-for="(info, index) in courseInfos" :key="index">
                                {{ info.title }}</option>
                        </select>
                    </div>
                    <div class="  items-center gap-3">
                        <span class="text-slate-700 font-semibold text-lg ">Time limit: </span>
                        <div id="timer" class="flex gap-3">
                            <div>
                                <label for="min" class="mr-2 text-slate-700 text-sm font-semibold">Minutes:</label>
                                <input type="number" name="" id="min" min="0" max="20"
                                    class="focus:outline-none p-1 rounded" v-model="time.minutes">
                            </div>
                            <div>
                                <label for="sec" class="mr-2 text-slate-700 text-sm font-semibold">Seconds</label>
                                <input type="number" name="" id="sec" min="30" max="60"
                                    class="focus:outline-none p-1 rounded" v-model="time.seconds">
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <label for="quizcode" class="text-slate-700 font-semibold text-lg">Quiz code:</label><br>
                    <span class="italic text-slate-500 text-xs">Code to be used by students to start the
                        quiz.</span><br>
                    <input type="text" id="quizcode" class=" p-3 shadow-inner rounded-full text-center font-semibold"
                        pattern="[A-Za-z0-9]{5}" maxlength="5" v-model="quizCode" required>
                    <button type="button" @click="randomCodeGen"
                        class="ml-5 bg-green-600 px-3 py-2 rounded-full text-white font-semibold hover:bg-green-500 active:scale-95 active:bg-green-700">Random</button>
                </div>
                <div class="  items-center gap-3">
                    <span class="text-slate-700 font-semibold text-lg ">Time limit: </span>
                    <div id="timer" class="flex gap-3">
                        <div>
                            <label for="timelimit" class="mr-2 text-slate-700 text-sm font-semibold">Timelimit:</label>
                            <input type="datetime-local" name="" id="timelimit" class="focus:outline-none p-1 rounded"
                                v-model="timelimit">
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-slate-200 flex p-5 justify-evenly items-center">
                <div>
                    <div>
                        <label for="question" class="text-slate-700 font-semibold text-lg">Question:</label>
                        <input type="text" id="question" v-model="question" class="p-3 ml-4 w-[300px] rounded-full">
                    </div>
                </div>
                <div>
                    <div class="flex justify-between items-center">
                        <label for="option" class="text-slate-700 font-semibold text-lg">Options:</label>
                        <input type="text" name="option" v-model="option" class="p-3 ml-4 rounded-full">
                        <button @click="addOption" type="button" :disabled="optionsFull" class="material-symbols-outlined bg-green-500 px-3 py-3 rounded-full ml-4
                             font-semibold hover:bg-green-400 active:bg-green-600 active:scale-95 
                             shadow-md active:shadow-none active:transition-all disabled:ring
                              disabled:ring-red-500 disabled:bg-gray-500" style="color: white; font-size: 20px;">
                            add</button>
                    </div>
                    <div>
                        <div class="flex flex-col">
                            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                                    <div class="overflow-hidden rounded-3xl">
                                        <table class="min-w-full table-auto ">
                                            <thead class="bg-white border-b ">
                                                <tr class="text-center divide-x-[1px]">
                                                    <th scope="col"
                                                        class="text-sm font-medium text-gray-900 px-6 py-4 ">
                                                        No.
                                                    </th>
                                                    <th scope="col"
                                                        class="text-sm font-medium text-gray-900 px-6 py-4 ">
                                                        Answer
                                                    </th>
                                                    <th scope="col"
                                                        class="text-sm font-medium text-gray-900 px-6 py-4 ">
                                                        Option
                                                    </th>
                                                    <th scope="col"
                                                        class="text-sm font-medium text-gray-900 px-6 py-4 ">
                                                        Remove
                                                    </th>
                                                </tr>
                                            </thead>
                                            <transition-group name="slide-bottom">
                                                <tbody v-for="(option, index) in options" :key="index"
                                                    class="text-center">
                                                    <tr class="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                                                        :class="{ 'bg-green-200': option == options[answer] }">
                                                        <td
                                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {{ index + 1 }}
                                                        </td>
                                                        <td
                                                            class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                            <input type="radio" :value="index" name="options" id=""
                                                                v-model="answer">
                                                        </td>
                                                        <td
                                                            class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                            {{ option }}
                                                        </td>
                                                        <td>
                                                            <button type="button"
                                                                class="material-symbols-outlined rounded-full p-1 bg-red-500 hover:bg-red-400 active:bg-red-600 active:scale-95"
                                                                style="color: white; font-size: 20px;"
                                                                @click="removeOption(index)"> remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </transition-group>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button @click="addQuestion" type="button"
                        class="w-[70px] h-[70px] flex-shrink-0 self-center  bg-white rounded-full relative shadow-md hover:bg-gray-50 active:scale-95">
                        <span
                            class="material-symbols-outlined absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 active:shadow-none">
                            docs_add_on
                        </span>
                    </button>
                </div>
            </div>
            <div class="bg-slate-100 p-10 flex flex-col gap-5">
                <span class="text-2xl font-semibold text-slate-700">Questions:</span>
                <div v-if="questions" id="scroll"
                    class="bg-white rounded-3xl p-5 flex gap-5  overflow-hidden overflow-x-scroll">
                    <transition-group name="slide-fade">
                        <div v-for="(question, index) in questions" :key="index"
                            class="w-fit flex flex-col gap-3 bg-gray-100 rounded-3xl p-4 flex-none relative">
                            <button type="button" class="material-symbols-outlined absolute -top-2 -right-2 rounded-full p-1 bg-red-500
                                 hover:bg-red-400 active:bg-red-600 active:scale-95"
                                style="color: white; font-size: 20px;" @click="removeQuestion(index)">remove</button>
                            <span class="text-xl font-semibold text-slate-700  text-center">{{ question.question
                            }}</span>
                            <span class="text-lg font-semibold text-slate-700 ">Options:</span>
                            <div class="grid grid-flow-col grid-cols-2 grid-rows-2 self-center gap-3">
                                <div v-for="(option, i) in question.options" :key="i" class="bg-white ring p-2 rounded"
                                    :class="{ 'bg-green-500 text-white': option == question.options[question.answer] }">
                                    <span class="font-semibold text-slate-700 ">{{ option }}</span>
                                </div>
                            </div>
                            <span class="text-lg font-semibold text-slate-700">Answer: {{
                            question.options[question.answer]
                            }}</span>
                        </div>
                    </transition-group>
                </div>
            </div>
            <div class="bg-slate-100 rounded-b-3xl p-5 flex justify-center">
                <button type="submit" class="bg-blue-500 p-5 px-8 text-white 
                font-semibold text-xl shadow-lg hover:bg-blue-400 active:bg-blue-600 active:shadow-none active:scale-95
                 rounded-full flex items-center gap-3"> <span>Create Quiz</span>
                    <span style="color: white; font-size: 30px; font-weight: 300;" class="material-symbols-outlined  ">
                        post_add
                    </span></button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { db } from '@/firebase';
import { addDoc, collection, onSnapshot, query, where } from '@firebase/firestore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

// console.log(store.state.courseTitle);

const store = useStore()
const question = ref('')
const questions = ref([])
const option = ref('')
const options = ref([])
const optionsFull = ref(false)
const answer = ref()
const quizCode = ref('')
const quizTitle = ref('')
const quizSubject = ref('')
const quiz = ref({})
const course = ref()
const courseInfos = ref([])
const time = ref({})
const timelimit = ref()
const router = useRouter()

const getCourseInfo = () => {
    const q = query(collection(db, "Courses"), where('uid', '==', store.state.user.uid))
    onSnapshot(q, (snapshot) => {
        snapshot.forEach(doc => {
            let obj = {
                id: doc.id,
                title: doc.data().title
            }
            courseInfos.value.push(obj)
        });
        console.log(courseInfos.value);
    })
}
getCourseInfo()
const timeToSeconds = () => {
    return time.value.minutes * 60 + time.value.seconds
}
console.log(timeToSeconds);
const randomCodeGen = () => {
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var result = ""
    var charactersLength = characters.length;

    for (var i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    quizCode.value = result
}
const addOption = () => {
    if (option.value) {
        if (options.value.length < 4) {
            options.value.push(option.value)
            option.value = ''
        } else {
            optionsFull.value = true
            option.value = ''
        }
        console.log(answer.value)
    }
}
const removeOption = (i) => {
    if (answer.value == options.value[i]) {
        answer.value = ''
    }
    options.value.splice(i, 1)
}

const addQuestion = () => {
    if (question.value && options.value) {
        let obj = {
            question: question.value,
            options: options.value,
            answer: answer.value,
            selected: null
        }
        questions.value.push(obj)
        clearFields()
    } else {
        alert('Empty question field.')
    }
}
const removeQuestion = (i) => {
    questions.value.splice(i, 1)
}


const createQuiz = () => {
    quiz.value = {
        questions: questions.value,
        maxpoints: questions.value.length,
        date: new Date(),
        course: {
            id: course.value.id,
            title: course.value.title,
        },
        creator: {
            uid: store.state.user.uid,
            name: store.state.user.displayName,
            email: store.state.user.email
        },
        title: quizTitle.value,
        code: quizCode.value,
        subject: quizSubject.value,
        finished: false,
        registeredUsers: [],
        questionTime: timeToSeconds(),
        timelimit: new Date(timelimit.value)

    }

    const docRef = collection(db, "Quizzes")
    addDoc(docRef, quiz.value).then((r) => {
        router.push('/teacher-dashboard')
        clearAllFields()
        console.log(r);
    }).catch((err) => {
        console.log(err);
    })
    console.log(quiz.value);
}
const clearFields = () => {
    question.value = ''
    options.value = []
    option.value = ''
    answer.value = ''
    optionsFull.value = false
}
const clearAllFields = () => {
    question.value = ''
    options.value = []
    option.value = ''
    answer.value = ''
    optionsFull.value = false
    course.value = ''
    quizTitle.value = ''
    quizSubject.value = ''
    time.value = {}
}
</script>

<style lang="scss" scoped>
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

.slide-bottom-enter-active {
    transition: all 0.3s ease-in-out;
}

.slide-bottom-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
    transform: translateX(-20px);
    opacity: 0;
}

#scroll::-webkit-scrollbar {
    width: 0.6vw;
    border-bottom: 5px solid rgba(255, 255, 255, 0);
}

#scroll::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 10px 10px rgb(211, 211, 211);
    border-radius: 10px;
    border: solid 3px transparent;
}

#scroll::-webkit-scrollbar-track {
    box-shadow: inset 0 0 10px 10px rgba(255, 255, 255, 0);
    border: solid 3px transparent;
}

#scroll::-webkit-scrollbar-button {
    background-color: rgba(240, 248, 255, 0);
}

#scroll::-webkit-scrollbar-thumb:hover {
    background: rgb(219, 219, 219);
}

#scroll::-webkit-scrollbar-thumb:active {
    background: rgb(192, 192, 192);
}

.material-symbols-outlined {
    font-size: 35px;
    color: gray;
    font-weight: bold;
}
</style>