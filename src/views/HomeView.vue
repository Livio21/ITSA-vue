<template>
  <div class="home">
    <span>This is the homepage Showcase app features</span>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { collection} from 'firebase/firestore';
import { getDocs } from "@firebase/firestore";

export default{

    setup(){
        const colRef = collection(db, 'users')
        getDocs(colRef).then((snapshot) =>{
            // console.log(snapshot.docs);
            let users = []
            snapshot.docs.forEach((doc) =>{
                users.push({...doc.data(),id: doc.id})
            })
            // console.log(users);
        }) 
        .catch(err =>{
            console.log(err.message);
        })
    }
}
</script>
