import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "./store/user.ts";
import { useLoadingStore } from "./store/loading.ts";

import Home from "./pages/Home.vue";
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";
import Help from "./pages/Help.vue";
import Articles from "./pages/Articles.vue";
import Explore from "./pages/Explore.vue";
import Gallery from "./pages/Gallery.vue";
import Community from "./pages/Community.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    { path: "/home", component: Home, name: "Home" },
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
      path: "/help",
      component: Help,
      name: "Help",
    },
    {
      path: "/explore",
      component: Explore,
      name: "Explore",
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
    {
      path: "/community",
      component: Community,
      name: "Community",
    },
  ],
});
export default router;

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (userStore.userData) {
    userStore.isLogin = true;
  }

  useLoadingStore().setLoadingStatus(true);
  useLoadingStore().setIsCountingSeconds(true);
  next();
});

router.afterEach(() => {
  useLoadingStore().setIsCountingSeconds(false);
});
