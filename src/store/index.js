import { createStore } from "vuex";
import router from "../router";
import { auth } from "../firebase";

// import { db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  updateProfile,
  updateEmail,
} from "firebase/auth";
// import { addDoc } from "firebase/firestore";

export default createStore({
  state: {
    user: null,
    showNav: false,
    course: null,
  },
  getters: {},
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    CLEAR_USER(state) {
      state.user = null;
    },
    SHOW_NAV(state) {
      state.showNav = !state.showNav;
    },
  },
  actions: {
    async updateUser({ commit }, details) {
      const { displayName, photoURL } = details;
      try {
        await updateProfile(auth.currentUser, {
          displayName: displayName,

          photoURL: photoURL,
        });
      } catch (err) {
        console.log("error");
        return;
      }
      commit("SET_USER", auth.currentUser);
    },
    async updateUserEmail({ commit }, details) {
      const { email } = details;
      try {
        await updateEmail(auth.currentUser, email);
      } catch (err) {
        console.log("error");
        return;
      }
      commit("SET_USER", auth.currentUser);
    },

    async login({ commit }, details) {
      const { email, password } = details;
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        switch (error.code) {
          case "auth/user-not-found":
            alert("User not found");
            break;
          case "auth/wrong-password":
            alert("Wrong password");
        }
        return;
      }
      commit("SET_USER", auth.currentUser);
      router.push("/");
    },

    async logout({ commit }) {
      await signOut(auth);
      commit("CLEAR_USER");
      router.push("/sign-in");
    },

    async register({ commit }, details) {
      const { displayName, email, password } = details;
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        updateProfile(auth.currentUser, {
          displayName: displayName,
        });
      } catch (error) {
        switch (error.code) {
          case "auth/email-already-in-use":
            alert("email-already-in-use");
            break;
          case "auth/invalid-email":
            alert("invalid email");
        }
        return;
      }
      commit("SET_USER", auth.currentUser);
      router.push("/");
    },
    async signUserInGoogle({ commit }) {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        switch (error.code) {
          case "auth/account-exists-with-different-credential":
            alert("User's email already exists.");
            break;
          case "auth/invalid-email":
            alert("invalid email");
        }
        return;
      }

      commit("SET_USER", auth.currentUser);
      router.push("/");
    },

    fetchUser({ commit }) {
      auth.onAuthStateChanged(async (user) => {
        if (user === null) {
          commit("CLEAR_USER");
        } else {
          commit("SET_USER", user);
          if (
            router.isReady() &&
            router.currentRoute.value.path === "/sign-in"
          ) {
            router.push("/");
          }
        }
        // console.log(user);
      });
    },
  },
  modules: {},
});
