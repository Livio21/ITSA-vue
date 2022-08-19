<template>
    <div>
        <div class="container mx-auto">
            <div class="flex justify-center px-6 my-12">
                <div class="w-full xl:w-3/4 lg:w-11/12 flex ">
                    <div class="w-full h-auto bg-gray-400 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg "
                        style="background-image: url('https://source.unsplash.com/DR7JSeKdKwc/')"></div>
                    <div class="w-full lg:w-7/12  p-5 rounded-lg lg:rounded-l-none bg-slate-100">
                        <h3 class="pt-4 text-2xl text-center">Create an Account!</h3>
                        <form class="px-8 pt-6 pb-0  rounded  " @submit.prevent="register">
                            <div class="mb-4 md:flex md:justify-between">
                                <div class="mb-4 md:mr-2 md:mb-0">
                                    <label class="block mb-2 text-sm font-bold text-gray-700" for="firstName">
                                        First Name
                                    </label>
                                    <input
                                        class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="firstName" type="text" placeholder="First Name"
                                        v-model="registerPlaceholder.displayName.firstName" />
                                </div>
                                <div class="md:ml-2">
                                    <label class="block mb-2 text-sm font-bold text-gray-700" for="lastName">
                                        Last Name
                                    </label>
                                    <input
                                        class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="lastName" type="text" placeholder="Last Name"
                                        v-model="registerPlaceholder.displayName.lastName" />
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="block mb-2 text-sm font-bold text-gray-700" for="email">
                                    Email
                                </label>
                                <input
                                    class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    id="email" type="email" placeholder="Email" v-model="registerPlaceholder.email" required/>
                            </div>
                            <div class="mb-4 md:flex md:justify-between">
                                <div class="mb-4 md:mr-2 md:mb-0">
                                    <label class="block mb-2 text-sm font-bold text-gray-700" for="password">
                                        Password
                                    </label>
                                    <input
                                        class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border  rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        :class="{}" id="password" type="password" placeholder="******************"
                                        v-model="registerPlaceholder.password.password" required />

                                </div>
                                <div class="md:ml-2">
                                    <label class="block mb-2 text-sm font-bold text-gray-700" for="c_password">
                                        Confirm Password
                                    </label>
                                    <input
                                        class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="c_password" type="password" placeholder="******************"
                                        v-model="registerPlaceholder.password.confirm" />
                                </div>
                            </div>
                            <div class="mb-6 text-center">
                                <button
                                    class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700  hover:scale-105 hover:shadow-md active:bg-blue-500 active:scale-100"
                                    type="submit">
                                    Register Account
                                </button>
                            </div>
                            <hr class="mb-6 border-t" />
                            <div class="text-center">
                                <router-link
                                    class="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                                    to="/forgot-password">
                                    Forgot Password?
                                </router-link>
                            </div>
                            <div class="mb-6  text-center">
                                <router-link
                                    class="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                                    to="/login">
                                    Already have an account? Login!
                                </router-link>
                            </div>
                        </form>
                        <div
                            class="flex mx-auto mb-3 gap-2 bg-white max-w-fit p-3 rounded ring ring-gray-200 divide-x-2 cursor-pointer hover:bg-gray-50 hover:scale-105 transition-all">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png"
                                alt="" srcset="" width="30" class="">
                            <button @click="signInWithGoogle" class="pl-2 font-semibold"> Sign Up with Google</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script >
import { ref } from "vue";
import { useStore } from "vuex";

export default {
    setup() {
        const registerPlaceholder = {
            displayName: { firstName: '', lastName: '' },
            email: '',
            password: { password: '', confirm: '' }
        }

        const register_form = ref({})
        const store = useStore();
        const register = () => {

            if (registerPlaceholder.password.password == registerPlaceholder.password.confirm) {
                register_form.value.displayName = registerPlaceholder.displayName.firstName + ' ' + registerPlaceholder.displayName.lastName
                register_form.value.email = registerPlaceholder.email
                register_form.value.password = registerPlaceholder.password.password

            } else {
                alert("Passwords don't match")
            }
            store.dispatch("register", register_form.value);
            console.log(register_form.value, registerPlaceholder);
        }

        const signInWithGoogle = () => {
            store.dispatch("signUserInGoogle");
        };
        const userData = () => {
            store.dispatch("fetchUser");
        };

        return {
            register_form,
            register,
            signInWithGoogle,
            userData,
            registerPlaceholder,

        };
    },

};
</script>

<style lang="scss" scoped>
</style>