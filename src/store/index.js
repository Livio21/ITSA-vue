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
  updatePassword,
} from "firebase/auth";
// import { onSnapshot } from "firebase/firestore";
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
    CURR_COURSE(state, payload) {
      state.course = payload;
    },
  },
  actions: {
    async updateUser({ commit }, details) {
      const { displayName, photoURL } = details;

      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      })
        .then(() => {
          console.log("Profile updated");
          alert("Success");
          commit("SET_USER", auth.currentUser);
          router.push("/");
        })
        .catch((err) => {
          console.log(err.message, "error");
        });
    },
    async updateUserEmail({ commit }, details) {
      const { email } = details;

      await updateEmail(auth.currentUser, email)
        .then(() => {
          console.log("email updated");
          commit("SET_USER", auth.currentUser);
        })
        .catch((err) => {
          console.log(err.message, "error");
        });
    },
    async updatePass({ commit }, details) {
      const { password } = details;
      await updatePassword(auth.currentUser, password)
        .then(() => {
          console.log("password updated");
          commit("SET_USER", auth.currentUser);
        })
        .catch((err) => {
          console.log(err.message, "error");
        });
      commit("CLEAR_USER");
      router.push("/login");
    },

    // async getCourse({commit}){
    //   onSnapshot(collection(db, "Courses"), (querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       const test = {
    //         id: doc.id,
    //         title: doc.data().title,
    //       };

    //       courseTitles.value.push(test);
    //     });
    //     console.log(courseTitles.value);
    //   });
    // },
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
      router.push("/login");
    },

    async register({ commit }, details) {
      const { displayName, email, password } = details;
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        updateProfile(auth.currentUser, {
          displayName: displayName,
          photoURL: "https://freesvg.org/img/abstract-user-flat-4.png",
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
          if (router.isReady() && router.currentRoute.value.path === "/login") {
            router.push("/");
          }
        }
        // console.log(user);
      });
    },
  },
  modules: {},
});
