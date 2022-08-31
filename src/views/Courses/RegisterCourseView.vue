<template>
    <div v-if="store.state.user" class="w-full h-full flex justify-center items-center ">
        <form action="" class="p-10 bg-slate-50 rounded-3xl flex flex-col items-center gap-10 shadow-xl">
            <label for="code" class="text-xl font-semibold text-slate-700">Course Code</label>
            <span class="italic text-sm text-slate-500">Course code provided by the instructor.</span>
            <input id="code" type="text" class=" p-3 shadow-inner rounded-full text-center font-semibold" v-model="code"
                pattern="[A-Za-z0-9]{5}" maxlength="5" required placeholder="Ex: a1b2c"
                title="Max 5 characters allowed, no special characters!">
            <button type="submit"
                class="bg-blue-500 px-5 w-fit py-2 rounded-full text-lg text-white font-semibold active:scale-95 hover:bg-blue-400 active:bg-blue-600"
                @click="setUserAccess">Register</button>
        </form>
    </div>
</template>

<script setup>
import { db } from '@/firebase';
import router from '@/router';
import { arrayUnion, collection, onSnapshot, query, updateDoc, where, doc } from '@firebase/firestore';
import { ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore()
const code = ref()
const setUserAccess = () => {
    const re = /[A-Za-z0-9]{5}/
    if (re.test(code.value)) {
        const q = query(collection(db, "Courses"), where("code", "==", code.value))
        onSnapshot(q, (querySnapshot) => {
            console.log(querySnapshot);
            querySnapshot.forEach((c) => {

                const docRef = doc(db, "Courses", c.id)
                if (c.users) {
                    updateDoc(docRef, {
                        users: arrayUnion(store.state.user.uid)
                    }).then(() => {
                        router.push({ name: 'courses', params: { courseName: c.data().title.replaceAll(' ', '-'), courseID: c.id } })
                    })
                } else {
                    updateDoc(docRef, {
                        users: store.state.user.uid
                    })
                }
            });
            // courseTitles.value = arr;
            // console.log(courseTitles.value);
        });
    } else {
        console.log('error');
        code.value = ''
    }
}

</script>

<style lang="scss" scoped>
</style>