<template>
    <div class="w-full flex flex-col items-center gap-3 flex-wrap md:flex-nowrap  p-4 " v-if="materials">
        <div>
            <span class="font-semibold text-lg text-slate-700">Materials uploaded by the instructor:</span>
        </div>
        <div class="bg-white shadow-inner rounded-3xl  md:h-fit md:min-h-[200px] md:w-fit  p-5">
            <div v-for="(file, index) in materials" :key="index"
                class="ring-2 bg-white ring-slate-200 p-3 max-w-fit max-h-fit rounded flex flex-col flex-wrap items-center align-middle relative">

                <button @click="showFunc(file.url)"
                    class="material-symbols-outlined absolute right-1 top-1 active:scale-95">
                    zoom_out_map </button>
                <iframe v-if="!show" :src="file.url" type="" class="" width="px" scrolling="no"></iframe>
                <div class=" md:max-w-[200px] md:max-h-[200px] md:w-fit md:h-fit overflow-hidden ">
                    <a :href="file.url" target="_blank" class=" p-1 text-slate-700 font-semibold active:scale-95 ">{{
                    file.name }}</a>
                </div>
            </div>
        </div>
    </div>
    <div class="w-full flex flex-col items-center gap-3 flex-wrap md:flex-nowrap  p-4 " v-if="arr1">
        <div>
            <span class="font-semibold text-lg text-slate-700">Materials uploaded from posts: </span>
        </div>
        <div class="flex flex-col gap-3 bg-white shadow-inner rounded-3xl  md:h-fit min-h-[200px] md:w-fit  p-5">
            <div v-for="(afile, index) in arr1" :key="index" class="md:min-w-[300px]">
                <div v-if="afile.fileName"
                    class="ring-2 bg-white ring-slate-200 p-3 max-w-fit max-h-fit rounded flex flex-col items-center align-middle relative ">
                    <button @click="showFunc(afile.fileUrl)"
                        class="material-symbols-outlined absolute right-1 top-1 active:scale-95">
                        zoom_out_map </button>


                    <iframe v-if="!show" :src="afile.fileUrl" type="" class="" width="px" scrolling="no"></iframe>

                    <div class=" md:max-w-[200px] md:max-h-[200px] md:w-fit md:h-fit overflow-hidden">
                        <a :href="afile.fileUrl" :download="afile.fileUrl" target="_blank"
                            class=" p-1 text-slate-700 font-semibold active:scale-95 break-words hidden md:block">{{
                            afile.fileName
                            }}</a>
                        <a :href="afile.fileUrl" :download="afile.fileName" target="_blank"
                            class=" p-1 text-slate-700 font-semibold active:scale-95 break-words  md:hidden">Open</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <transition name="v">
        <div v-if="show "
            class="fixed top-0 bottom-0 left-0 right-0 z-50 w-full h-full backdrop-blur backdrop-brightness-75">
            <button  @click="showFunc"
                class="material-symbols-outlined bg-gray-500 rounded-full p-1 m-10 absolute top-2 right-2 z-20">
                close </button>
            <iframe :src="url" frameborder='0' class="w-full z-10 md:w-1/2 h-full mx-auto text-center bg-black/25 "
                v-click-outside="showFunc" align="center">
            </iframe>
        </div>
    </transition>
</template>
<script >
import { ref } from 'vue';
export default {
    props: ["materials", "posts"],
    setup(props) {
        const show = ref(false)
        const url = ref('')
        const showFunc = (u) => {
            show.value = !show.value
            url.value = u
        }
        const arr = ref([])
        const arr1 = ref([])
        const postDataFunc = () => {
            console.log(props.posts);
            if (props.posts) {
                props.posts.forEach(post => {
                    arr.value.push(post.files)
                })
                arr.value.forEach(a => {
                    if (a) {
                        a.forEach(b => {
                            arr1.value.push(b)
                        })
                    }
                })
            }
        }
        console.log(arr.value, arr1.value);
        postDataFunc()
        console.log(props.posts);
        return {
            show, showFunc, postDataFunc, arr, arr1, url
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