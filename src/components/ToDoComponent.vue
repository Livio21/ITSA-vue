<template>
    <div class="max-w-7xl bg-slate-100 rounded-3xl mx-auto p-10 flex flex-wrap gap-4 ">
        <div class=" max-w-7xl bg-slate-100 rounded-3xl  p-10 flex gap-4 ">
            <div class="w-[250px]">
                <span class="text-6xl text-slate-700 font-semibold">Notes</span><br>
                <span class="text-lg text-slate-700 font-semibold">Notes and to-dos</span>
            </div>
            <button @click="toggleNoteCreate(); showNote = false"
                class="material-symbols-outlined flex-shrink-0 self-center -rotate-90 bg-white h-[50px] w-[50px] rounded-full font-bold text-lg shadow-md hover:bg-gray-100 active:scale-95 active:shadow-none">
                <span :class="{'rotate-180':showNoteCreate}" class="material-symbols-outlined">
                    expand_more
                </span></button>
            <transition name="slide-fade">
                <div v-show="showNoteCreate" class="flex gap-5 items-center" v-click-outside="toggleShowNote">
                    <span v-if="errorMsg" class="text-red-500 text-sm italic">{{errorMsg}}</span>
                    <div class="grid flex-shrink-0 relative">
                        <input type="text" id="todotitle" @focus="showNote = true"
                            class="h-[50px] p-3  rounded-3xl rounded-b-3xl  focus:bg-white focus:outline-none text-lg font-semibold transition-all drop-shadow-md"
                            :class="{' rounded-b-none': showNote , 'ring ring-red-500': errorMsg}" placeholder="Title"
                            v-model="note.title">
                        <textarea name="" id="" rows="10" v-show="showNote" :class="{'ring ring-red-500': errorMsg}"
                            class="resize-none focus:outline-none p-3 rounded-b border-t absolute top-[50px] w-full z-20 drop-shadow-md"
                            placeholder="Note" v-model="note.text"></textarea>
                    </div>
                    <div class="flex h-fit relative" title="Pick date.">
                        <button for="datepicker" title="Set deadline."
                            class="material-symbols-outlined bg-white h-[50px] w-[50px] rounded-3xl font-bold text-lg shadow-md hover:bg-gray-100 active:scale-95 active:shadow-none transition-all"
                            :class="{'rounded-r-none  bg-gray-50 shadow-inner' :showDatePicker, 'ring ring-red-500': errorMsg}"
                            @click="toggleDatePicker">add_alert</button>
                        <transition name="slide-fade">
                            <!-- <input v-show="showDatePicker" type="date" name="" id="datepicker"
                                class="p-3 border-l rounded-r-full" v-model="note.deadline"> -->
                            <input v-show="showDatePicker" type="datetime-local" name="" id="timelimit"
                                class="p-3 border-l rounded-r-full" v-model="note.deadline">
                        </transition>
                    </div>
                    <button @click="addNote"
                        class="material-symbols-outlined flex-shrink-0 self-center bg-white h-[70px] w-[70px] rounded-full font-bold text-lg shadow-md hover:bg-gray-100 active:scale-95 active:shadow-none">note_add</button>
                </div>
            </transition>
        </div>
        <div v-if="notes"
            class="w-full bg-white shadow-inner rounded-2xl overflow-x-scroll p-5 flex gap-3 text-slate-700"
            id="container">
            <transition-group name="slide-fade">
                <div v-for="(note,index) in notes" :key="index"
                    :class="{'ring ring-red-500' : note.finished,'order-last bg-gray-50':note.checked }"
                    :title="'Till '+note.deadline.toDate()"
                    class="p-3 rounded-2xl ring-1 ring-slate-200  w-[300px] flex-shrink-0 relative transition-all h-fit">
                    <div class="flex  justify-between items-center gap-3 p-1" :class="{'border-b':note.expandNote}">
                        <button @click="checkToggle(note)"
                            class="material-symbols-outlined p-1 shrink-0 rounded-full hover:bg-slate-100 active:bg-slate-200 active:scale-95">
                            {{note.checked ? 'check_box':'check_box_outline_blank'}}
                        </button>
                        <h1 :class="{'line-through': note.checked}" class="text-xl font-semibold basis-full pl-1">
                            {{note.title}}
                        </h1>
                        <button v-show="note.expandNote" @click="deleteNote(note)" title="Delete note."
                            class="material-symbols-outlined p-1 shrink-0 rounded-full hover:bg-red-500 hover:text-white transition-all active:bg-slate-200 active:scale-95">remove</button>
                        <button @click="toggleExpandNote(note)"
                            class="material-symbols-outlined p-1 shrink-0 rounded-full hover:bg-slate-100 active:bg-slate-200 active:scale-95">{{
                            note.expandNote ? 'expand_less':'expand_more'}}</button>
                    </div>
                    <transition name="slide-bottom">
                        <div v-show="note.expandNote" class="relative">
                            <p :class="{'line-through': note.checked}" class="p-2">{{note.text}}</p>
                            <span class="text-sm italic absolute bottom-0 right-0">For: {{
                            getFullDate(note.deadline.toDate())}}</span>
                        </div>
                    </transition>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script setup>
import { db } from '@/firebase';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, } from '@firebase/firestore';
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const note = ref({})
const notes = ref([])
const showDatePicker = ref(false)
const showNoteCreate = ref(false)
const showNote = ref(false)
const docRef = collection(db, "Users", store.state.user.uid, "Notes")
const errorMsg = ref(null)

const getFullDate = (dateobj) => {
    var dd = String(dateobj.getDate()).padStart(2, '0');
    var mm = String(dateobj.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = dateobj.getFullYear();
    var hh = dateobj.getHours()
    var m = dateobj.getMinutes()

    return dateobj = mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + m
}
const addNote = async () => {
    if (note.value.title) {
        await addDoc(docRef, {
            title: note.value.title,
            text: note.value.text,
            deadline: new Date(note.value.deadline),
            checked: false,
            expandNote: false,
            finished: false,
        }).then(() => {
            showNote.value = false
            showDatePicker.value =
                note.value = {
                    title: '',
                    text: '',
                    deadline: null,
                }
        })
    } else {
        errorMsg.value = "Empty fields."
        setTimeout(() => {
            errorMsg.value = null
        }, 3000)
    }
}
const getNotes = () => {
    onSnapshot(docRef, (snapshot) => {
        let arr = []
        snapshot.forEach((note) => {
            if (note.exists()) {
                if (note.data().deadline.toDate() <= new Date() && note.data().checked == false) {
                    updateDoc(doc(db, "Users", store.state.user.uid, "Notes", note.id), {
                        finished: true
                    })
                } else {
                    updateDoc(doc(db, "Users", store.state.user.uid, "Notes", note.id), {
                        finished: false
                    })
                }
                let obj = {
                    id: note.id,
                    title: note.data().title,
                    text: note.data().text,
                    deadline: note.data().deadline,
                    checked: note.data().checked,
                    expandNote: note.data().expandNote,
                    finished: note.data().finished,
                }
                arr.push(obj)
            }
        })
        notes.value = arr
    })
}
getNotes()
const checkToggle = (n) => {
    if (n.checked) {
        updateDoc(doc(db, "Users", store.state.user.uid, "Notes", n.id), {
            checked: false
        })
    } else {
        updateDoc(doc(db, "Users", store.state.user.uid, "Notes", n.id), {
            checked: true
        })
    }
}
const deleteNote = (n) => {
    deleteDoc(doc(db, "Users", store.state.user.uid, "Notes", n.id))
}
const toggleShowNote = () => {
    showNote.value = false
}

const toggleDatePicker = () => {
    showDatePicker.value = !showDatePicker.value
}
const toggleNoteCreate = () => {
    showNoteCreate.value = !showNoteCreate.value
}
const toggleExpandNote = (n) => {
    n.expandNote = !n.expandNote
}


</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
    transition: all 0.3s ease-in-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
}

.slide-bottom-enter-active {
    transition: all 0.2s ease-out;
}

.slide-bottom-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
    transform: translatey(-20px);
    opacity: 0;
}

#container::-webkit-scrollbar {
    width: 0.6vw;
    border-bottom: 5px solid rgba(255, 255, 255, 0);
}

#container::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 10px 10px rgb(211, 211, 211);
    border-radius: 10px;
    border: solid 3px transparent;
}

#container::-webkit-scrollbar-track {
    box-shadow: inset 0 0 10px 10px rgba(255, 255, 255, 0);
    border: solid 3px transparent;
}

#container::-webkit-scrollbar-button {
    background-color: rgba(240, 248, 255, 0);
}

#container::-webkit-scrollbar-thumb:hover {
    background: rgb(219, 219, 219);
}

#container::-webkit-scrollbar-thumb:active {
    background: rgb(192, 192, 192);
}
</style>