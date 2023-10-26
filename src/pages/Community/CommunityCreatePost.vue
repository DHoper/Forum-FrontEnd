<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import CreatePostPreview from './CreatePostPreview.vue';
import { createPost } from '../../api/community';
import { useUserStore } from '../../store/user';
import { CommunityPostType, PhotoPostImageType } from '../../types';
import axios from 'axios';
import { useLoadingStore } from '../../store/loading';
import { FieldName, inputValidator } from '../../utils/validator';

const router = useRouter();
const userStore = useUserStore();
const loadingStore = useLoadingStore();

const topicTags = {
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
const imgInput = ref<HTMLInputElement>();

const setFileUrl = () => {
    if (imgInput.value && imgInput.value.files) {
        const selectedFiles = Array.from(imgInput.value.files);
        const urls = selectedFiles.map(file => URL.createObjectURL(file));
        for (const url of urls) {
            formData.value.images.push({ url, filename: 'previewFile' })
        }

    }
}

const formData = ref({
    title: '',
    images: [] as PhotoPostImageType[],
    content: '',
    views: 0,
    likes: 0,
    authorId: userStore.getId()!,
    topicTags: [] as string[],
    commentsId: [],
    isEdit: false
});
const submitData = ref<CommunityPostType>();

const isMaxSelected = computed(() => { //限制tag最多選五
    return formData.value.topicTags.length >= 5;
})
const inPreview = ref<boolean>(false);

const validator = (fieldname: FieldName) => {
    inputValidator().validate(fieldname, formData.value);
}

const cloudName = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
let createPostImages: PhotoPostImageType[] = [];//儲存最終提交之圖片url
const uploadImages = async () => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const inputElement = imgInput.value;

    if (inputElement) {
        const files = inputElement.files as FileList;
        const uploadPromises = [];


        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(file);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "Community_preset");

            const uploadPromise = axios.post(url, formData)
                .then(response => createPostImages.push({
                    url: response.data.secure_url,
                    filename: response.data.public_id
                }))
                .catch(error => {
                    console.error("圖片上傳失敗", error);
                    return null;
                });

            uploadPromises.push(uploadPromise);
        }
        await Promise.all(uploadPromises);
    }
};

const handelSubmit = async () => {
    loadingStore.setLoadingStatus(true);
    loadingStore.setInRequest(true);
    loadingStore.setIsCountingSeconds(true);
    loadingStore.setIsCountingSeconds(false);
    await uploadImages();
    const {
        title,
        content,
        views,
        likes,
        topicTags,
        authorId,
        commentsId,
        isEdit
    } = formData.value;

    submitData.value = {
        title,
        images: createPostImages,
        content,
        views,
        likes,
        topicTags,
        authorId,
        commentsId,
        isEdit,
    };
    await createPost(submitData.value);
    loadingStore.setInRequest(false);
    loadingStore.setLoadingStatus(false);
    router.push({ name: 'Community' });
};
</script>


<template>
    <div class="relative">
        <div class="bg-white w-full py-12 px-4">
            <div class="mx-auto flex flex-col bg-white w-[62rem] px-5">
                <button @click="router.back()" class="self-start text-sm font-bold text-stone-800">上一頁</button>
                <div class="mt-12 border-2 border-stone-800 px-24 py-16">
                    <h1 class="my-8 text-4xl text-stone-600">發佈新貼文</h1>
                    <form class="mt-4 flex flex-col gap-4">
                        <div>
                            <label for="title" class="text-stone-600 font-bold text-sm">標題</label>
                            <input v-model="formData.title" type="text" id="title" name="title" placeholder="5 ~ 20字"
                                @blur="validator('title')"
                                class="mt-2 w-full border-2 border-stone-800 py-2 px-3 outline-none" required>
                        </div>
                        <div>
                            <label for="img" class="text-stone-600 font-bold text-sm">圖片(可選)</label>
                            <div class="flex items-center mt-4  ">
                                <label for="imgUpload"
                                    class="border-2 border-stone-500 bg-stone-500 text-white hover:bg-white hover:text-stone-500 font-bold py-2 px-4 cursor-pointer text-sm">
                                    選擇檔案
                                </label>
                                <input ref="imgInput" id="imgUpload" name="imgUpload" type="file" class="hidden"
                                    @change="setFileUrl" multiple>
                            </div>
                        </div>
                        <div>
                            <label for="img" class="text-stone-600 font-bold text-sm">貼文主題(最多五項)</label>
                            <div class="mt-4 border-2 border-stone-700 p-2 overflow-auto max-h-48">
                                <div class="flex gap-2 items-center justify-center flex-wrap" v-for="topic in topicTags">
                                    <div class="mt-4 flex flex-wrap gap-2 justify-center">
                                        <label v-for="tag in topic.tags" :key="tag"
                                            class="border-2 border-stone-700 px-2 py-1"
                                            :style="formData.topicTags.includes(tag) ? `background-color:${topic.color};color:white` : ''">
                                            <input type="checkbox" v-model="formData.topicTags" :value="tag" class="hidden"
                                                :disabled="isMaxSelected && !formData.topicTags.includes(tag)">
                                            <span class="cursor-pointer">{{ tag }}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label for="content" class="text-stone-600 font-bold text-sm">貼文内容</label>
                            <textarea v-model="formData.content" id="content" name="content" cols="20" rows="10"
                                placeholder="20 ~ 400字"
                                @blur="validator('content')"
                                class="mt-2 w-full border-2 border-stone-800 py-2 px-3 outline-none resize-none"
                                required></textarea>
                        </div>
                        <div class="flex justify-between">
                            <button @click="inPreview = true" type="button" class="text-white bg-blue-900 px-8 py-2">
                                預覽
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <transition name="previewPost" enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-300" leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1">
            <CreatePostPreview v-if="inPreview" :data="formData" @close="inPreview = false" @submit="handelSubmit" />
        </transition>
    </div>
</template>
