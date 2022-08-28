<template>
    <div class="flex w-full p-3 justify-center items-center gap-3" v-for="(post, index) in postData" :key="index">
        <div id="postText">
            <p>{{ post.text }}</p>
        </div>
        <div id="postFiles" v-for=" (postFile, index) in post.files" :key="index">
            {{ postFile.fileUrl + ' ' + postFile.fileName }}
        </div>
        <div id="postMetadata">
            <span>{{ post.user }}</span> <span>{{ post.date }}</span>
        </div>
    </div>
</template>

<script setup>

// import { useStore } from 'vuex';
// import { ref } from 'vue';

import { onSnapshot, query, collection } from '@firebase/firestore';
import { db } from '@/firebase';
import { ref, defineProps, onMounted } from 'vue';

const props = defineProps(['courseId'])

// const store = useStore()
const postData = ref([{}])
// const postData = {
//     id:'',
//     text: 'Hello students',
//     user: 'Livio',
//     date: '2016-05-01',
//     files: [{
//         url: 'test',
//         filename: 'test.test'
//     },
//     {
//         url: 'test',
//         filename: 'test.test'
//     }]
// }
const test = () => {
    console.log(props.courseId);
    const q = query(collection(db, "Course-Posts"));
    onSnapshot(q, (snapshot) => {
        let arr = []
        snapshot.docs.forEach((doc) => {
            let obj = {
                id: doc.id,
                text: doc.data().text,
                files: doc.data().files,
                user: doc.data().userid
            }
            arr.push(obj);
            console.log(postData.value);
        });
        postData.value = arr
    });

}

onMounted(() => {
    test()
})




</script>

<style lang="scss" scoped>
</style>