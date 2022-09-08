<template>
    <div class="flex flex-col lg:shrink-0 text-slate-700">
        <div class="w-full lg:p-7">
            <span class="font-bold  pt-3 text-2xl lg:text-6xl">
                {{ currentTime.toLocaleTimeString() }}
            </span>
            <p class="font-bold  text-sm mb-1 flex justify-end mr-3">
                {{ currentTime.toLocaleDateString() }}
            </p>
        </div>
    </div>
</template>
<script setup>
import { ref, onBeforeUnmount } from "vue";
const currentTime = ref(new Date());
const updateCurrentTime = () => {
    currentTime.value = new Date();
};
const updateTimeInterval = setInterval(updateCurrentTime, 1000);
onBeforeUnmount(() => {
    clearInterval(updateTimeInterval);
});
</script>
