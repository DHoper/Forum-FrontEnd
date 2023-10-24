<script setup lang="ts">
import { getPostData, setStats } from '../../api/gallery.ts';
import { getAuthor, } from '../../api/user.ts';
import { getComment, postComment, deleteComment } from '../../api/comment.ts';
import { useUserStore } from '../../store/user.ts';
import { formatDateTime } from '../../utils/formattingUtils.ts';
import { PhotoPostFilledType, CommentType, CommentFilledType, DialogType } from '../../types.ts';
import { ref, toRefs, onMounted, watchEffect, watch } from 'vue';
import {
    XCircleIcon,
    EyeIcon,
    TrashIcon
} from '@heroicons/vue/24/outline';
import {
    HeartIcon,
} from '@heroicons/vue/24/solid'

const props = defineProps({
    id: {
        type: String,
        required: true,
    }
});

const emit = defineEmits(['close']);

const leftBlock = ref<HTMLElement | null>(null);
const rightBlock = ref<HTMLElement | null>(null);
const turnPage = ref<boolean>(false); //換頁判定變數

function close() {
    leftBlock.value?.classList.add('animate-slideInLeftBack');
    rightBlock.value?.classList.add('animate-slideInRightBack');
    leftBlock.value?.addEventListener('animationend', () => { emit('close') });
    rightBlock.value?.addEventListener('animationend', () => { emit('close') });
}

const { id } = toRefs(props);

const photoPost = ref<PhotoPostFilledType>();
const pictureIndex = ref<number>(0);

//取得數據

const fetchCommentData = async () => {
    if (photoPost.value) {
        const responseData = await getPostData(`${id.value}`);
        const commentsId = responseData.commentsId;

        let commentData: CommentFilledType[] = [];
        for (const commentId of commentsId) {
            const comment = await getComment(commentId);
            comment.author = await getAuthor(comment.authorId);

            commentData.push(comment);
        }
        photoPost.value.comments = commentData;
    }
}

const fetchData = async () => {
    const responseData = await getPostData(id.value);
    await setStats(id.value, "updateViews");

    const { _id, title, image, location, description, createdAt, authorId, views, likes, isEdit, commentsId } = responseData;
    const authorData = await getAuthor(authorId);
    let commentData: CommentFilledType[] = [];
    for (const commentId of commentsId) {
        const comment = await getComment(commentId);
        comment.author = await getAuthor(comment.authorId);
        commentData.push(comment);
    }

    photoPost.value = {
        _id,
        title,
        image,
        location,
        description,
        createdAt: formatDateTime(createdAt),
        authorInfo: {
            authorName: authorData.username,
            authorAvatarIndex: authorData.selectedAvatarIndex,
        },
        views,
        likes,
        isEdit,
        comments: commentData
    };

};

onMounted(async () => {
    await fetchData();
})

const commentPost = ref('');
const commentSubmitButton = ref();

//留言區輸入框樣式偵測
watchEffect(() => {
    if (commentSubmitButton.value) {
        const trimmedComment = commentPost.value.trim();

        if (trimmedComment) {
            commentSubmitButton.value.classList.toggle('bg-green-600', true);
            commentSubmitButton.value.classList.toggle('hover:bg-green-500', true);
            commentSubmitButton.value.classList.toggle('bg-gray-300', false);
        } else {
            commentSubmitButton.value.classList.toggle('bg-green-600', false);
            commentSubmitButton.value.classList.toggle('hover:bg-green-500', false);
            commentSubmitButton.value.classList.toggle('bg-gray-300', true);
        }
    }
});

async function handleSubmit() {
    const userData = useUserStore().userData;
    if (photoPost.value) {
        const postData: CommentType = {
            authorId: userData._id,
            photoPostId: photoPost.value._id,
            content: commentPost.value,
        }
        await postComment(postData)
            .catch((err) => {
                console.log(`postUserData 失敗: ${err}`);
            });

        commentPost.value = '';

        //重新加載留言資料//
        fetchCommentData();

    }
}

let isLiked = false;

async function handleLikes() {
    if (photoPost && photoPost.value && id && id.value) {
        if (!isLiked) {
            await setStats(id.value, "increaseLikes");
            photoPost.value.likes++;
            isLiked = true;
        } else {
            await setStats(id.value, "reduceLikes");
            photoPost.value.likes--;
            isLiked = false;
        }
    }
}

//刪除評論
const showDialog = ref(false);
const dialogData = ref<DialogType>({
    title: "刪除評論",
    content: "是否確認刪除該評論?",
    warringStyle: true,
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
}
</script>

<template>
    <div v-if="photoPost" class="z-10 flex absolute top-0 left-0 w-full h-full  overflow-hidden">
        <div ref="leftBlock"
            class="animate-slideInLeft basis-[30%]  border border-stone-800 bg-white py-10 px-8 overflow-auto">
            <span class="font-bold text-stone-600 tracking-widest">留言區</span>
            <div class="border-b-[.0938rem] border-gray-300 my-4"></div>
            <form method="POST" @submit.prevent="handleSubmit">
                <div class="mt-10 mb-4 border border-stone-600 p-3">
                    <textarea v-model="commentPost" name="" id="" cols="20" rows="3" placeholder="輸入留言..."
                        class="w-full border-none outline-none resize-none bg-transparent p-0 m-0 text-current"></textarea>
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="commentPost = ''"
                        class="text-green-400 px-5 py-2 hover:text-green-600">取消</button>
                    <button ref="commentSubmitButton" type="submit" class="text-white bg-gray-300 px-5 py-2 transition-all ">送出</button>
                </div>
            </form>
            <ul v-if="photoPost.comments.length > 0" class="mt-8">
                <li v-for="comment in photoPost.comments">
                    <div class="flex items-center gap-4">
                        <div
                            class="border border-stone-800 rounded-full bg-white w-10 h-10 p-1 flex items-center justify-center">
                            <img :src="`/assets/img/avatar (${comment.author.selectedAvatarIndex}).png`" alt="avatar">
                        </div>
                        <div class="flex gap-2 items-center justify-start flex-1">
                            <span class=" text-sm text-stone-700 font-bold">{{ comment.author.username }}</span>
                            <span class="text-xs text-stone-500 text-center">{{ formatDateTime(comment.createdAt, 'concise')
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
        <div ref="rightBlock"
            class="animate-slideInRight basis-[70%] flex flex-col w-full bg-[#484538] pt-8 px-20 overflow-auto ">
            <div class="relative h-[26rem]">
                <div
                    class="relative bg-white px-8 pb-1 pt-6 rounded-xs flex flex-col gap-2 shadow-sm shadow-stone-600 h-full border border-stone-400">
                    <Transition :duration="1000">
                        <div v-if="!turnPage" class="h-full flex flex-col">
                            <div class="flex gap-4">
                                <div class="relative basis-2/3 -ml-2 p-4">
                                    <div class="absolute top-0 left-0 w-1/6 h-1/4 border-l-2 border-t-4 border-stone-600 ">
                                    </div>
                                    <img :src="photoPost.image[0].url" :alt="photoPost.image[0].filename"
                                        class="rounded-sm relative z-10 shadow-sm shadow-stone-600">
                                </div>
                                <div
                                    class="flex-1 pt-4 flex flex-col items-center text-stone-700  border-b-4 border-stone-600">
                                    <h2 class="text-2xl font-bold text-center">{{ photoPost.title }}</h2>
                                    <p class="text-sm text-center text-stone-500 py-2">{{ photoPost.location }}</p>
                                    <p class=" w-full p-4 flex-grow italic text-center flex justify-center items-center">
                                        {{ photoPost.description }}</p>
                                </div>
                            </div>
                            <div class="basis-full flex gap-4 justify-between italic ">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="border border-stone-800 rounded-full bg-white w-10 h-10 p-1 flex items-center justify-center">
                                        <img class="rounded-full"
                                            :src="`/assets/img/avatar (${photoPost.authorInfo.authorAvatarIndex}).png`"
                                            alt="avatar">
                                    </div>
                                    <p class="text-stone-600 font-bold">{{ photoPost.authorInfo.authorName }}</p>
                                    <p class="text-stone-600 text-sm">-- {{ photoPost.createdAt }}</p>
                                    <p v-if="!photoPost.isEdit" class="text-stone-600 text-sm">發布</p>
                                    <p v-else>已編輯</p>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="flex items-center gap-1 text-blue-900">
                                        <EyeIcon class="w-6" />
                                        <span>{{ photoPost.views }}</span>
                                    </span>
                                    <span class="flex items-center gap-1 group"
                                        :class="isLiked ? 'text-red-500' : 'text-stone-700'">
                                        <HeartIcon @click="handleLikes"
                                            class="w-6 cursor-pointer group-hover:scale-105 transition-all duration-500 " />
                                        <span class="transition-all duration-500">{{
                                            photoPost.likes }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div v-else class="h-full absolute top-0">
                            <div class="flex justify-around items-center h-full p-4">
                                <div class="basis-1/4 overflow-hidden overflow-y-auto h-full flex flex-col gap-4 p-2">
                                    <div v-for="picture, index in photoPost.image" @click="pictureIndex = index"
                                        class="relative cursor-pointer hover:scale-[105%] transition-all duration-500 border-4 border-stone-400 focus:border-stone-700"
                                        tabindex="0">
                                        <img :src="picture.url" :alt="picture.filename"
                                            class="relative z-10 shadow-sm shadow-stone-600">
                                    </div>
                                    <!-- 展示用途 -->
                                    <!-- <div v-if="photoPost.image.length === 1" v-for="picture, index in photoPost.image"
                                        @click="pictureIndex = index"
                                        class="relative cursor-pointer hover:scale-[105%] transition-all duration-500 border-4 border-stone-400 focus:border-stone-700"
                                        tabindex="0">
                                        <img :src="picture.url" :alt="picture.filename"
                                            class="relative z-10 shadow-sm shadow-stone-600">
                                    </div> -->
                                    <div v-if="photoPost.image.length === 1"
                                        class="flex items-center justify-center border-4 border-dashed border-stone-200 py-10 text-stone-400">
                                        <p>沒有更多的圖了</p>
                                    </div>
                                    <div
                                        class="flex items-center justify-center border-4 border-dashed border-stone-200 py-10 text-stone-400">
                                        <p>沒有更多的圖了</p>
                                    </div>
                                </div>
                                <div class="relative  border-4 border-b-2  border-stone-600 rounded-sm">
                                    <img :src="photoPost.image[pictureIndex].url"
                                        :alt="photoPost.image[pictureIndex].filename"
                                        class="relative z-10 shadow-sm shadow-stone-600">
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
                <div @click="turnPage = !turnPage"
                    class="absolute top-2 left-0 shadow-sm shadow-stone-600 rotate-[3deg] w-full h-full -z-10 bg-white cursor-pointer hover:top-4 transition-all duration-500">
                </div>
            </div>
            <div class="self-center">
                <XCircleIcon @click="close"
                    class="w-12 cursor-pointer  text-white mx-auto py-4 hover:scale-105 transition-all ease-in" />
            </div>
        </div>
    </div>
    <Dialog v-if="showDialog" :dialogData="dialogData" @closePopup="(choice: boolean) => userChoice = choice" />
</template>
