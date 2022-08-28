<template>
    <div>
        <div class="container mx-auto">
            <div class="flex justify-center my-12">
                <div class="w-full xl:w-3/4 lg:w-11/12 flex ">
                    <div class="w-full h-auto bg-gray-400 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg "
                        style="background-image: url('https://source.unsplash.com/DR7JSeKdKwc/')"></div>
                    <div class="w-full lg:w-7/12  rounded-lg lg:rounded-l-none ring ring-slate-100">
                        <h3 class="pt-4 text-2xl text-center">Create an Account!</h3>
                        <form class=" px-8 pt-6 pb-0  rounded  " @submit.prevent="register">
                            <div class="mb-4 md:flex md:justify-between">
                                <div class="mb-4 md:mr-2 md:mb-0">
                                    <label class="block mb-2 text-sm font-bold text-gray-700" for="firstName">
                                        First Name
                                    </label>
                                    <input
                                        class="w-full px-3 py-3 text-sm leading-tight text-gray-700 border rounded-full shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="firstName" type="text" placeholder="First Name"
                                        v-model="registerPlaceholder.displayName.firstName" />
                                </div>
                                <div class="md:ml-2">
                                    <label class="block mb-2 text-sm font-bold text-gray-700" for="lastName">
                                        Last Name
                                    </label>
                                    <input
                                        class="w-full px-3 py-3 text-sm leading-tight text-gray-700 border rounded-full shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="lastName" type="text" placeholder="Last Name"
                                        v-model="registerPlaceholder.displayName.lastName" />
                                </div>
                            </div>
                            <div class="mb-4 flex flex-col md:flex-row md:gap-10">
                                <div class=" basis-1/2 ">
                                    <label class="block mb-2 text-sm font-bold text-gray-700" for="email">
                                        Email
                                    </label>
                                    <input
                                        class="w-full px-3 py-3 mb-3 text-sm leading-tight text-gray-700 border rounded-full shadow appearance-none focus:outline-none focus:shadow-outline"
                                        id="email" type="email" placeholder="Email" v-model="registerPlaceholder.email"
                                        required />
                                </div>
                                <label for="roles" class="text-sm font-bold">Roles:</label>
                                <div class=" md:flex self-center basis-1/2" :class="{ 'animate-pulse ring ring-red-500 rounded': !focus }"
                                    id="roles">
                                    <ul
                                        class="items-center text-center w-full h-1/2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex ">
                                        <li
                                            class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r hover:bg-gray-100 ">
                                            <div class="flex items-center pl-3">
                                                <input id="horizontal-list-radio-license" type="radio" v-model="role"
                                                    :value="'Student'" name="list-radio"
                                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2  "
                                                    required @focusin="focus = true">
                                                <label for="horizontal-list-radio-license"
                                                    class="py-3 ml-2 w-full text-sm font-medium text-gray-900 cursor-pointer ">Student</label>
                                            </div>
                                        </li>
                                        <li
                                            class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r hover:bg-gray-100">
                                            <div class="flex items-center pl-3">
                                                <input id="horizontal-list-radio-id" type="radio" v-model="role"
                                                    :value="'Teacher'" name="list-radio"
                                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-5000 focus:ring-2"
                                                    required @focusin="focus = true">
                                                <label for="horizontal-list-radio-id"
                                                    class="py-3 ml-2 w-full text-sm font-medium text-gray-900 cursor-pointer">Teacher</label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="mb-4 md:flex md:justify-between">
                                <div class="mb-4 md:mr-2 md:mb-0">
                                    <label class="block mb-2 text-sm font-bold text-gray-700" for="password">
                                        Password
                                    </label>
                                    <input
                                        class="w-full px-3 py-3 mb-3 text-sm leading-tight text-gray-700 border  rounded-full shadow appearance-none focus:outline-none focus:shadow-outline"
                                        :class="{}" id="password" type="password" placeholder="******************"
                                        v-model="registerPlaceholder.password.password" required />

                                </div>
                                <div class="md:ml-2">
                                    <label class="block mb-2 text-sm font-bold text-gray-700" for="c_password">
                                        Confirm Password
                                    </label>
                                    <input
                                        class="w-full px-3 py-3 mb-3 text-sm leading-tight text-gray-700 border rounded-full shadow appearance-none focus:outline-none focus:shadow-outline "
                                        id="c_password" type="password" placeholder="******************"
                                        :class="{ 'ring ring-red-500': test }"
                                        v-model="registerPlaceholder.password.confirm" />
                                </div>
                            </div>
                            <div class="mb-6 text-center">
                                <button
                                    class="w-[200px] h-[50px] px-4 py-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-700  hover:scale-105 hover:shadow-md active:bg-green-500 active:scale-100"
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
                        <div class=" p-3 text-center">
                            <span class=" text-red-500 italic mb-3" v-if="!role">Please choose a role before.</span>
                            <button @click="signInWithGoogle" class="pl-2 font-semibold flex mx-auto mb-3 gap-2 max-w-fit p-3 rounded ring
                                 ring-gray-200 divide-x-2 disabled:bg-gray-400 disabled:text-gray-100
                                 " :class="{ ' hover:bg-gray-50 hover:scale-105 transition-all': role }"
                                :disabled="!role">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png"
                                    alt="" srcset="" width="30" class="">
                                <span class="p-2">
                                    Sign Up with
                                    Google
                                </span>
                            </button>
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
            password: { password: '', confirm: '' },

        }
        const focus = ref(false)
        const role = ref('')
        const test = ref(false)
        const register_form = ref({})
        const store = useStore();
        const register = () => {

            if (registerPlaceholder.password.password == registerPlaceholder.password.confirm) {
                register_form.value.displayName = registerPlaceholder.displayName.firstName + ' ' + registerPlaceholder.displayName.lastName
                register_form.value.email = registerPlaceholder.email
                register_form.value.password = registerPlaceholder.password.password
                if (role.value) {
                    register_form.value.role = role.value
                    console.log(register_form.value.role);
                    store.dispatch("register", register_form.value);
                } else {
                    console.log('error');
                }

            } else {
                test.value = true;
                alert("Passwords don't match")
            }
            console.log(register_form.value, registerPlaceholder);
        }

        const signInWithGoogle = () => {
            store.dispatch("signUserInGoogle", role.value);
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
            test,
            role,
            focus
        };
    },

};
</script>

<style lang="scss" scoped>
</style>