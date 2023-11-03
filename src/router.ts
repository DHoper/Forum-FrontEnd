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
import PhotoPost from "./pages/Gallery/PhotoPost.vue";
import CommunityPost from "./pages/Community/CommunityPost.vue";

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
      beforeEnter: (to, from, next) => {
        if (to || from) {
          //--問題--build問題 待解決
        }
        const userStore = useUserStore(); //無法在global scope中/Pinia被掛載前使用
        if (userStore.isLogin) {
          next({ name: "Articles" });
        } else {
          next();
        }
      },
    },
    {
      path: "/register",
      component: Register,
      name: "Register",
      beforeEnter: (to, from, next) => {
        if (to || from) {
        }
        const userStore = useUserStore();
        if (userStore.isLogin) {
          next({ name: "Articles" });
        } else {
          next();
        }
      },
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
        {
          path: "photoPost/:id",
          name: "PhotoPost",
          component: PhotoPost,
          props: true,
        },
        {
          path: "photoPost/edit/:id",
          name: "EditPhotoPost",
          component: () => import("./pages/Gallery/EditPost.vue"),
          props: true,
        },
      ],
    },
    {
      path: "/community",
      children: [
        {
          component: Community,
          path: "",
          name: "Community",
          meta: { requiresAuth: true },
        },
        {
          path: "post/:id",
          name: "CommunityPost",
          component: CommunityPost,
          meta: { requiresAuth: true },
          props: true,
        },
        {
          path: "createPost",
          name: "CommunityCreatePost",
          component: () => import("./pages/Community/CommunityCreatePost.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "editPost/:id",
          name: "EditCommunityPost",
          component: () => import("./pages/Community/EditPost.vue"),
          props: true,
        },
        {
          path: "createPostPreview",
          name: "CreatePostPreview",
          component: () => import("./pages/Community/CreatePostPreview.vue"),
          props: true,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: "/user",
      children: [
        {
          path: "personalInfo/:email",
          name: "PersonalInfo",
          component: () => import("./pages/User/PersonalInfo.vue"),
          props: true,
          meta: { requiresAuth: true },
        },
        {
          path: "personalPosts",
          name: "PersonalPosts",
          component: () => import("./pages/User/PersonalPosts.vue"),
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

router.beforeEach((to, from, next) => {
  if (from) {
    const userStore = useUserStore();
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    if (requiresAuth && !userStore.isLogin) {
      next({ name: "Login" });
    }
    useLoadingStore().setLoadingStatus(true);
    useLoadingStore().setIsCountingSeconds(true);
    next();
  }
});

router.afterEach(() => {
  useLoadingStore().setIsCountingSeconds(false);
});

export default router;
