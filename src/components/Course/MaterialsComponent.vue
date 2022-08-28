<template>
    <div class="grid grid-flow-col gap-2 grid-cols-2 ">
        <div>
            <h1>Insert book(s) here:</h1>
            <div @dragenter.prevent="toggleActive" @dragleave.prevent="toggleActive" @dragover.prevent
                @drop="toggleActive" class="ring rounded-3xl ring-slate-300 overflow-hidden"
                :class="{ ' rounded-lg p-5 m-3 transition-all bg-blue-400 duration-200 animate-pulse': active }">
                <div class=" w-full h-[100px]  text-white  relative active:scale-95 active:transition-all ">
                    <label for="dropzoneFile" :class="{ 'opacity-0 animate-none': active }"
                        class=" w-[50px] h-[50px] absolute bottom-0 right-0  bg-slate-300 flex hover:animate-none hover:scale-105 animate-pulse justify-center  z-10  cursor-pointer ">
                        <span class="material-symbols-outlined  self-center ">add</span>
                    </label>
                </div>
                <input type="file" accept="image/*" id="dropzoneFile" class="dropzoneFile hidden">
            </div>
        </div>
        <div>
            <h1>Insert slide(s) here:</h1>
            <div @dragenter.prevent="toggleActive" @dragleave.prevent="toggleActive" @dragover.prevent
                @drop="toggleActive" class="ring rounded-3xl ring-slate-300 overflow-hidden"
                :class="{ ' rounded-lg p-5 m-3 transition-all bg-blue-400 duration-200 animate-pulse': active }">
                <div class=" w-full h-[100px]  text-white  relative active:scale-95 active:transition-all ">
                    <label for="dropzoneFile" :class="{ 'opacity-0 animate-none': active }"
                        class=" w-[50px] h-[50px] absolute bottom-0 right-0 bg-slate-300 flex hover:animate-none hover:scale-105 animate-pulse justify-center  z-10  cursor-pointer ">
                        <span class="material-symbols-outlined  self-center ">add</span>
                    </label>
                </div>
                <input type="file" accept="image/*" id="dropzoneFile" class="dropzoneFile hidden">
            </div>
        </div>
        <div>
        </div>

    </div>
</template>

<script >

import { useStore } from 'vuex';
import { ref } from 'vue';

export default {

    name: 'fileDrop',


    setup() {
        const store = useStore()
        const active = ref(false)

        const toggleActive = () => {
            active.value = !active.value
        }
        return { store, toggleActive, active, }
    }
}
</script>

<style lang="scss" scoped>
</style>