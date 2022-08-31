<template>
    <div class="w-full flex flex-col items-center gap-3 flex-nowrap  p-4 " v-if="materials">
        <div>
            <span class="font-semibold text-lg text-slate-700">Materials uploaded by the instructor:</span>
        </div>
        <div class="bg-white shadow-inner rounded-3xl  h-fit min-h-[200px] w-fit  p-5">
            <div v-for="(file, index) in materials" :key="index"
                class="ring-2 bg-white ring-slate-200 p-3 max-w-fit max-h-fit rounded flex flex-col items-center align-middle relative">

                <button @click="showFunc" class="material-symbols-outlined absolute right-1 top-1 active:scale-95">
                    zoom_out_map </button>
                <iframe v-if="!show" :src="file.url" type="" class="" width="px" scrolling="no"></iframe>
                <div class=" max-w-[200px] max-h-[200px] w-fit h-fit">
                    <a :href="file.url" target="_blank"
                        class=" text-ellipsis p-1 text-slate-700 font-semibold active:scale-95 ">{{  file.name  }}</a>
                </div>
                <transition name="v">
                    <div v-if="show && file.url"
                        class="fixed top-0 bottom-0 left-0 right-0 z-50 w-full h-full backdrop-blur backdrop-brightness-75">
                        <button @click="showFunc"
                            class="material-symbols-outlined bg-gray-500 rounded-full p-1 m-10 absolute top-2 right-2">
                            close </button>
                        <iframe :src="file.url" frameborder='0' class="w-1/2 h-full mx-auto text-center bg-black/25 "
                            v-click-outside="showFunc">
                        </iframe>
                    </div>
                </transition>
            </div>
        </div>
    </div>
    <div class="w-full flex flex-col items-center gap-3 flex-nowrap  p-4 " v-if="arr1">
        <div>
            <span class="font-semibold text-lg text-slate-700">Materials uploaded from posts: </span>
        </div>
        <div class="flex gap-3 bg-white shadow-inner rounded-3xl  h-fit min-h-[200px] w-fit  p-5">
            <div v-for="(afile, index) in arr1" :key="index" class="min-w-[300px]">
                <div v-if="afile.fileName"
                    class="ring-2 bg-white ring-slate-200 p-3 max-w-fit max-h-fit rounded flex flex-col items-center align-middle relative ">
                    <button @click="showFunc" class="material-symbols-outlined absolute right-1 top-1 active:scale-95">
                        zoom_out_map </button>
                    <iframe v-if="!show" :src="afile.fileUrl" type="" class="" width="px" scrolling="no"></iframe>
                    <div class=" max-w-[200px] max-h-[200px] w-fit h-fit">
                        <a :href="afile.fileUrl" :download="afile.fileName" target="_blank"
                            class=" text-ellipsis p-1 text-slate-700 font-semibold active:scale-95 ">{{  afile.fileName 
                            }}</a>
                    </div>
                    <transition name="v">
                        <div v-if="show && afile.fileUrl"
                            class="fixed top-0 bottom-0 left-0 right-0 z-50 w-full h-full backdrop-blur backdrop-brightness-75">
                            <button @click="showFunc"
                                class="material-symbols-outlined bg-gray-500 rounded-full p-1 m-10 absolute top-2 right-2">
                                close </button>
                            <iframe :src="afile.fileUrl" frameborder='0'
                                class="w-1/2 h-full mx-auto text-center bg-black/25 " v-click-outside="showFunc">
                            </iframe>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script >
import { onBeforeMount, ref } from 'vue';





export default {
    props: ["materials", "posts"],
    setup(props) {
        const show = ref(false)
        const showFunc = () => {
            show.value = !show.value
        }
        const arr = ref([])
        const arr1 = ref([])

        const postDataFunc = () => {
            props.posts.forEach(post => {
                arr.value.push(post.files)
            })
            arr.value.forEach(a => {
                a.forEach(b => {
                    arr1.value.push(b)
                })
            })
        }

        console.log(arr.value, arr1.value);
        onBeforeMount(() => {
            postDataFunc()
        })
        console.log(props.posts);
        return {
            show, showFunc, postDataFunc, arr, arr1
        }
    }
}
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>