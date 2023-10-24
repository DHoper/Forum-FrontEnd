<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import MapBoxGeoCoder from '@mapbox/mapbox-gl-geocoder';
import MapBoxLanguage from '@mapbox/mapbox-gl-language';
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-geocoder/lib/mapbox-gl-geocoder.css';
import {
    EyeIcon,
    XCircleIcon,
} from '@heroicons/vue/24/outline';


//----cloudinary&圖片預覽----
const cloudName = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
// const uploadPreset = import.meta.env.VITE_APP_CLOUDINARY_KEY;
// const apiSecret = import.meta.env.VITE_APP_CLOUDINARY_SECRET;

const previewImg = ref<number>(0); //紀錄所選預覽大圖

const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
const imgInput = ref(null);

const previewUrls = ref<string[]>([]);
const showPreview = ref<boolean>(false);

const previewImages = () => {
    previewImg.value = 0;
    const inputElement = imgInput.value as unknown as HTMLInputElement;
    if (inputElement.files) {
        const selectedFiles = Array.from(inputElement.files);
        const urls = selectedFiles.map(file => URL.createObjectURL(file));
        previewUrls.value = urls;
    }
};

const userImages = ref();
const uploadImages = async (e: Event) => {
    const inputElement = imgInput.value as unknown as HTMLInputElement;

    if (inputElement) {
        const files = inputElement.files as FileList;
        const uploadPromises = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "Animals_preset");

            const uploadPromise = axios.post(url, formData)
                .then(response => response.data.secure_url)
                .catch(error => {
                    console.error("Error uploading image:", error);
                    return null;
                });

            uploadPromises.push(uploadPromise);
        }

        const uploadedImages = await Promise.all(uploadPromises);

        // 处理上传完成后的图片 URL
        console.log(uploadedImages);

        // 你可以在这里进行其他处理，比如将 URL 传递给另外的处理函数
    }
};


//----mapbox地圖----
mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_TOKEN;

const mapContainer = ref<HTMLElement | null>(null);
const geoResult = ref<string>();


onMounted(async () => {
    const map = new mapboxgl.Map({
        container: mapContainer.value!,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [120.93874358912397, 23.92239934359359],
        zoom: 9
    });

    const language = new MapBoxLanguage({ defaultLanguage: 'zh-Hant' });
    map.addControl(language);

    const geoCoder = new MapBoxGeoCoder({
        accessToken: mapboxgl.accessToken,
        language: 'zh-TW',
        marker: true,
        types: 'country, region',
        mapboxgl: mapboxgl
    });

    map.addControl(geoCoder);

    geoCoder.on('result', (event: mapboxgl.EventData) => {
        geoResult.value = event.result.place_name;
    });

})

const showForm = ref(false);
const newPost = ref({
    title: '',
    location: '',
    description: '',
    authorId: 'user123',
    views: 0,
    likes: 0,
    comments: [],
    isEdit: false,
});

const createNewPost = () => {
    newPost.value = {
        title: '',
        location: '',
        description: '',
        authorId: 'user123',
        views: 0,
        likes: 0,
        comments: [],
        isEdit: false,
    };

    showForm.value = false;
};
</script>

<template>
    <div class=" w-full flex-1 flex flex-col overflow-auto px-40 pt-12 gap-4 bg-stone-700">
        <div class="w-full flex flex-col items-center bg-stone-600 border-2 border-x-0 border-stone-100">
            <h3 class="text-white text-xl border-2 border-y-0 border-stone-100 bg-stone-500 p-1 px-8">
                發布新貼文
            </h3>
        </div>
        <div class="flex flex-col items-center bg-stone-600 rounded-sm border-2 border-t-0 border-stone-100">
            <form class="flex-1 w-full flex flex-col items-end gap-12">
                <div class="mapBlock w-full flex flex-col items-center gap-8">
                    <div ref="mapContainer" class="border-t-4 border-stone-300 w-full h-80"></div>
                    <input v-model="geoResult" type="text" id="location" placeholder="請透過地圖選擇照片拍攝地點"
                        class="w-full border-4 border-stone-300 border-dashed p-2 pointer-events-none bg-stone-100 text-center tracking-wide"
                        required readonly>
                </div>
                <div class="contentBlock flex flex-col items-center gap-8 w-full text-white px-10">
                    <div class="border-t-2 border-stone-100 w-full "></div>
                    <div class="w-1/2 flex flex-col items-center gap-2">
                        <label for="title" class="text-lg">貼文標題</label>
                        <input v-model="newPost.title" type="text" id="title" class="w-full p-2 border-2 border-stone-400 focus:border-stone-200 focus:outline-none text-stone-700" placeholder="10字以內" required>
                    </div>
                    <div class="w-1/2 flex flex-col items-center gap-2">
                        <label for="description" class="block text-lg">簡短描述</label>
                        <textarea v-model="newPost.description" id="description" rows="4"
                            class="w-full border-2 resize-none border-stone-400 focus:border-stone-200 focus:outline-none text-stone-700 p-2" placeholder="45字以內" required></textarea>
                    </div>
                </div>
                <div class="imgBlock flex flex-col items-center gap-4 w-full px-10">
                    <div class="border-t-2 border-stone-100 w-full"></div>
                    <div class="mt-4 flex flex-col items-center gap-2 text-sm leading-6 text-gray-600">
                        <div v-if="previewUrls.length > 0"
                            class="relative border-4 border-stone-200 rounded-sm w-[400px] h-[300px] bg-white cursor-pointer">
                            <img :src="previewUrls[previewImg]" alt="" class="w-full h-full object-cover rounded-sm">
                            <EyeIcon class="absolute top-2 right-2 w-8 z-10 text-stone-100 hover:scale-110"
                                @click="showPreview = true" />
                            <div v-if="showPreview"
                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] border-4 border-stone-200 rounded-sm z-10">
                                <img :src="previewUrls[previewImg]" alt="Preview"
                                    class="w-full h-full object-cover rounded-sm" />
                                <XCircleIcon class="w-8 text-stone-100 absolute top-1 right-1  hover:scale-105"
                                    @click="showPreview = false" />
                            </div>
                        </div>
                        <div v-else
                            class="flex justify-center items-center border-4 border-dashed border-stone-200 rounded-sm w-[400px] h-[300px]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-14 h-14 text-stone-300">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </div>
                        <label for="imgUpload" class="relative cursor-pointer bg-white w-full">
                            <span type="button"
                                class="bg-green-600 text-stone-100 p-2 w-full font-bold hover:bg-green-500 transition-all duration-300 text-center text-lg">選擇圖片</span>
                            <input ref="imgInput" id="imgUpload" name="imgUpload" type="file" class="sr-only"
                                @change="previewImages" multiple>
                        </label>
                    </div>
                    <div class="previewRows flex gap-3 w-full overflow-auto p-1">
                        <div v-if="previewUrls.length > 0" class="flex gap-3 mx-auto">
                            <div v-for="url, index in previewUrls"
                                class="border-4 rounded-sm w-[140px] h-[105px] bg-stone-500"
                                :class="previewImg === index ? 'border-stone-200 border-solid' : 'border-dashed border-stone-300 '">
                                <img :src="url" :key="index" @click="previewImg = index"
                                    class="w-full h-full object-cover rounded-sm cursor-pointer">
                            </div>
                            <div class="flex gap-3">
                                <div
                                    class="border-4 border-dashed border-stone-300 rounded-sm w-[140px] h-[105px] flex items-center justify-center text-stone-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-stone-300">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div v-else class="flex gap-3 mx-auto">
                            <div v-for="i in 5"
                                class="border-4 border-dashed border-stone-300 rounded-sm w-[140px] h-[105px] flex items-center justify-center text-stone-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-10 h-10">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" class="w-full bg-stone-600 text-white px-4 py-2 basis-1 text-lg font-bold">添加</button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.imgBlock ::-webkit-scrollbar {
    width: 6px;
}

.imgBlock ::-webkit-scrollbar-track {
    background-color: white;
}

.imgBlock ::-webkit-scrollbar-thumb {
    background-color: gray;
}
</style>
