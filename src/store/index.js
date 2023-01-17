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
  sendEmailVerification,
  getAdditionalUserInfo,
} from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  query,
  where,
  collection,
  updateDoc
} from "firebase/firestore";

// import { onSnapshot } from "firebase/firestore";

export default createStore({
  state: {
    user: {},
    courseTitle: null,
    showNav: false,
    course: null,
    isNew: null,
    currentQuiz: null,
  },
  getters: {},
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_USER_ROLE(state, payload) {
      state.user.role = payload;
    },
    CLEAR_USER(state) {
      state.user = null;
    },
    SET_COURSE(state, payload) {
      state.courseTitle = payload;
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
    SET_QUIZ(state, payload) {
      state.currentQuiz = payload;
    },
  },
  actions: {
    async updateUser({ commit }, profile) {
      const { displayName, photoURL } = profile;
      if (displayName != undefined) {
        await updateProfile(auth.currentUser, profile)
          .then(() => {
            updateDoc(doc(db, "Users", auth.currentUser.uid), {
              displayName: displayName,
              photoURL: photoURL,
            });
            console.log("Profile updated");
            alert("Success");
            commit("SET_USER", auth.currentUser);
          })
          .catch((err) => {
            console.log(err.message, "error");
          });
      } else if (displayName == undefined) {
        console.log(displayName);
        await updateProfile(auth.currentUser, {
          photoURL,
        })
          .then(() => {
            console.log("Profile updated");
            alert("Success");
            commit("SET_USER", auth.currentUser);
          })
          .catch((err) => {
            console.log(err.message, "error");
          });
      }
    },
    async updateUserEmail({ commit }, details) {
      const { email } = details;

      await updateEmail(auth.currentUser, email)
        .then(() => {
          alert("Email updated!");
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
          alert("Password updated!");
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
        .then(async () => {
          await getDoc(doc(db, "Users", auth.currentUser.uid)).then((doc) => {
            let role = doc.data().role;
            commit("SET_USER", auth.currentUser);
            commit("SET_USER_ROLE", role);
            
            router.push(role == 'Student' ? '/student-dashboard':'/teacher-dashboard');
          });
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
        .then(async (usercred) => {
          commit("SET_USER", auth.currentUser);
          await sendEmailVerification(usercred.user)
            .then(() => {
              updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: "https://freesvg.org/img/abstract-user-flat-4.png",
              }).then(() => {
                setDoc(doc(db, "Users", auth.currentUser.uid), {
                  id: auth.currentUser.uid,
                  name: displayName,
                  email: email,
                  role: role,
                  photo: "https://freesvg.org/img/abstract-user-flat-4.png",
                }).then(() => {
                  commit("SET_USER_ROLE", role);
                  router.push("/verify");
                });
              });
            })
            .catch((error) => {
              alert(error);
            });
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
    getCourseInfo({ commit }) {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const q = query(
            collection(db, "Courses"),
            where("users", "array-contains", auth.currentUser.uid)
          );
          // const q = query(collection(db, 'Courses'))
          onSnapshot(q, (querySnapshot) => {
            let arr = [];
            querySnapshot.forEach((doc) => {
              const obj = {
                id: doc.id,
                title: doc.data().title,
              };
              arr.push(obj);
            });
            commit("SET_COURSE", arr);
            // c
          });
        }
      });
    },

    async signUserInGoogle({ commit }, role) {
      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider)
        .then(async (result) => {
          const additionalUserInfo = getAdditionalUserInfo(result);
          const isNewUser = additionalUserInfo.isNewUser;
          if (isNewUser) {
            alert("New User, please register and select your role!");
            router.push("/register").then(() => {
              onSnapshot(doc(db, "Users", result.user.uid), (docSnap) => {
                if (!docSnap.exists()) {
                  setDoc(doc(db, "Users", auth.currentUser.uid), {
                    name: auth.currentUser.displayName,
                    email: auth.currentUser.email,
                    photo: auth.currentUser.photoURL,
                    role: role,
                  }).then(() => {
                    commit("SET_USER", auth.currentUser);
                    commit("SET_USER_ROLE", role);
                    router.push(role == 'Student' ? '/student-dashboard':'/teacher-dashboard');
                    console.log("success, new user");
                  });
                } else {
                  console.log("error");
                }
              });
            });
            console.log("New user");
          } else {
            await getDoc(doc(db, "Users", auth.currentUser.uid)).then((doc) => {
              commit("SET_USER", auth.currentUser);
              commit("SET_USER_ROLE", doc.data().role);
              router.push(role == 'Student' ? '/student-dashboard':'/teacher-dashboard');
              console.log("successful, old user");
            });
            // commit("SET_USER", auth.currentUser);
            // router.push("/");
          }
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
       auth.onAuthStateChanged((user) => {
        if (user === null) {
          commit("CLEAR_USER");
        } else {
          getDoc(doc(db, "Users", user.uid)).then((doc) => {
            console.log(doc.data().role);

            commit("SET_USER_ROLE", doc.data().role);
            commit("SET_USER", user);
            router.push("/");
            if (
              router.isReady() &&
              router.currentRoute.value.path === "/login"
            ) {
              router.push(doc.data().role == 'Student' ? '/student-dashboard':'/teacher-dashboard');
            }
          });
        }
        // console.log(user);
      });
    },
  },
  modules: {},
});
