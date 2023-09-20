import { createRouter, createWebHistory } from "vue-router";

import Home from "./pages/Home.vue";
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";
import Articles from "./pages/Articles.vue";
import Explore from "./pages/Explore.vue";
import Gallery from "./pages/Gallery.vue";
import User from "./pages/User.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    { path: "/home", component: Home, name: "Home" },
    {
      path: "/explore",
      component: Explore,
      name: "Explore",
    },
    {
      path: "/login",
      component: Login,
      name: "Login",
    },
    {
      path: "/register",
      component: Register,
      name: "Register",
    },
    {
      path: "/articles",
      children: [
        {
          path: "",
          name: "Articles",
          component: Articles,
        },
        {
          path: ":id",
          name: "Article",
          component: () => import("./pages/Articles/Article.vue"),
        },
      ],
    },
    {
      path: "/gallery",
      component: Gallery,
      name: "Gallery",
    },
  ],
});
export default router;
