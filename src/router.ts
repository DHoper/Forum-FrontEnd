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
      children: [
        {
          path: "",
          name: "Gallery",
          component: Gallery,
        },
        {
          path: "createPost",
          name: "CreatePost",
          component: () => import("./pages/Gallery/CreatePost.vue"),
        },
      ],
    },
    {
      path: "/community",
      component: Community,
      name: "Community",
    },
    {
      path: "/user",
      children: [
        {
          path: "personalInfo",
          name: "PersonalInfo",
          component: () => import("./pages/User/PersonalInfo.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "personalPost",
          name: "PersonalPost",
          component: () => import("./pages/User/PersonalPost.vue"),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: "/error",
      component: () => import("./components/utils/Error.vue"),
      name: "Error",
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("./components/utils/NotFound.vue"),
      name: "NotFound",
    },
  ],
});
export default router;

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !userStore.isLogin) {
    next({ name: "Login" });
  }
  useLoadingStore().setLoadingStatus(true);
  useLoadingStore().setIsCountingSeconds(true);
  next();
});

router.afterEach(() => {
  useLoadingStore().setIsCountingSeconds(false);
});
