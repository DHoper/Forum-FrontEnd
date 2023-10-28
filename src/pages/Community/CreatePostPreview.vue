<script setup lang="ts">
import { PropType, onMounted, ref, watch } from 'vue';
import {
    EyeIcon,
    ChatBubbleBottomCenterIcon,
} from '@heroicons/vue/24/outline';

import {
    HeartIcon
} from '@heroicons/vue/24/solid';
import { getTimeDifference, formatDateTime } from '../../utils/formattingUtils';
import { AuthorDataType, CommunityPostType, DialogType } from '../../types';
import { getAuthor } from '../../api/user/user.js';

const props = defineProps({
    data: Object as PropType<CommunityPostType>,
});
const emit = defineEmits(["close", "submit"]);

const topicTags: {
    [key: string]: {
        color: string;
        tags: string[];
    };
} = {
    ecology: {
        color: "#A89376",
        tags: [
            "生態系",
            "水生生物",
            "魚類",
            "陸生動物",
            "節肢動物",
            "兩棲動物",
            "植物",
            "瀕危物種",
            "危險動物",
            "鳥類",
        ],
    },
    knowledge: {
        color: "#875B4A",
        tags: [
            "動物行為",
            "遷徒",
            "奇特行為",
            "攝影技巧",
        ],
    },
    geographicalFeatures: {
        color: "#B7AFA6",
        tags: [
            "野生動物保護區",
            "海洋",
            "溪河湖泊",
            "山林",
            "森林",
            "草原",
            "雪地",
            "沙漠",
            "海島",
            "沼澤",
        ],
    },
    style: {
        color: "#566E3D",
        tags: [
            "自然風景",
            "夜間攝影",
            "微距攝影",
            "野外探險",
            "地理風貌",
        ],
    },
    issue: {
        color: "#22577A",
        tags: [
            "環境保育",
            "全球生態",
            "嚴重議題",
        ],
    },
    geolocation: {
        color: "#F4B860",
        tags: [
            "非洲",
            "亞洲",
            "南美洲",
            "北美洲",
            "歐洲",
            "澳大利亞",
            "南極洲",
        ],
    },
};
const setTagColor = (tag: string) => {
    for (const topic in topicTags) {
        if (topicTags[topic].tags.includes(tag)) {
            return topicTags[topic].color;
        }
    }
}

const formData = ref();
const authorData = ref<AuthorDataType>();

const showDialog = ref(false);
const dialogData = ref<DialogType>({
    title: "是否確認提交",
    content: "按下確認後即建立貼文",
    cancelButton: true,
});

////彈窗框邏輯
const userChoice = ref<boolean>();

const handleDialog = async () => {
    showDialog.value = true;
    const dialogPromise = new Promise((resolve) => {
        watch(userChoice, () => {
            showDialog.value = false;
            resolve(userChoice.value);
        });
    });
    return dialogPromise;
};

async function handleSubmit() {

    const choice = await handleDialog();

    if (choice) {
        emit("submit");
    }

    userChoice.value = undefined;
}

onMounted(async () => {
    formData.value = props.data;
    const responseData = await getAuthor(formData.value.authorId);
    authorData.value = responseData.value;
    formData.value.createdAt = new Date().toISOString();
})
</script>

<template>
    <div v-if="formData && authorData"
        class="fixed top-0 w-screen h-full overflow-auto border-4 py-12 px-4 z-50 bg-white flex flex-col items-center justify-center gap-10 xl:gap-16">
        <div class="mt-12 mx-auto border-2 border-stone-800 w-2/3 min-w-[62rem] max-w-full px-24 py-16">
            <div class="flex items-center gap-4">
                <div
                    class="border border-stone-800 rounded-full bg-white w-14 h-14 xl:w-16 xl:h-16 p-1 flex items-center justify-center overflow-hidden">
                    <img :src="`/assets/img/avatar (${authorData.selectedAvatarIndex}).png`" alt="avatar">
                </div>
                <div class="flex gap-2 items-baseline justify-start flex-1">
                    <span class="text-lg xl:text-xl text-stone-700 font-bold">{{ authorData.username }}</span>
                    <span class="font-bold text-sm xl:text-base text-stone-500">{{ formatDateTime(formData.createdAt) }}
                        <span class="text-md italic">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                        {{ getTimeDifference(formData.createdAt) }} 以前
                    </span>
                </div>
            </div>
            <h1 class="my-4 text-2xl xl:text-3xl text-stone-900 font-bold">{{ formData.title }}</h1>
            <div class="flex gap-2 flex-wrap">
                <span v-for="tag in formData.topicTags" class="px-2 py-1 text-stone-100 rounded-sm"
                    :style="`background-color:${setTagColor(tag)}`">
                    {{ tag }}
                </span>
            </div>
            <div v-if="formData.images && formData.images.length > 0" class="mt-20  flex flex-col gap-4">
                <img :src="formData.images[0].url" class="border-2 border-stone-700" />
            </div>
            <p class="mt-10 text-stone-700 xl:text-lg whitespace-pre-wrap">{{ formData.content }}</p>
            <div v-if="formData.images && formData.images.length > 0" class="mt-4 flex flex-col gap-4">
                <div v-for="image, index in formData.images">
                    <img :key="index" v-if="index !== 0" :src="image.url" class="border-2 border-stone-700" />
                </div>
            </div>
            <div class="border-b-2 border-gray-300 my-4 mt-16"></div>
            <div class="flex justify-between">
                <div class="flex gap-8">
                    <span class="flex items-center gap-1 xl:text-xl">
                        <EyeIcon class="w-4 xl:w-6" />0
                    </span>
                    <span class="flex items-center gap-1 xl:text-xl">
                        <ChatBubbleBottomCenterIcon class="w-4 xl:w-6" />0
                    </span>
                </div>
                <span
                    class="group flex items-center gap-1 xl:text-xl hover:cursor-pointer focus:text-red-500 transition-all"
                    tabindex="0">
                    <HeartIcon class="w-4 xl:w-6 group-focus:scale-[125%] transition-all duration-300" />0
                </span>
            </div>
        </div>
        <div class="flex gap-16 text-xl">
            <button @click="handleSubmit"
                class="text-white bg-green-600 px-6 py-2 border-2 border-transparent hover:border-green-600 hover:bg-white hover:text-green-600 transition-all duration-300">
                發佈
            </button>
            <button @click="emit('close')"
                class="text-white bg-stone-600 px-6 py-2 border-2 border-transparent hover:border-stone-700 hover:bg-white hover:text-stone-700 transition-all duration-300">
                返回
            </button>
        </div>
        <Dialog v-if="showDialog" :dialogData="dialogData" @closePopup="(choice: boolean) => userChoice = choice" />
    </div>
</template>../../api/user/user