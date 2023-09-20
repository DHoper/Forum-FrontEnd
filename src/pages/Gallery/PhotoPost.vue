<script setup lang="ts">
import { getLevelTwoData } from '../../api/gallery.ts';
import { ref, toRefs, onMounted, watchEffect } from 'vue';
import {
    XCircleIcon,
    EyeIcon,
} from '@heroicons/vue/24/outline';
import {
    HeartIcon,
} from '@heroicons/vue/24/solid'
import { getTimeDifference } from '../../utils/formattingUtils';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    photoPostShow: {
        type: Boolean,
        required: true,
    }
});

const emit = defineEmits(['click']);

const leftBlock = ref<HTMLElement | null>(null);
const rightBlock = ref<HTMLElement | null>(null);

function close() {
    leftBlock.value?.classList.add('animate-slideInLeftBack');
    rightBlock.value?.classList.add('animate-slideInRightBack');
    leftBlock.value?.addEventListener('animationend', () => { emit('click') });
    rightBlock.value?.addEventListener('animationend', () => { emit('click') });
}

const comments = [
    {
        user: 'DODO',
        content: '我很高興看到有人在拯救老虎！',
        postDate: '2023-09-02 14:30',
    },
    {
        user: 'DODO',
        content: 'ㄚㄚㄚㄚㄚ阿！',
        postDate: '2023-09-02 14:30',
    },
    {
        user: 'DODO',
        content: '吃葡萄不吃葡萄不吃葡萄敖土淘淘！',
        postDate: '2023-09-02 14:30',
    },]


const { id, photoPostShow } = toRefs(props);
const photoPost = ref();
const fetchData = async () => {
    const responseData = await getLevelTwoData('/gallery', `/${id.value}`);
    photoPost.value = responseData;
};

onMounted(async () => {
    await fetchData();
})

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
    <div v-if="photoPost" class="z-10 flex absolute top-0 left-0 w-full h-full">
        <div ref="leftBlock" v-if="photoPostShow"
            class="animate-slideInLeft basis-[30%] border border-stone-800 bg-white py-10 px-8 overflow-auto">
            <span class="font-bold text-stone-500 tracking-widest">留言區</span>
            <div class="border-b-[.0938rem] border-gray-300 my-4"></div>
            <div>
                <div class="mt-10 mb-4 border border-stone-600 p-6">
                    <textarea v-model="comment" name="" id="" cols="20" rows="2" placeholder="輸入留言..."
                        class="w-full border-none outline-none resize-none bg-transparent p-0 m-0 text-current"></textarea>
                </div>
                <div class="flex justify-end gap-2">
                    <button class="text-green-400 px-5 py-2 hover:text-green-600">取消</button>
                    <button ref="commentSubmit" class="text-white bg-gray-300 px-5 py-2">送出</button>
                </div>
            </div>
            <ul class="mt-16">
                <li v-for="comment in comments">
                    <div class="flex items-center gap-4">
                        <div
                            class="border border-stone-900 rounded-full bg-white w-10 h-10 p-1 flex items-center justify-center">
                            <img class="rounded-full" src="/public/assets/img/deerIcon.png" alt="avatar">
                        </div>
                        <div class="flex gap-2 items-center">
                            <span class=" text-sm text-stone-700 font-bold">{{ comment.user }}</span>
                            <span class="text-xs text-stone-500">{{ comment.postDate }}</span>
                            <span class="text-xs text-stone-500">{{ getTimeDifference(comment.postDate) }} 以前</span>
                        </div>
                    </div>
                    <div class="pl-14">
                        <p class="mt-4 text-sm text-stone-700">{{ comment.content }}</p>
                    </div>
                    <div class="border-b-[.0938rem] border-gray-300 my-4"></div>
                </li>
            </ul>
        </div>
        <div ref="rightBlock"
            class="animate-slideInRight basis-[70%] flex flex-col w-full bg-[#484538] pt-12 px-20 h-full overflow-auto">
            <div class="bg-white p-8 pb-2 rounded-sm flex flex-col gap-2">
                <div class="flex gap-4">
                    <div class="relative basis-2/3 -mt-2 -ml-2 p-4">
                        <div class="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-stone-600 rounded-sm">
                        </div>
                        <img :src="photoPost.image[0].url" :alt="photoPost.image[0].filename"
                            class="rounded-sm relative z-10 shadow-md shadow-slate-700">
                    </div>
                    <div class="flex-1 pt-4 flex flex-col items-center text-stone-700  border-b-4 border-stone-600">
                        <h2 class="text-2xl font-bold text-center">{{ photoPost.title }}</h2>
                        <p class="text-sm text-center text-stone-500 py-2">{{ photoPost.location }}</p>
                        <p class=" w-full p-4 flex-grow italic text-center flex justify-center items-center">
                            {{ photoPost.description }}</p>
                    </div>
                </div>
                <div class="basis-full flex gap-4 justify-between italic ">
                    <div class="flex items-center gap-2">
                        <div
                            class="border border-stone-900 rounded-full bg-white w-8 h-8 p-1 flex items-center justify-center">
                            <img class="rounded-full" src="/public/assets/img/deerIcon.png" alt="avatar">
                        </div>
                        <p class="font-bold text-stone-700">DoDoLu</p>
                    </div>
                    <p class=" text-stone-500 my-2">{{ photoPost.date }}</p>
                    <div class="flex items-center gap-4">
                        <span class="flex items-center gap-1 text-stone-700">
                            <EyeIcon class="w-6" />
                            <span>{{ 543 }}</span>
                        </span>
                        <span class="flex items-center gap-1 text-stone-700 group">
                            <HeartIcon
                                class="w-6 cursor-pointer group-hover:scale-105 transition-all duration-500 group-hover:text-red-500" />
                            <span class="group-hover:text-red-500">{{ 398 }}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex-grow">
                <XCircleIcon @click="close" class="w-12 cursor-pointer  text-white mx-auto py-4 hover:scale-105 transition-all ease-in" />
            </div>
        </div>
    </div>
</template>