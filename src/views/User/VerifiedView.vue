<template>
    <div class="text-center">
        <h1 class="text-3xl p-3">To access all the features of the page, please verify your email</h1>
        <p>Check your e-mail for the verification link sent and click to verify. <br>
            <br>
            After verification page should refresh automatically. <br> If not, please refresh manually to have access to
            all the features of ITSA.
            <br> <button class=" text-blue-600 hover:text-blue-500 disabled:line-through" @click="sentVerfUrl"
                :disabled="!resend">Resend
            </button> confirmation
            email.
        </p>

    </div>
</template>

<script setup>
import { getAuth, sendEmailVerification } from "firebase/auth";
import { ref } from "vue";
const resend = ref(true)
const sentVerfUrl = () => {
    resend.value = false
    setTimeout((resend.value = true), 3000)
    const auth = getAuth();
    sendEmailVerification(auth.currentUser)
        .then(() => {
            alert('Verification Sent')
        }).catch((error) => {
            alert(error)
        })
}
</script>

<style lang="scss" scoped>
</style>