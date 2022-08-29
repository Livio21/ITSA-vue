<template>
  <div>
    <FileEmbeddComponent></FileEmbeddComponent>
  </div>
</template>

<script>
// import { async } from "@firebase/util";
import { ref } from "vue";
import { useStore } from "vuex";
import FileEmbeddComponent from "@/components/Course/FileEmbeddComponent.vue";

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
  components: { FileEmbeddComponent }
};
</script>

<style lang="scss" scoped>
</style>
