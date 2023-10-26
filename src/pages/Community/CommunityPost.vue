<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router'
import {
    EyeIcon,
    ChatBubbleBottomCenterIcon,
} from '@heroicons/vue/24/outline';

import {
    HeartIcon
} from '@heroicons/vue/24/solid';
import { getTimeDifference } from '../../utils/formattingUtils';


const router = useRouter()
const communityPost = {
    title: '社区文章标题3',
    subtitle: '社区文章副标题3',
    img: 'https://images.unsplash.com/photo-1503066211613-c17ebc9daef0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    content: '这是社区文章的内容3。Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras eu sagittis orci. Integer non ipsum ut eros laoreet sollicitudin. Quisque euismod urna vel magna tincidunt vestibulum.',
    likes: 20,
    views: 150,
    comments: [
        {
            user: 'DODO',
            content: '我很高興看到有人在拯救老虎！',
            createdAt: '2023-09-02 14:30:00',
        },
        {
            user: 'DODO',
            content: 'ㄚㄚㄚㄚㄚ阿！',
            createdAt: '2023-09-02 14:30:00',
        },
        {
            user: 'DODO',
            content: '吃葡萄不吃葡萄不吃葡萄敖土淘淘！',
            createdAt: '2023-09-02 14:30:00',
        }],
    _id: 14,
    createdAt: '2023-09-02 14:30:00',
    isEdit: false,
}


const comment = ref('');
const commentSubmit = ref();

watchEffect(() => {
    if (commentSubmit.value) {
        const trimmedComment = comment.value.trim();

        if (trimmedComment) {
            commentSubmit.value.classList.toggle('bg-green-600', true);
            commentSubmit.value.classList.toggle('bg-gray-300', false);
        } else {
            commentSubmit.value.classList.toggle('bg-green-600', false);
            commentSubmit.value.classList.toggle('bg-gray-300', true);
        }
    }
});

</script>

<template>
    <div class="bg-communityPosts bg-no-repeat bg-cover bg-center w-full bg-fixed">
        <div class="bg-white w-full py-12 px-4">
            <div class="mx-auto flex flex-col bg-white w-[62rem] translate-y-[-7rem] pt-28 px-5">
                <button @click="router.back()" class="self-start text-sm font-bold text-stone-800">上一頁</button>
                <div class="mt-12 border border-stone-800 px-24 py-16">
                    <span class="font-bold text-sm text-stone-500">{{ communityPost.createdAt }}
                        <span class="text-md">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                        {{ getTimeDifference(communityPost.createdAt) }} 以前
                    </span>
                    <h1 class="my-8 text-4xl text-stone-600">{{ communityPost.title }}</h1>
                    <p class="font-bold italic text-sm text-stone-900">{{ communityPost.subtitle }}</p>
                    <div class="mt-4 max-h-[32.5rem] overflow-hidden">
                        <img :src="communityPost.img" class="w-full filter grayscale-[10%]">
                    </div>
                    <p  class="text-stone-800 mt-6">{{ communityPost.content }}</p>
                    <div class="border-b-[.0938rem] border-gray-300 my-4"></div>
                    <div class="flex justify-between">
                        <div class="flex gap-8"> <span class="flex gap-1">
                                <EyeIcon class="w-4" />{{ communityPost.views }}
                            </span>
                            <span class="flex gap-1">
                                <ChatBubbleBottomCenterIcon class="w-4" />{{ communityPost.comments.length }}
                            </span>
                        </div>
                        <span class="group flex gap-1 hover:cursor-pointer focus:text-red-500 transition-all" tabindex="0">
                            <HeartIcon class="w-4  group-focus:scale-[125%] transition-all duration-300" />{{
                                communityPost.likes }}
                        </span>
                    </div>
                </div>
                <div class="mt-12 border border-stone-800 px-24 py-16">
                    <span class="font-bold text-stone-500 tracking-widest">留言區</span>
                    <div class="border-b-[.0938rem] border-gray-300 my-4"></div>
                    <div class="">
                        <div class="my-12 border border-stone-600 p-6">
                            <textarea v-model="comment" name="" id="" cols="20" rows="3" placeholder="輸入留言..."
                                class="w-full border-none outline-none resize-none bg-transparent p-0 m-0 text-current"></textarea>
                        </div>
                        <div class="flex justify-end gap-2">
                            <button class="text-green-400 px-5 py-2 hover:text-green-600">取消</button>
                            <button ref="commentSubmit" class="text-white bg-gray-300 px-5 py-2">送出</button>
                        </div>
                    </div>
                    <div v-for="comment in communityPost.comments">
                        <div class="flex items-center gap-2">
                            <div class="rounded-full bg-white w-12 h-12 p-1 flex items-center justify-center">
                                <img class="border border-black rounded-full" src="/public/assets/img/deerIcon.png"
                                    alt="avatar">
                            </div>
                            <div class="flex flex-col gap-0">
                                <span class=" text-black leading-4">{{ comment.user }}</span>
                                <span class="text-xs text-stone-500">{{ getTimeDifference(comment.createdAt) }} 以前</span>
                            </div>
                        </div>
                        <div class="px-14">
                            <p class="mt-4">{{ comment.content }}</p>
                            <div class="border-b-[.0938rem] border-gray-300 my-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
