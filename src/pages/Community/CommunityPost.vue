<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router'
import {
    EyeIcon,
    ChatBubbleBottomCenterIcon,
    TrashIcon
} from '@heroicons/vue/24/outline';

import {
    HeartIcon
} from '@heroicons/vue/24/solid';
import { getTimeDifference, formatDateTime } from '../../utils/formattingUtils';
import { AuthorDataType, CommentType, CommunityPostType, DialogType, UserDataType } from '../../types';
import { getPostData } from '../../api/community';
import { getAuthor } from '../../api/user';
import { getComments, postComment, deleteComment } from '../../api/communityComment';
import { Dialog } from '@headlessui/vue';
import { useUserStore } from '../../store/user';

const router = useRouter();
const userStore = useUserStore();
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});

const postData = ref<CommunityPostType>();
const authorData = ref<AuthorDataType>();
const commentsData = ref<CommentType[]>();
const commentsAuthorData = ref<AuthorDataType[]>([]);

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

//----留言區
const fetchCommentData = async (idList: string[]) => {
    const commentsResponseData = await getComments(idList);
    commentsData.value = commentsResponseData.value;

    if (commentsData.value) {
        for (const comment of commentsData.value) {
            const authorResponseData = await getAuthor(comment.authorId);
            if (authorResponseData.value) {
                commentsAuthorData.value.push(authorResponseData.value);
            }
        }
    }
}

const comment = ref('');
const commentSubmit = ref();
const commentPost = ref('');
const commentSubmitButton = ref();
async function handleCommentSubmit() {

    const userData: UserDataType = userStore.getData()!;

    if (commentPost.value && postData.value && postData.value._id) {
        const submitData: CommentType = {
            authorId: userData._id,
            postId: postData.value!._id,
            content: commentPost.value,
        }
        await postComment(submitData)
            .catch((err) => {
                console.log(`postUserData 失敗: ${err}`);
            });

        commentPost.value = '';

        //重新加載留言資料//
        fetchCommentData(postData.value.commentsId);
    }
}

// let isLiked = false;

// async function handleLikes() {
//     if (!userStore.isLogin) {
//         router.push({ name: 'Login' })
//     }
//     if (postData && postData.value && id && id.value) {
//         if (!isLiked) {
//             await setStats(id.value, "increaseLikes");
//             postData.value.likes++;
//             isLiked = true;
//         } else {
//             await setStats(id.value, "reduceLikes");
//             postData.value.likes--;
//             isLiked = false;
//         }
//     }
// }

//刪除評論
const showDialog = ref(false);
const dialogData = ref<DialogType>({
    title: "刪除評論",
    content: "是否確認刪除該評論?",
    warringStyle: true,
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

async function handleDeleteComment(commentId: string) {
    const choice = await handleDialog();

    if (choice) {
        await deleteComment(commentId);
        await fetchCommentData();
    }

    userChoice.value = undefined;
}

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

onMounted(async () => {
    const responseData = await getPostData(props.id);
    postData.value = responseData.value;
    if (postData.value) {
        const authorResponseData = await getAuthor(postData.value.authorId);
        authorData.value = authorResponseData.value;
        console.log(postData.value.commentsId);

        if (postData.value.commentsId.length > 0) {
            await fetchCommentData(postData.value.commentsId);
        }
    }
})
</script>

<template>
    <div v-if="postData && authorData" class="bg-communityPosts bg-no-repeat bg-cover bg-center w-full bg-fixed">
        <div class="bg-white w-full py-12 px-4">
            <div class="mx-auto flex flex-col bg-white w-[62rem] translate-y-[-7rem] pt-28 px-5">
                <button @click="router.back()" class="self-start text-sm font-bold text-stone-800">上一頁</button>
                <div class="mt-12 mx-auto border-2 border-stone-800 w-[62rem] max-w-full px-24 py-16">
                    <div class="flex items-center gap-4">
                        <div
                            class="border border-stone-800 rounded-full bg-white w-14 h-14 p-1 flex items-center justify-center overflow-hidden">
                            <img :src="`/assets/img/avatar (${authorData.selectedAvatarIndex}).png`" alt="avatar">
                        </div>
                        <div class="flex gap-2 items-baseline justify-start flex-1">
                            <span class="text-lg text-stone-700 font-bold">{{ authorData.username }}</span>
                            <span class="font-bold text-sm text-stone-500">{{ formatDateTime(postData.createdAt!) }}
                                <span class="text-md italic">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                                {{ getTimeDifference(postData.createdAt!) }} 以前
                            </span>
                        </div>
                    </div>
                    <h1 class="my-4 text-2xl text-stone-600 font-bold">{{ postData.title }}</h1>
                    <div class="flex gap-2 flex-wrap">
                        <span v-for="tag in postData.topicTags" class="px-2 py-1 text-stone-100"
                            :style="`background-color:${setTagColor(tag)}`">
                            {{ tag }}
                        </span>
                    </div>
                    <p class="text-stone-700 mt-20 whitespace-pre-wrap">{{ postData.content }}</p>
                    <div class="mt-4 flex flex-col gap-4">
                        <img v-for="image in postData.images" :src="image.url" class="border-4 border-stone-700" />
                    </div>
                    <div class="border-b-[1.5px] border-gray-300 my-4"></div>
                    <div class="flex justify-between">
                        <div class="flex gap-8"> <span class="flex gap-1">
                                <EyeIcon class="w-4" />0
                            </span>
                            <span class="flex gap-1">
                                <ChatBubbleBottomCenterIcon class="w-4" />0
                            </span>
                        </div>
                        <span class="group flex gap-1 hover:cursor-pointer focus:text-red-500 transition-all" tabindex="0">
                            <HeartIcon class="w-4 group-focus:scale-[125%] transition-all duration-300" />0
                        </span>
                    </div>
                </div>
                <!-- 留言區 -->
                <div ref="leftBlock"
                    class="animate-slideInLeft basis-[30%]  border border-stone-800 bg-white py-10 px-8 overflow-auto">
                    <span class="font-bold text-stone-600 tracking-widest">留言區</span>
                    <div class="border-b-[.0938rem] border-gray-300 my-4"></div>
                    <form method="POST" @submit.prevent="handleCommentSubmit">
                        <div class="mt-10 mb-4 border border-stone-600 p-3">
                            <textarea v-model="commentPost" name="" id="" cols="20" rows="3" placeholder="輸入留言..."
                                class="w-full border-none outline-none resize-none bg-transparent p-0 m-0 text-current"></textarea>
                        </div>
                        <div class="flex justify-end gap-2">
                            <button type="button" @click="commentPost = ''"
                                class="text-green-400 px-5 py-2 hover:text-green-600">取消</button>
                            <button ref="commentSubmitButton" type="submit"
                                class="text-white bg-gray-300 px-5 py-2 transition-all ">送出</button>
                        </div>
                    </form>
                    <ul v-if="commentsData" class="mt-8">
                        <li v-for="comment in commentsData">
                            <div class="flex items-center gap-4">
                                <div
                                    class="border border-stone-800 rounded-full bg-white w-10 h-10 p-1 flex items-center justify-center overflow-hidden">
                                    <img :src="`/assets/img/avatar (${comment.author.selectedAvatarIndex}).png`"
                                        alt="avatar">
                                </div>
                                <div class="flex gap-2 items-center justify-start flex-1">
                                    <span class=" text-sm text-stone-700 font-bold">{{ comment.author.username }}</span>
                                    <span class="text-xs text-stone-500 text-center">{{ formatDateTime(comment.createdAt,
                                        'concise')
                                    }}</span>
                                    <TrashIcon @click="handleDeleteComment(comment._id)"
                                        class="w-5 cursor-pointer  text-red-700 ml-auto" />
                                </div>
                            </div>
                            <div class="">
                                <p class="mt-4 text-sm text-stone-700">{{ comment.content }}</p>
                            </div>
                            <div class="border-b-[.0938rem] border-gray-300 my-4"></div>
                        </li>
                    </ul>
                    <div v-else class="border-b-[.0938rem] border-gray-300 mt-10 text-center text-gray-400 py-1">尚未有留言</div>
                </div>
            </div>
        </div>
    </div>
    <Transition enter-active-class="transition ease-in duration-150 delay-0" enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150 delay-0"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
        <Dialog v-if="showDialog" :dialogData="dialogData" @closePopup="(choice: boolean) => userChoice = choice" />
    </Transition>
</template>
