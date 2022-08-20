<template>
    <div @dragenter.prevent="toggleActive" @dragleave.prevent="toggleActive" @dragover.prevent @drop="toggleActive"
        class="ring rounded-full ring-blue-500 overflow-hidden"
        :class="{ ' rounded-lg p-5 m-3 transition-all bg-blue-400 duration-200 animate-pulse': active }">
        <div class=" w-[100px] h-[100px]  text-white  relative active:scale-95 active:transition-all ">
            <img :src="avatar" alt="Profile Picture" width="100" height="100"
                class="rounded-full absolute top-0 left-0 z-0 " :class="{ 'opacity-0 ': active }" srcset="">
            <label for="dropzoneFile" :class="{ 'opacity-0 animate-none': active }" v-if="edit"
                class=" w-[50px] h-[50px] absolute bottom-0 right-0 rounded-br-full bg-blue-500 flex hover:animate-none hover:scale-105 animate-pulse justify-center  z-10  cursor-pointer ">
                <span class="material-symbols-outlined  self-center ">add</span>
            </label>
        </div>

        <input type="file" accept="image/*" id="dropzoneFile" class="dropzoneFile hidden">
    </div>
</template>

<script >

import { useStore } from 'vuex';
import { ref, toRef } from 'vue';
export default {

    name: 'fileDrop',
    props: ['pfpUrl', 'editable'],

    setup(props) {
        const store = useStore()
        const active = ref(false)
        const avatar = toRef(props, 'pfpUrl')
        const edit = toRef(props, 'editable')

        const toggleActive = () => {
            active.value = !active.value
        }
        return { store, toggleActive, active, avatar, edit }
    }
}
</script>

<style lang="scss" scoped>
</style>