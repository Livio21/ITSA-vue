// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getStorage, ref } from "firebase/storage";

import { collection, getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHYjvgJq3mHVE8jbd2sET-qHFmqXRj49s",
  authDomain: "itsa-vue.firebaseapp.com",
  projectId: "itsa-vue",
  storageBucket: "itsa-vue.appspot.com",
  messagingSenderId: "927238652374",
  appId: "1:927238652374:web:a579cf1567944852f72477",
  measurementId: "G-41GM1YW839",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);
const storage = getStorage(app);
const profilePicture = (name) => {
  return ref(storage, "profile/" + name);
};

const coursePictureStrg = (name) => {
  return ref(storage, "courseSpan/" + name);
};
const coursePostFiles = (name) => {
  return ref(storage, "coursePost/" + name);
};

const coursesCollection = collection(db, "Courses");
const usersCollection = collection(db, "Users");
const quizzesCollection = collection(db, "Quizzes");

// getDocs(coursesCollection)
//   .then((snapshot) => {
//     let courses = [];
//     snapshot.docs.forEach((doc) => {
//       courses.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(courses);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

export {
  auth,
  db,
  coursesCollection,
  storage,
  profilePicture,
  coursePictureStrg,
  usersCollection,
  quizzesCollection,
  coursePostFiles,
};
