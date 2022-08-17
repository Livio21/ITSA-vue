<template>
    <div>
        <div class="container mx-auto">
            <div class="flex justify-center px-6 my-12">
                <div class="w-full xl:w-3/4 lg:w-11/12 flex">
                    <div class="w-full h-auto bg-gray-400 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg"
                        style="background-image: url('https://source.unsplash.com/kk2MMFSshj0/')"></div>
                    <div class="w-full lg:w-1/2 bg-slate-100 p-5 rounded-lg lg:rounded-l-none">
                        <h3 class="pt-4 text-2xl text-center">Welcome Back!</h3>
                        <form class="px-8 pt-6 pb-4  rounded" @submit.prevent="login">
                            <div class="mb-4">
                                <label class="block mb-2 text-sm font-bold text-gray-700" for="email">
                                    Email
                                </label>
                                <input
                                    class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    id="email" type="email" placeholder="email" v-model="login_form.email" required />
                            </div>
                            <div class="mb-4">
                                <label class="block mb-2 text-sm font-bold text-gray-700" for="password">
                                    Password
                                </label>
                                <input
                                    class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    id="password" type="password" placeholder="******************"
                                    v-model="login_form.password" required />
                            </div>
                            <div class="mb-4">
                                <input class="mr-2 leading-tight" type="checkbox" id="checkbox_id" />
                                <label class="text-sm" for="checkbox_id">
                                    Remember Me
                                </label>
                            </div>
                            <div class="mb-6 text-center">
                                <button
                                    class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 hover:scale-105 hover:shadow-md active:bg-blue-500 active:scale-100"
                                    type="submit">
                                    Sign In
                                </button>
                            </div>
                            <hr class="mb-6 border-t" />
                            <div class="text-center">
                                <router-link
                                    class="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                                    to="/sign-up">
                                    Create an Account!
                                </router-link>
                            </div>
                            <div class="text-center">
                                <router-link
                                    class="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                                    to="/forgot-password">
                                    Forgot Password?
                                </router-link>
                            </div>
                        </form>
                        <div
                            class="flex mx-auto mb-3 gap-2 bg-white max-w-fit p-3 rounded ring ring-gray-200 divide-x-2 cursor-pointer hover:bg-gray-50 hover:scale-105 transition-all">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png"
                                alt="" srcset="" width="30" class="">
                            <button @click="signInWithGoogle" class="pl-2 font-semibold"> Sign In with Google</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script >
// import { async } from "@firebase/util";
import { ref } from "vue";
import { useStore } from "vuex";

export default {
    setup() {
        const login_form = ref({});

        const store = useStore();
        const login = () => {
            store.dispatch("login", login_form.value);
        };


        const signInWithGoogle = () => {
            store.dispatch("signUserInGoogle");
        };


        return {
            login_form,
            login,
            signInWithGoogle,
        };
    },

};
</script>

<style lang="scss" scoped>
</style>