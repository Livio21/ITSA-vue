<template>
  <div>
    <div class="flex flex-col lg:flex-row items-center lg:max-w-6xl lg:mx-auto">
      <span class="lg:text-4xl text-slate-700 font-bold basis-full">{{ greet }}
        {{ store.state.user.displayName.split(" ")[0]}}</span>
      <ClockComponent />
    </div>
    <div class=" rounded-3xl lg:p-2 mt-10">
      <ToDoComponent></ToDoComponent>
      <CourseContainer />
      <QuizContainer />
    </div>
  </div>
</template>

<script setup>
import CourseContainer from '@/components/Course/CourseContainer.vue';
import QuizContainer from '@/components/Quizz/QuizContainer.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import ToDoComponent from '@/components/ToDoComponent.vue';
import ClockComponent from '@/components/ClockComponent.vue';


const store = useStore()
const greet = ref('')

const getFullDate = () => {
  let date = new Date()

  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();
  var h = String(date.getHours()).padStart(2, '0');
  var m = String(date.getMinutes()).padStart(2, '0');
  return date = mm + '/' + dd + '/' + yyyy + ' ' + h + ':' + m
}
getFullDate()
const getTime = () => {
  let date = new Date()
  let hrs = date.getHours()
  let mins = date.getMinutes()

  if (hrs >= 5 && ((hrs == 5 && mins >= 30) || (hrs > 5 && hrs < 12)))
    greet.value = 'Good Morning';
  else if (hrs >= 12 && hrs < 18)
    greet.value = 'Hello ';
  else if ((hrs >= 18 && hrs < 24) || hrs > 0)
    greet.value = 'Good Evening';
  else
    greet.value = 'Error';
}
getTime()

</script>

<style lang="scss" scoped>

</style>