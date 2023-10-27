<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import router from '../router';
import {
    EyeIcon,
    ChatBubbleBottomCenterIcon,
    PlusIcon
} from '@heroicons/vue/24/outline';

import {
    HeartIcon,
} from '@heroicons/vue/24/solid';
import { getPostDataset } from '../api/community';
import { CommunityPostType } from '../types';
import { getTimeDifference } from '../utils/formattingUtils';
import { getAuthor } from '../api/user';

const votes = ref([
    {
        id: 1,
        title: '投票标题1',
        description: '这是投票1的描述。',
        deadline: '2023-12-31',
    },
    {
        id: 2,
        title: '投票标题2',
        description: '这是投票2的描述。',
        deadline: '2023-12-31',
    },
    // 添加更多虚拟数据...
]);

const communityPosts = ref<CommunityPostType[]>();
const usernameList = ref<string[]>([]);
const fetchData = async () => {
    const response = await getPostDataset();
    communityPosts.value = response.value;
}

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

onMounted(async () => {
    await fetchData();
    if (communityPosts.value) {
        for (const post of communityPosts.value) {
            const responseData = await getAuthor(post.authorId);
            if (responseData.value) {
                const username = responseData.value.username;
                usernameList.value.push(username);
            }
        }
    }
})

const activeTab = ref('latest');
const currentPage = ref(1);
const itemsPerPage = 6;

const filteredVotes = computed(() => {
    if (activeTab.value === 'latest') {
        return votes.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage);
    } else if (activeTab.value === 'hot') {
        // 过滤热门投票逻辑
    } else if (activeTab.value === 'myVotes') {
        // 过滤我的投票逻辑
    }
});

const totalPages = computed(() => Math.ceil(votes.value.length / itemsPerPage));

const changeTab = (tab) => {
    activeTab.value = tab;
    currentPage.value = 1; // 切换标签时重置当前頁码
};

const changePage = (action) => {
    if (action === 'prev' && currentPage.value > 1) {
        currentPage.value--;
    } else if (action === 'next' && currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const goToPage = (pageNumber) => {
    currentPage.value = pageNumber;
};
</script>

<template>
    <div v-if="communityPosts && votes && usernameList" class="flex flex-col gap-12 py-4 bg-stone-100 p-4">
        <div class="">
            <h1 class="text-3xl mb-4">話題投票</h1>
            <div class="border-b-2 border-stone-700 my-4"></div>
            <div class="flex space-x-4 mb-4">
                <button @click="changeTab('latest')"
                    :class="activeTab === 'latest' ? 'bg-stone-800 text-white px-4 py-2 hover:bg-stone-800' : 'bg-stone-500 text-white px-4 py-2 hover:bg-stone-600'">最新</button>
                <button @click="changeTab('hot')"
                    :class="activeTab === 'hot' ? 'bg-stone-800 text-white px-4 py-2 hover:bg-stone-800' : 'bg-stone-500 text-white px-4 py-2 hover:bg-stone-600'">热门</button>
                <button @click="changeTab('myVotes')"
                    :class="activeTab === 'myVotes' ? 'bg-stone-800 text-white px-4 py-2 hover:bg-stone-800' : 'bg-stone-500 text-white px-4 py-2 hover:bg-stone-600'">我的投票</button>
            </div>
            <div class="flex flex-wrap gap-8">
                <div v-for="vote in filteredVotes" :key="vote.id"
                    class="md:basis-1/3 p-4 border-2 border-stone-700 shadow mb-4">
                    <h2 class="text-xl mb-2">{{ vote.title }}</h2>
                    <p class="text-stone-600">{{ vote.description }}</p>
                    <div class="mt-4 flex justify-between items-center">
                        <span class="text-stone-800 ">截止日期：{{ vote.deadline }}</span>
                        <button class="bg-stone-800 text-white px-3 py-1 hover:bg-stone-800">投票</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 貼文 -->
        <div class="">
            <div class="flex items-center justify-between gap-4">
                <h1 class="text-3xl leading-none">社區討論</h1>
                <div @click="router.push({ name: 'CommunityCreatePost' })"
                    class="flex gap-2 border-2 border-stone-600 p-1 px-2 hover:bg-stone-600 hover:text-stone-100 transition-all duration-300 cursor-pointer">
                    新增文章
                    <PlusIcon class="w-4" />
                </div>
            </div>
            <div class="border-b-2 border-stone-700 my-4"></div>
            <div class="flex flex-col justify-between mt-8">
                <div v-for="communityPost, index in communityPosts" :key="communityPost._id"
                    @click="router.push({ name: 'CommunityPost', params: { id: communityPost._id } })"
                    class="w-full basis-1 p-4 border-2 border-stone-700 shadow mb-4 cursor-pointer group hover:bg-stone-700 hover:text-white hover:border-stone-700 transition-all duration-300">
                    <div class="flex justify-between">
                        <div class="flex gap-4 items-center justify-center">
                            <h2 class="text-xl font-bold max-w-[20rem] truncate overflow-hidden">{{ communityPost.title }}
                            </h2>
                            <div class="flex gap-2 flex-wrap">
                                <span v-for="tag in communityPost.topicTags"
                                    class="px-2 py-1 text-xs rounded text-stone-100"
                                    :style="`background-color:${setTagColor(tag)}`">
                                    {{ tag }}
                                </span>
                            </div>
                        </div>

                        <div class="flex gap-8">
                            <div class="flex items-center gap-4">
                                <span class="flex items-center gap-1 text-blue-900 group-hover:text-stone-100">
                                    <EyeIcon class="w-6" />{{ communityPost.views }}
                                </span>
                                <span class="flex items-center gap-1 text-red-600 group-hover:text-stone-100">
                                    <HeartIcon class="w-6" />{{ communityPost.likes }}
                                </span>
                                <span class="flex items-center gap-1 text-stone-700 group-hover:text-stone-100">
                                    <ChatBubbleBottomCenterIcon class="w-6" />{{ communityPost.views }}
                                </span>
                            </div>

                            <div class="flex items-baseline gap-2">
                                <p class="text-sm text-stone-700 font-bold group-hover:text-stone-100">#{{
                                    usernameList[index] }}
                                </p>
                                <p class="text-sm italic text-stone-500 group-hover:text-stone-100">--{{
                                    getTimeDifference(communityPost.createdAt!) }}&nbsp;前</p>
                            </div>
                        </div>

                    </div>
                    <p class="mt-2 text-stone-600 truncate group-hover:text-stone-100">{{ communityPost.content }}</p>
                </div>
            </div>

            <!-- 分頁標籤 -->
            <div class="flex justify-center mt-4 gap-4">
                <button @click="changePage('next')" :disabled="currentPage === 1"
                    class="border-2 px-3 py-1 ml-2 transition-all duration-300"
                    :class="currentPage === 1 ? 'border-stone-500 text-stone-500' : 'border-stone-800 text-stone-800 cursor-pointer hover:text-white hover:bg-stone-800'">上一頁</button>
                <div class="flex space-x-2">
                    <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
                        class="border-2 px-3 py-1 transition-all duration-300"
                        :class="pageNumber === currentPage ? 'border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white' : 'bg-stone-500 text-white hover:bg-stone-600 '">{{
                            pageNumber }}</button>
                </div>
                <button @click="changePage('next')" :disabled="currentPage === totalPages"
                    class="border-2 px-3 py-1 transition-all duration-300"
                    :class="currentPage === totalPages ? 'border-stone-500 text-stone-500' : 'border-stone-800 text-stone-800 cursor-pointer hover-text-white hover:bg-stone-800'">下一頁</button>
            </div>
        </div>
    </div>
</template>
  