import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { auth } from "../firebase";
import VerifiedView from "../views/User/VerifiedView.vue";
import About from "../views/AboutView.vue";
import CourseView from "../views/Courses/CourseView.vue";
import Quizzes from "../views/Quizz/ViewQuizzes.vue";
import CreateQuizzes from "../views/Quizz/CreateQuizzes.vue";
import Quiz from "../views/Quizz/QuizView.vue";
import CreateCourseView from "../views/Courses/CreateCourseView.vue";
import RegisterCourseView from "../views/Courses/RegisterCourseView.vue";
import ProfileView from "../views/User/ProfileView.vue";
import EditProfile from "../views/User/EditProfile.vue";
import RegisterView from "../views/Auth/RegisterView.vue";
import LoginView from "../views/Auth/LoginView.vue";
import ResetPass from "../views/Auth/ResetPass.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {},
  },
  {
    path: "/verify",
    name: "verify",
    component: VerifiedView,
    meta: {
      requiresAuth: true,
      requiresVer: false,
    },
  },
  {
    path: "/about",
    name: "about",
    component: About,
    meta: {},
  },
  {
    path: "/courses/:courseName/:courseID",
    name: "courses",
    component: CourseView,
    props: true,
    meta: {
      requiresAuth: true,
      requiresVer: true,
    },
  },
  {
    path: "/create-quizzes",
    name: "create-quiz",
    component: CreateQuizzes,
    meta: {
      requiresAuth: true,
      requiresVer: true,
    },
  },
  {
    path: "/quiz/:quizTitle",
    name: "quiz",
    component: Quiz,
    props: true,
    meta: {
      requiresAuth: true,
      requiresVer: true,
    },
  },
  {
    path: "/view-quizzes",
    name: "view-quiz",
    component: Quizzes,
    meta: {
      requiresAuth: true,
      requiresVer: true,
    },
  },
  {
    path: "/create-course",
    name: "createCourse",
    component: CreateCourseView,
    meta: {
      requiresAuth: true,
      requiresVer: true,
      teacherOnly: true,
    },
  },
  {
    path: "/register-course",
    name: "register-course",
    component: RegisterCourseView,
    meta: {
      requiresAuth: true,
      requiresVer: true,
    },
  },
  {
    path: "/my-profile",
    name: "Profile",
    component: ProfileView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/edit-profile",
    name: "EditProfile",
    component: EditProfile,
    meta: {
      requiresAuth: true,
      requiresVer: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/forgot-password",
    name: "Reset Pass",
    component: ResetPass,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.path === "/login" && auth.currentUser) {
    next("/");
    return;
  }
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !auth.currentUser
  ) {
    next("/login");
    return;
  }
  if (
    to.matched.some((record) => record.meta.requiresVer) &&
    to.matched.some((record) => record.meta.requiresAuth) &&
    !auth.currentUser.emailVerified
  ) {
    next("/verify");
    return;
  }

  next();
});
export default router;
