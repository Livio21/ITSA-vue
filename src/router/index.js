import { createRouter, createWebHashHistory } from "vue-router";
import { auth } from "../firebase";
import store from "@/store";

const routes = [
  
  {
    path: "/verify",
    name: "verify",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/User/VerifiedView.vue"),
    meta: {
      requiresAuth: true,
      requiresVer: false,
    },
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    meta: {},
  },
  {
    path: "/courses/:courseName/:courseID",
    name: "courses",
    component: () => import("../views/Courses/CourseView.vue"),
    props: true,
    meta: {
      requiresAuth: true,
      requiresVer: true,
    },
  },
  {
    path: "/create-quizzes",
    name: "create-quiz",
    component: () => import("../views/Quizz/CreateQuizzes.vue"),
    meta: {
      requiresAuth: true,
      requiresVer: true,
      teacherOnly: true,
    },
  },
  {
    path: "/quiz/:quizId",
    name: "quiz",
    props: true,
    component: () => import("../views/Quizz/QuizView.vue"),
    meta: {
      requiresAuth: true,
      requiresVer: true,
    },
  },
  {
    path: "/create-course",
    name: "createCourse",
    component: () => import("../views/Courses/CreateCourseView.vue"),
    meta: {
      requiresAuth: true,
      requiresVer: true,
      teacherOnly: true,
    },
  },
  {
    path: "/register-course",
    name: "register-course",
    component: () => import("../views/Courses/RegisterCourseView.vue"),
    meta: {
      requiresAuth: true,
      requiresVer: true,
    },
  },
  {
    path: "/my-profile",
    name: "Profile",
    component: () => import("../views/User/ProfileView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/edit-profile",
    name: "EditProfile",
    component: () => import("../views/User/EditProfile.vue"),
    meta: {
      requiresAuth: true,
      requiresVer: true,
    },
  },
  {
    path: "/student-dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard/StudentDashboard.vue"),
    meta: {
      requiresAuth: true,
      requiresVer: true,
    },
  },
  {
    path: "/teacher-dashboard",
    name: "TeacherDashboard",
    component: () => import("../views/Dashboard/TeacherDashboard.vue"),
    meta: {
      requiresAuth: true,
      requiresVer: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Auth/RegisterView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Auth/LoginView.vue"),
  },
  {
    path: "/forgot-password",
    name: "Reset Pass",
    component: () => import("../views/Auth/ResetPass.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
    if (auth.currentUser && !store.state.user) {
    next("/register");
    return;
  }
  if (to.path === "/login" && auth.currentUser) {
    router.push(store.state.user.role == 'Student' ? '/student-dashboard':'/teacher-dashboard');
    return;
  }
  if (to.path === "/" && auth.currentUser) {
    router.push(store.state.user.role == 'Student' ? '/student-dashboard':'/teacher-dashboard');
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
  if (
    to.matched.some((record) => record.meta.teacherOnly) &&
    store.state.user.role == "Student"
  ) {
    next("/my-profile");
    return;
  }
  next()
});
export default router;
