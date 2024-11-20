// import Vue from "vue";
// import Router from "vue-router";
// import HomePage from "@/views/HomePage";
// import Register from "@/views/Register";
// import Login from "@/views/Login";
// import MessagesPage from "@/views/MessagesPage";
// import Profile from "@/views/Profile";
// import Information from "@/views/Information";
// import NProgress from "nprogress";
// import "nprogress/nprogress.css";
// Vue.use(Router);

// const routes = [
//   {
//     path: "/home",
//     name: "Home",
//     component: HomePage,
//     props: true
//   },
//   {
//     path: "/register",
//     name: "Register",
//     component: Register
//   },
//   {
//     path: "/information/:id",
//     name: "Information",
//     component: Information
//   },
//   { path: "/", name: "Login", component: Login },
//   { path: "/messages", name: "Messages", component: MessagesPage },
//   {
//     path: "/profile",
//     name: "Profile",
//     component: Profile,
//     children: [{ path: ":idother", name: "ProfileOther", component: Profile }]
//   }
// ];

// routes.beforeEach((to, from, next) => {
//   NProgress.start();
//   next();
// });

// // Kết thúc NProgress khi trang tải xong
// routes.afterEach(() => {
//   NProgress.done();
// });

// export default new Router({
//   routes
// });

import Vue from "vue";
import Router from "vue-router";
import HomePage from "@/views/HomePage";
import Register from "@/views/Register";
import Login from "@/views/Login";
import MessagesPage from "@/views/MessagesPage";
import Profile from "@/views/Profile";
import Information from "@/views/Information";
import EditProfile from "@/views/EditProfile.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(Router);

const routes = [
  {
    path: "/home",
    name: "Home",
    component: HomePage,
    props: true
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/information/:id",
    name: "Information",
    component: Information
  },
  { path: "/", name: "Login", component: Login },
  { path: "/messages", name: "Messages", component: MessagesPage },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    children: [{ path: ":idother", name: "ProfileOther", component: Profile }]
  },
  { path: "/edit", name: "EditProfile", component: EditProfile }
];

const router = new Router({
  mode: "history",
  routes
});

// Bắt đầu NProgress khi chuyển trang
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

// Kết thúc NProgress khi trang tải xong
router.afterEach(() => {
  NProgress.done();
});

export default router;
