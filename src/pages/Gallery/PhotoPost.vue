<script setup lang="ts">
import { getPostData, setStats } from "../../api/photoPost/photoPost.ts";
import { getAuthor } from "../../api/user/user.ts";
import {
  postComment,
  deleteComment,
} from "../../api/photoPost/photoPostComment.ts";
import { useUserStore } from "../../store/user.ts";
import { formatDateTime } from "../../utils/formattingUtils.ts";
import {
  CommentType,
  DialogType,
  UserDataType,
  PhotoPostType,
  AuthorDataType,
} from "../../types.ts";
import { ref, toRefs, onMounted, watchEffect, watch } from "vue";
import router from "../../router";
import {
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";
import { HeartIcon } from "@heroicons/vue/24/solid";
import { getComments } from "../../api/photoPost/photoPostComment.ts";

const userStore = useUserStore();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const leftBlock = ref<HTMLElement | null>(null);
const rightBlock = ref<HTMLElement | null>(null);
const turnPage = ref<boolean>(false); //換頁判定變數

function close() {
  leftBlock.value?.classList.add("animate-slideInLeftBack");
  rightBlock.value?.classList.add("animate-slideInRightBack");
  leftBlock.value?.addEventListener("animationend", () => {
    emit("close");
  });
  rightBlock.value?.addEventListener("animationend", () => {
    emit("close");
  });
}

const { id } = toRefs(props);

const postData = ref<PhotoPostType>();
const postAuthorData = ref<AuthorDataType>();
const commentsData = ref<CommentType[]>([]);
const commentAuthorData = ref<AuthorDataType[]>([]);
const pictureIndex = ref<number>(0);

//取得數據
const fetchPostData = async () => {
  const responseData = await getPostData(props.id);
  postData.value = responseData.value;
};

const fetchCommentData = async (idList: string[]) => {
  const commentsResponseData = await getComments(idList);

  if (commentsResponseData.value) {
    commentsData.value = commentsResponseData.value;
    let authorList: AuthorDataType[] = [];
    for (const comment of commentsData.value) {
      const authorResponseData = await getAuthor(comment.authorId);
      if (authorResponseData.value) {
        authorList.push(authorResponseData.value);
      }
    }
    commentAuthorData.value = authorList;
  }
};

let isLiked = false;

async function handleLikes() {
  if (!userStore.isLogin) {
    router.push({ name: "Login" });
  }
  if (postData && postData.value && id && id.value) {
    if (!isLiked) {
      await setStats(id.value, "increaseLikes");
      postData.value.likes++;
      isLiked = true;
    } else {
      await setStats(id.value, "reduceLikes");
      postData.value.likes--;
      isLiked = false;
    }
  }
}

//----留言區

//留言區輸入框樣式偵測
const commentPost = ref("");
const commentSubmitButton = ref();

watchEffect(() => {
  if (commentSubmitButton.value) {
    const trimmedComment = commentPost.value.trim();

    if (trimmedComment) {
      commentSubmitButton.value.classList.toggle("bg-green-600", true);
      commentSubmitButton.value.classList.toggle("bg-gray-300", false);
    } else {
      commentSubmitButton.value.classList.toggle("bg-green-600", false);
      commentSubmitButton.value.classList.toggle("bg-gray-300", true);
    }
  }
});

async function handleCommentSubmit() {
  const userData: UserDataType = userStore.getData()!;

  if (commentPost.value && postData.value && postData.value._id) {

    const submitData: CommentType = {
      authorId: userData._id,
      postId: postData.value!._id,
      content: commentPost.value,
    };
    await postComment(submitData).catch((err) => {
      console.error(`postUserData 失敗: ${err}`);
    });

    commentPost.value = "";

    //重新加載留言資料//
    await fetchPostData();
    if (postData.value.commentsId.length > 0) {
      await fetchCommentData(postData.value.commentsId);
    }
  }
}

//----刪除留言
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
    await fetchPostData();
    if (postData.value) {
      if (postData.value.commentsId.length > 0) {
        await fetchCommentData(postData.value.commentsId);
      }
    }
  }

  userChoice.value = undefined;
}

onMounted(async () => {
  await setStats(props.id, "updateViews");
  await fetchPostData();
  if (postData.value) {
    const authorResponseData = await getAuthor(postData.value.authorId);
    postAuthorData.value = authorResponseData.value!;

    if (postData.value.commentsId.length > 0) {
      await fetchCommentData(postData.value.commentsId);
    }
  }
});
</script>

<template>
  <div
    v-if="postData && postAuthorData"
    class="z-10 flex absolute top-0 left-0 w-full h-full overflow-hidden"
  >
    <div
      ref="leftBlock"
      class="animate-slideInLeft basis-[30%] bg-white py-10 px-8 overflow-auto"
    >
      <span class="font-bold text-stone-600 xl:text-xl tracking-widest"
        >留言區</span
      >
      <div class="border-b-[.0938rem] xl:border-b-2 border-gray-300 my-4"></div>
      <form method="POST" @submit.prevent="handleCommentSubmit">
        <div class="mt-10 mb-4 border-2 border-stone-600 p-3 xl:p-6">
          <textarea
            v-model="commentPost"
            name=""
            id=""
            cols="20"
            rows="3"
            placeholder="輸入留言..."
            class="w-full border-none outline-none resize-none bg-transparent p-0 m-0 text-current"
          />
        </div>
        <div class="flex justify-end gap-2 xl:my-8">
          <button
            type="button"
            @click="commentPost = ''"
            class="text-green-400 px-5 py-2 xl:px-6 xl:text-lg hover:text-green-600"
          >
            取消
          </button>
          <button
            ref="commentSubmitButton"
            type="submit"
            class="text-white bg-gray-300 px-5 py-2 xl:px-6 xl:text-lg transition-all"
          >
            送出
          </button>
        </div>
      </form>
      <ul
        v-if="commentsData.length > 0 && commentAuthorData.length > 0"
        class="mt-8 xl:mt-16"
      >
        <li v-for="(comment, index) in commentsData">
          <div v-if="commentAuthorData[index]">
            <div class="flex items-center gap-4">
              <div
                class="border border-stone-800 rounded-full bg-white w-10 h-10 xl:w-16 xl:h-16 p-1 flex items-center justify-center overflow-hidden"
              >
                <img
                  :src="`/assets/img/avatar (${commentAuthorData[index].selectedAvatarIndex}).png`"
                  alt="avatar"
                />
              </div>
              <div class="flex gap-2 items-baseline justify-start flex-1">
                <span class="text-sm xl:text-xl text-stone-800 font-bold">{{
                  commentAuthorData[index].username
                }}</span>
                <span class="text-xs xl:text-base text-stone-500 text-center">{{
                  formatDateTime(comment.createdAt!, "concise")
                }}</span>
                <TrashIcon
                  @click="handleDeleteComment(comment._id!)"
                  class="w-5 xl:w-6 cursor-pointer text-red-700 ml-auto"
                />
              </div>
            </div>
            <div>
              <p class="mt-4 xl:my-8 text-sm xl:text-xl text-stone-700">
                {{ comment.content }}
              </p>
            </div>
            <div
              class="border-b-[.0938rem] xl:border-b-2 border-gray-300 my-4"
            ></div>
          </div>
        </li>
      </ul>
      <div
        v-else
        class="border-b-[.0938rem] xl:border-b-2 border-gray-300 mt-10 xl:mt-20 text-center text-gray-400 py-1"
      >
        尚未有留言
      </div>
    </div>
    <div
      ref="rightBlock"
      class="animate-slideInRight basis-[70%] flex flex-col w-full bg-[#484538] pt-8 px-20 overflow-auto"
    >
      <div class="w-full flex justify-around xl:mb-4">
        <PencilSquareIcon
          @click="close"
          class="w-10 xl:w-10 cursor-pointer text-blue-600 py-4 hover:text-blue-500 hover:scale-105 transition-all ease-in"
          :class="turnPage ? 'invisible' : 'block'"
        />
        <TrashIcon
          @click="close"
          class="w-10 xl:w-10 cursor-pointer text-red-800 py-4 hover:text-red-600 hover:scale-105 transition-all ease-in"
          :class="turnPage ? 'invisible' : 'block'"
        />
      </div>
      <div class="relative h-[26rem] xl:h-[36rem] my-auto">
        <div
          class="relative bg-white px-8 pb-1 pt-6 xl:p-10 rounded-xs flex flex-col gap-2 shadow-sm shadow-stone-600 h-full border border-stone-400"
        >
          <Transition :duration="1000">
            <div v-if="!turnPage" class="h-full flex flex-col">
              <div class="flex gap-4">
                <div class="relative basis-2/3 -ml-2">
                  <!-- <div class="absolute top-0 left-0 w-1/6 h-1/4 border-l-2 border-t-4 xl:border-l-4 xl:border-t-8 border-stone-600 " /> -->
                  <img
                    :src="postData.images[0].url"
                    :alt="postData.images[0].filename"
                    class="rounded-sm xl:w-[36rem] z-10 shadow-sm shadow-stone-600"
                  />
                </div>
                <div
                  class="flex-1 h-full pt-4 flex flex-col items-center text-stone-700 border-b-4 border-stone-600"
                >
                  <h2 class="text-2xl font-bold text-center xl:text-3xl">
                    {{ postData.title }}
                  </h2>
                  <p
                    class="text-sm text-center text-stone-500 py-2 xl:py-4 xl:text-xl"
                  >
                    {{ postData.location }}
                  </p>
                  <p
                    class="w-full max-h-60 p-4 italic text-center flex justify-center my-auto overflow-auto xl:text-xl"
                  >
                    {{ postData.description }}
                  </p>
                </div>
              </div>
              <div class="flex gap-4 justify-between italic xl:mt-4">
                <div class="flex items-center py-2 gap-2">
                  <div
                    class="border border-stone-800 rounded-full bg-white w-10 h-10 xl:w-14 xl:h-14 p-1 flex items-center justify-center"
                  >
                    <img
                      class="rounded-full"
                      :src="`/assets/img/avatar (${postAuthorData.selectedAvatarIndex!}).png`"
                      alt="avatar"
                    />
                  </div>
                  <div class="flex items-baseline">
                    <p
                      class="text-stone-600 xl:text-xl xl:text-stone-700 font-bold"
                    >
                      {{ postAuthorData.username! }}
                    </p>
                    <p
                      v-if="postData.createdAt"
                      class="text-stone-600 xl:text-base text-sm"
                    >
                      -- {{ formatDateTime(postData.createdAt) }}
                    </p>
                    <p
                      v-if="!postData.isEdit"
                      class="text-stone-600 xl:text-base text-sm"
                    >
                      發布
                    </p>
                    <p v-else class="text-stone-600 xl:text-base text-sm">
                      已編輯
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <span
                    class="flex items-center gap-1 xl:text-lg text-blue-900"
                  >
                    <EyeIcon class="w-6 xl:w-8" />
                    <span>{{ postData.views }}</span>
                  </span>
                  <span
                    class="flex items-center gap-1 xl:text-lg group"
                    :class="isLiked ? 'text-red-500' : 'text-stone-700'"
                  >
                    <HeartIcon
                      @click="handleLikes"
                      class="w-6 xl:w-8 cursor-pointer group-hover:scale-105 transition-all duration-500"
                    />
                    <span class="transition-all duration-500">{{
                      postData.likes
                    }}</span>
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="xl:w-[calc(100%-2.5rem)] h-full absolute top-0">
              <div
                class="flex justify-around xl:pr-10 items-center h-full p-4 xl:py-8 xl:px-0"
              >
                <div
                  class="imgList basis-1/4 xl:basis-1/3 overflow-hidden overflow-y-auto h-full flex flex-col gap-4 xl:gap-10 p-2 xl:px-0"
                >
                  <div
                    v-for="(picture, index) in postData.images"
                    @click="pictureIndex = index"
                    class="relative cursor-pointer hover:scale-[105%] xl:hover:scale-100 transition-all duration-500 border-4 border-stone-400 focus:border-stone-700"
                    tabindex="0"
                  >
                    <img
                      :src="picture.url"
                      :alt="picture.filename"
                      class="relative z-10 shadow-sm shadow-stone-600"
                    />
                  </div>
                  <div
                    v-if="postData.images.length === 1"
                    class="flex items-center justify-center xl:h-80 border-4 border-dashed border-stone-200 py-10 xl:py-28 xl:text-2xl text-stone-400"
                  >
                    <p>沒有更多的圖了</p>
                  </div>
                  <div
                    class="flex items-center justify-center xl:h-80 border-4 border-dashed border-stone-200 py-10 xl:py-28 xl:text-2xl text-stone-400"
                  >
                    <p>沒有更多的圖了</p>
                  </div>
                </div>

                <div
                  class="bigImg border-4 border-b-2 border-stone-600 rounded-sm"
                >
                  <img
                    :src="postData.images[pictureIndex].url"
                    :alt="postData.images[pictureIndex].filename"
                    class="relative z-10 shadow-sm shadow-stone-600 xl:w-[36rem]"
                  />
                </div>
              </div>
            </div>
          </Transition>
        </div>
        <div
          @click="turnPage = !turnPage"
          class="absolute top-2 left-0 shadow-sm shadow-stone-600 rotate-[3deg] w-full h-full -z-10 bg-white cursor-pointer hover:top-4 transition-all duration-500"
        ></div>
      </div>
      <div class="w-full self-center flex justify-around xl:mb-4">
        <XCircleIcon
          @click="close"
          class="w-12 xl:w-16 cursor-pointer text-white mx-auto py-4 hover:scale-105 transition-all ease-in"
        />
      </div>
    </div>
  </div>
  <Transition
    enter-active-class="transition ease-in duration-150 delay-0"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-150 delay-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-1"
  >
    <Dialog
      v-if="showDialog"
      :dialogData="dialogData"
      @closePopup="(choice: boolean) => userChoice = choice"
    />
  </Transition>
</template>
../../api/photoPostComment.ts../../api/photoPostComment.ts../../api/comment/photoPostComment.ts../../api/comment/photoPostComment.ts../../api/photoPost/photoPostComment.ts../../api/photoPost/photoPostComment.ts../../api/user/user.ts
