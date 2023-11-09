<script setup lang="ts">
import Loading from "./components/utils/Loading.vue";
import TheHeader from "./components/layout/TheHeader.vue";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const showHeader = computed(() => {
  return !["Error", "NotFound", "Login", "Register", "Home"].includes(
    route.name as string
  );
});
const headerKey = ref();

watch(
  () => route.name,
  () => {
    headerKey.value = route.name;
  }
);

//--偷偷追蹤訪客次數
const port = import.meta.env.VITE_APP_API_URL;
if (port != "http://localhost:3000/api") {
  const hasVisited = localStorage.getItem("hasVisited");
  if (!hasVisited) {
    axios
      .post(port + "/visitorCount", {})
      .then(() => {
        localStorage.setItem("hasVisited", "true");
      })
      .catch((error) => {
        console.error("訪客數據更新時發生錯誤:：", error);
      });
  }
}
</script>

<template>
  <Loading />
  <div class="h-screen flex flex-col">
    <TheHeader :key="headerKey" v-if="showHeader" />
    <router-view></router-view>
  </div>
</template>
