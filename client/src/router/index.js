import Vue from "vue";
import Router from "vue-router";
import HomePage from "@/views/HomePage";
import Register from "@/views/Register";
import Login from "@/views/Login";
import MessagesPage from "@/views/MessagesPage";
import Profile from "@/views/Profile";
import Information from "@/views/Information";

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
  }
];

export default new Router({
  routes
});
