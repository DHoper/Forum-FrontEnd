<script setup lang="ts">
import { ref } from 'vue';

const photoPosts = ref([
  {
    _id: '1',
    title: '照片牆貼文 1',
    description: '这是一篇照片牆貼文的描述。',
  },
  {
    _id: '2',
    title: '照片牆貼文 2',
    description: '这是另一篇照片牆貼文的描述。',
  },
]);

const communityPosts = ref([
  {
    _id: '1',
    title: '社區貼文 1',
    content: '这是一篇社區貼文的内容。',
  },
  {
    _id: '2',
    title: '社區貼文 2',
    content: '这是另一篇社區貼文的内容。',
  },
]);

const activeTab = ref('photoPosts');
</script>


<template>
  <div class="flex-1 bg-gray-100 p-4">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl mb-4">貼文紀錄</h1>

      <!-- 選項卡 -->
      <div class="flex space-x-4">
        <button
          @click="activeTab = 'photoPosts'"
          :class="{'bg-blue-500 text-white': activeTab === 'photoPosts', 'bg-gray-300': activeTab !== 'photoPosts'}"
          class="py-2 px-4 rounded-sm cursor-pointer"
        >
          照片牆貼文
        </button>
        <button
          @click="activeTab = 'communityPosts'"
          :class="{'bg-blue-500 text-white': activeTab === 'communityPosts', 'bg-gray-300': activeTab !== 'communityPosts'}"
          class="py-2 px-4 rounded-sm cursor-pointer"
        >
          社區貼文
        </button>
      </div>

      <!-- 照片牆 -->
      <div v-if="activeTab === 'photoPosts'">
        <div v-for="post in photoPosts" :key="post._id" class="bg-white p-4 shadow mb-4">
          <h2 class="text-lg">{{ post.title }}</h2>
          <p>{{ post.description }}</p>
        </div>
      </div>

      <!-- 社區 -->
      <div v-if="activeTab === 'communityPosts'">
        <div v-for="post in communityPosts" :key="post._id" class="bg-white p-4 shadow mb-4">
          <h2 class="text-lg">{{ post.title }}</h2>
          <p>{{ post.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
