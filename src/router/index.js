import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { auth } from "../firebase";

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
    path: "/test",
    name: "test",
    component: () => import("../views/Testing/TestingView.vue"),
    meta: {
      requiresAuth: true,
    },
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
    path: "/quizzes",
    name: "quiz",
    component: () => import("../views/Quizz/CreateQuizzes.vue"),
    meta: {
      requiresAuth: true,
      requiresVer: true,
    },
  },
  // {
  //   path: "/Courses/:courseName/Tools/:toolName",
  //   name: "courses",
  //   component: () => import("../views/Courses/CourseView.vue"),
  //   props: true,
  //   meta: {
  //     requiresAuth: true,
  //   },
  // },
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
