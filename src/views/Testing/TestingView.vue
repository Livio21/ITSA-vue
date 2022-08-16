<template>
  <div class="login m-auto">
    <section
      class="forms flex flex-col gap-3 my-10 p-10 rounded-lg ring-2 ring-slate-100"
    >
      <form
        action=""
        class="register flex flex-col items-center gap-3"
        @submit.prevent="register"
        v-show="registerForm"
      >
        <h2 class="text-center text-xl font-semibold">Sign Up</h2>
        <input
          class="p-2 rounded-md ring-2 ring-slate-100 hover:bg-slate-50 focus:bg-slate-100"
          type="email"
          placeholder="Email Address"
          v-model="register_form.email"
          required
        />
        <input
          class="p-2 rounded-md ring-2 ring-slate-100 hover:bg-slate-50 focus:bg-slate-100"
          type="text"
          placeholder="Name"
          v-model="register_form.displayName"
          required
        />
        <input
          class="p-2 rounded-md ring-2 ring-slate-100 hover:bg-slate-50 focus:bg-slate-100"
          type="password"
          placeholder="Password"
          v-model="register_form.password"
          required
        />
        <input
          class="bg-blue-500 w-fit rounded-full px-5 py-3 text-white cursor-pointer hover:bg-blue-400 hover:scale-105 hover:shadow-md active:bg-blue-500 active:scale-100"
          type="submit"
          value="Sign Up"
        />
        <button
          class="hover:border-b-2"
          @click="
            registerForm = false;
            loginForm = true;
          "
        >
          or Sign In
        </button>
        <button
          @click="signInWithGoogle"
          class="bg-blue-500 rounded-full px-5 py-3 text-white cursor-pointer hover:bg-blue-400 hover:scale-105 hover:shadow-md active:bg-blue-500 active:scale-100"
        >
          Sign Un With Google
        </button>
      </form>
      <form
        action=""
        class="login flex flex-col items-center gap-3"
        @submit.prevent="login"
        v-show="loginForm"
      >
        <h2 class="text-center text-xl font-semibold">Sign In</h2>
        <input
          class="p-2 rounded-md ring-2 ring-slate-100 hover:bg-slate-50 focus:bg-slate-100"
          type="email"
          placeholder="Email Address"
          v-model="login_form.email"
          required
        />
        <input
          class="p-2 rounded-md ring-2 ring-slate-100 hover:bg-slate-50 focus:bg-slate-100"
          type="password"
          placeholder="Password"
          v-model="login_form.password"
          required
        />
        <input
          class="bg-blue-500 w-fit rounded-full px-5 py-3 text-white cursor-pointer hover:bg-blue-400 hover:scale-105 hover:shadow-md active:bg-blue-500 active:scale-100"
          type="submit"
          value="Sign In"
        />
        <button
          class="hover:border-b-2"
          @click="
            registerForm = true;
            loginForm = false;
          "
        >
          or Sign Up
        </button>
        <button
          @click="signInWithGoogle"
          class="bg-blue-500 rounded-full px-5 py-3 text-white cursor-pointer hover:bg-blue-400 hover:scale-105 hover:shadow-md active:bg-blue-500 active:scale-100"
        >
          Sign In With Google
        </button>
      </form>
    </section>
  </div>
</template>

<script>
// import { async } from "@firebase/util";
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const login_form = ref({});
    const register_form = ref({});

    const store = useStore();
    const login = () => {
      store.dispatch("login", login_form.value);
    };
    const register = () => {
      store.dispatch("register1", register_form.value);
    };

    const signInWithGoogle = () => {
      store.dispatch("signUserInGoogle");
    };
    const userData = () => {
      store.dispatch("fetchUser");
    };

    return {
      login_form,
      register_form,
      register,
      login,
      signInWithGoogle,
      userData,
    };
  },
  data() {
    return {
      registerForm: null,
      loginForm: true,
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
