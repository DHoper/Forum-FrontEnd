<script setup lang="ts">
import TheHeader from '../components/layout/TheHeader.vue';
import PhotoPost from './Gallery/PhotoPost.vue';
import {
    PlusCircleIcon,
} from '@heroicons/vue/24/solid';
import { ref, onMounted } from 'vue';
import { getLevelOneData } from '../api/gallery.ts';

const galleryDataset = ref();
const fetchData = async () => {
    const responseData = await getLevelOneData('/gallery');
    galleryDataset.value = responseData;
};

enum AddBlock {
    Block = 'block',
    Icon = 'icon'
}

const addBlock = ref<AddBlock>(AddBlock.Icon);
const rightBlock = ref<HTMLElement | null>(null);

function handleScroll() {
    const scrollY = rightBlock.value?.scrollTop;
    const clientHeight = rightBlock.value?.clientHeight;
    const scrollHeight = rightBlock.value?.scrollHeight;

    if (scrollY + clientHeight + 100>= scrollHeight) {
        addBlock.value = AddBlock.Block;
    }else {
        addBlock.value = AddBlock.Icon;
    }
}

onMounted(async () => {
    await fetchData();
    rightBlock.value?.addEventListener('scroll', handleScroll);
});

const photoPostShow = ref(false);
const photoPostShowInner = ref(false);
const photoPostID = ref<string>('');
function openPhoto(id: string) {
    photoPostID.value = id;
    photoPostShow.value = true;
    photoPostShowInner.value = true;
}
function closePhoto() {
    photoPostShow.value = false;
    photoPostShowInner.value = false;
    photoPostID.value = '';
}
</script>

<template>
    <div class="h-screen overflow-hidden flex flex-col">
        <TheHeader :is-login="false" />
        <div v-if="galleryDataset" class="flex relative overflow-hidden">
            <div
                class="flex flex-col items-center bg-gallery bg-no-repeat bg-cover bg-center basis-[30%] text-white h-full">
                <span class="text-5xl [writing-mode:vertical-lr] mt-16 tracking-[1rem] font-bold">偉大的世界</span>
                <div class="mt-16 text-lg text-[#f9f9f9c8] flex flex-col items-center gap-4 tracking-[.8rem]">
                    <span>還有許多</span>
                    <span>你未曾探尋之地</span>
                </div>
            </div>
            <div class="basis-[70%] h-full">
                <div ref="rightBlock" class="h-full flex flex-wrap overflow-auto">
                    <div v-for="galleryData in galleryDataset" class="relative basis-1/4 group cursor-pointer hover:z-10">
                        <img class="scale-[101%] group-hover:scale-105 transition-all ease-in duration-700"
                            :src="galleryData.image[0].url" />
                        <div
                            class="absolute top-0 left-0 w-full h-full scale-[101%] bg-black bg-opacity-0 group-hover:bg-opacity-40 group-hover:scale-105 transition-all ease-in duration-700">
                        </div>
                        <div @click="openPhoto(galleryData._id)"
                            class="flex flex-col justify-between absolute top-0 left-0 w-full h-full scale-[101%] text-white p-4 pb-1 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:scale-105 group-hover:translate-x-0 transition-all duration-1000 ease-in"
                            tabindex="-1">
                            <div>
                                <p class="text-xs text-[#fdfdfdda]">
                                    {{ galleryData.date }}
                                </p>
                                <h3 class="text-xl  my-2 text-[#fdfdfdda]">
                                    {{ galleryData.title }}
                                </h3>
                                <p class="text-xs text-[#fdfdfdda]">
                                    {{ galleryData.location }}
                                </p>
                            </div>
                            <div>
                                <div class="border border-[#fdfdfd7d] "></div>
                                <div class="flex items-center justify-between h-7">
                                    <span class="button text-sm tracking-widest">查看更多</span>
                                    <img src="/assets/svg/long-arrow.svg" alt="long-arrow"
                                        class="w-14 h-10 0 -translate-x-1/2 group-hover:translate-x-0 transition-all duration-[1150ms] ease-linear">
                                </div>
                            </div>
                        </div>
                    </div>
                    <a v-if="addBlock === 'block'" href="add"
                        class="flex justify-center items-center flex-grow text-2xl font-bold bg-gray-100 text-stone-700 cursor-pointer hover:text-stone-900 hover:scale-105 hover:bg-white hover:z-10 transition-all duration-[1150ms]">
                        添加更多發現
                    </a>
                    <PlusCircleIcon v-else
                        class="fixed bottom-12 right-12 w-16 h-16 z-10 text-white cursor-pointer hover:scale-110 hover:text-green-400 transition-all ease-in" />
                </div>
            </div>
            <PhotoPost v-if="photoPostShow" :id="photoPostID" :photoPostShow="photoPostShowInner" @click="closePhoto" />
        </div>
    </div>
</template>