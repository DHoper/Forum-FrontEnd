<script setup lang="ts">
import { ref } from 'vue';
import TheHeader from '../components/layout/TheHeader.vue';
import fakeData from './Community/fakeData.json';
const postData = ref(fakeData)
</script>

<template>
    <div class="">
    <TheHeader :is-login="false" />
    </div>
</template>