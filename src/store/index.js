import { createStore } from "vuex";
import router from "../router";
import { auth, db } from "../firebase";

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
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

// import { onSnapshot } from "firebase/firestore";

export default createStore({
  state: {
    user: null,
    showNav: false,
    course: null,
    isNew: null,
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
    NEW_USER(state, payload) {
      state.isNew = payload;
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
    async login({ commit }, details) {
      const { email, password } = details;

      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          commit("SET_USER", auth.currentUser);
          router.push("/");
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/user-not-found":
              alert("User not found");
              break;
            case "auth/wrong-password":
              alert("Wrong password");
          }
          return;
        });
    },

    async logout({ commit }) {
      await signOut(auth);
      commit("CLEAR_USER");
      router.push("/login");
    },

    async register({ commit }, details) {
      const { displayName, email, password, role } = details;

      await createUserWithEmailAndPassword(auth, email, password)
        .then(async () => {
          await updateProfile(auth.currentUser, {
            displayName: displayName,
            photoURL: "https://freesvg.org/img/abstract-user-flat-4.png",
          });
          await setDoc(doc(db, "Users", auth.currentUser.uid), {
            name: displayName,
            email: email,
            role: role,
          });
          commit("SET_USER", auth.currentUser);
          router.push("/");
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/email-already-in-use":
              alert("email-already-in-use");
              break;
            case "auth/invalid-email":
              alert("invalid email");
          }
          return;
        });
    },
    async check({ commit }) {
      const docSnap = await getDoc(doc(db, "Users", auth.currentUser.id));
      if (docSnap.exists()) {
        commit("NEW_USER", false);
      } else {
        commit("NEW_USER", true);
      }
    },
    async signUserInGoogle({ commit }, role) {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
        .then(async (result) => {
          onSnapshot(doc(db, "Users", result.user.uid), (docSnap) => {
            if (!docSnap.exists()) {
              setDoc(doc(db, "Users", auth.currentUser.uid), {
                name: auth.currentUser.displayName,
                email: auth.currentUser.email,
                role: role,
              }).then(() => {
                commit("SET_USER", auth.currentUser);
                router.push("/");
                console.log("success, new user");
              });
            } else {
              commit("SET_USER", auth.currentUser);
              router.push("/");
              console.log("success, old user");
            }
          });
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/account-exists-with-different-credential":
              alert("User's email already exists.");
              break;
            case "auth/invalid-email":
              alert("invalid email");
          }
        });
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
