<script setup lang="ts">
import Loading from './components/utils/Loading.vue';
import TheHeader from './components/layout/TheHeader.vue';
</script>

<template>
   <Loading />
   <div class="h-screen flex flex-col">
      <TheHeader v-if="$route.path != '/login' && $route.path !='/register'" />
      <router-view></router-view>
   </div>
</template>