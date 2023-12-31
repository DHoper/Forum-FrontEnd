<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import router from "../../router";
import mapboxgl from "mapbox-gl";
import MapBoxGeoCoder from "@mapbox/mapbox-gl-geocoder";
import MapBoxLanguage from "@mapbox/mapbox-gl-language";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/lib/mapbox-gl-geocoder.css";
import {
  EyeIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/vue/24/outline";
import { TrashIcon } from "@heroicons/vue/24/solid";
import { PhotoPostType, PhotoPostImageType, DialogType } from "../../types.ts";
import { useUserStore } from "../../store/user.ts";
import { useLoadingStore } from "../../store/loading";
import { updatePost, getPostData } from "../../api/photoPost/photoPost.ts";
import { deleteImages, postImages } from "../../api/image/image";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const postData = ref<PhotoPostType>();
const fetchPostData = async () => {
  const responseData = await getPostData(props.id);
  if (responseData.value) {
    postData.value = responseData.value;

    if (postData.value) {
      for (const image of postData.value.images) {
        oldUrls.value.push(image.url);
      }
    }
  }
};

//----cloudinary&圖片預覽----
const previewImgIndex = ref<number>(0); //紀錄所選預覽大圖

const imgInput = ref<HTMLInputElement>();
const inputUrls = ref<string[]>([]);
const oldUrls = ref<string[]>([]);
const previewUrls = computed(() => {
  return oldUrls.value.concat(inputUrls.value);
});

const showPreview = ref<boolean>(false);

const previewImages = () => {
  previewImgIndex.value = 0;
  inputUrls.value = [];
  if (imgInput.value) {
    const inputElement = imgInput.value;
    if (inputElement.files) {
      const selectedFiles = Array.from(inputElement.files);
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      for (const url of urls) {
        inputUrls.value.push(url);
      }
    }
  }
};

const handleSelectDeleteImage = () => {
  oldUrls.value.splice(previewImgIndex.value, 1);
  previewImgIndex.value = 0;
};

let updatePostImages: PhotoPostImageType[] = []; //儲存最終提交之圖片url
const uploadImages = async () => {
  const inputElement = imgInput.value;

  if (inputElement && postData.value) {
    const files = inputElement.files as FileList;

    updatePostImages = await postImages(files, "Animal-World");

    for (const image of postData.value.images) {
      if (previewUrls.value.includes(image.url)) {
        updatePostImages.unshift(image);
      }
    }
  }
};

const setDeleteImagesPublicIds = () => {
  if (!postData.value) return;
  const publicIds: string[] = [];
  for (const image of postData.value.images) {
    if (!oldUrls.value.includes(image.url)) publicIds.push(image.filename);
  }
  return publicIds;
};

//----mapbox地圖----
mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_TOKEN;

const mapContainer = ref<HTMLElement | null>(null);

//----表單----

//表單提交驗證失敗彈窗
const showDialog = ref(false);
const dialogData = ref<DialogType>({
  title: "",
  content: "",
  warringStyle: false,
});

////表單驗證
type FieldName = "title" | "description";
const postInputInvalid = ref({
  title: true,
  description: true,
});

function countCharacters(text: string) {
  let totalWeight = 0;
  for (const char of text) {
    if (/[\u4e00-\u9fa5\u3100-\u312F]/.test(char)) {
      totalWeight += 2;
    } else if (/^[A-Za-z0-9]+$/.test(char)) {
      totalWeight += 1;
    } else if (/[\「」{}.,;:!?-、...。，；：！？_、，"'：]/.test(char)) {
      totalWeight += 1;
    } else {
      totalWeight += 10000;
    }
  }
  return totalWeight;
}

async function validateInput(fieldName: FieldName) {
  if (postData.value) {
    let isValid = true;
    let value = postData.value[fieldName];

    value = value.replace(/\s/g, "");
    let totalCharacters = countCharacters(value);
    switch (fieldName) {
      case "title":
        isValid = totalCharacters >= 4 && totalCharacters <= 30;
        break;
      case "description":
        isValid = totalCharacters >= 10 && totalCharacters <= 200;
        break;
      default:
        break;
    }
    postInputInvalid.value[fieldName] = isValid;
  }
}

////表單提交
const submitEditedPost = async () => {
  if (!postData.value) return;
  const loadingStore = useLoadingStore(); //loading動畫設置
  loadingStore.setLoadingStatus(true);
  loadingStore.setInRequest(true);
  loadingStore.setIsCountingSeconds(true);
  loadingStore.setIsCountingSeconds(false);

  const userStore = useUserStore();
  if (!userStore.isLogin || !userStore.getData()) {
    router.push({ name: "Login" });
    return;
  }

  const publicIds = setDeleteImagesPublicIds();
  if (publicIds && publicIds.length > 0) {
    await deleteImages(publicIds);
  }

  await uploadImages();
  const submitForm: PhotoPostType = {
    authorId: postData.value.authorId,
    title: postData.value.title,
    location: postData.value.location,
    geometry: {
      type: "point",
      coordinates: postData.value.geometry.coordinates,
    },
    description: postData.value.description,
    images: updatePostImages,
    views: 0,
    likes: 0,
    commentsId: [],
    isEdit: false,
  };

  await updatePost(postData.value._id!, submitForm).catch((err) =>
    console.error("編輯時貼文出錯:", err)
  );
  dialogData.value.title = "貼文編輯成功";
  dialogData.value.content = "您的貼文已更新";
  dialogData.value.warringStyle = false;
  showDialog.value = true;
  loadingStore.setInRequest(false);
  loadingStore.setLoadingStatus(false);

  await new Promise((resolve) => {
    watch(showDialog, (newValue) => {
      if (!newValue) {
        resolve(true);
      }
    });
  });
  router.push({ name: "PersonalPosts" });
};

const handleSubmit = async () => {
  if (postData.value) {
    //驗證失敗
    if (!imgInput.value) {
      return;
    }
    const verification =
      postInputInvalid.value.title &&
      postInputInvalid.value.description &&
      previewUrls.value.length &&
      postData.value.location;
    if (!verification) {
      dialogData.value.title = "貼文編輯失敗";
      dialogData.value.warringStyle = true;
      if (!postData.value.location) {
        dialogData.value.content = "請選擇照片拍攝之地點";
      } else if (!postInputInvalid.value.title) {
        dialogData.value.content = "請填入正確格式之標題";
      } else if (!postInputInvalid.value.description) {
        dialogData.value.content = "請填入正確格式之敘述";
      } else if (!previewUrls.value.length) {
        dialogData.value.content = "請至少上傳一張圖片";
      }
      showDialog.value = true;
      return;
    }

    //驗證成功
    await submitEditedPost();
  }
};

onMounted(async () => {
  await fetchPostData();

  const map = new mapboxgl.Map({
    container: mapContainer.value!,
    style: "mapbox://styles/mapbox/light-v10",
    center: [120.93874358912397, 23.92239934359359],
    zoom: 3,
    interactive: false,
  });

  const language = new MapBoxLanguage({ defaultLanguage: "zh-Hant" });
  map.addControl(language);

  const geoCoder = new MapBoxGeoCoder({
    accessToken: mapboxgl.accessToken,
    language: "zh-TW",
    marker: true,
    types: "country, region",
    mapboxgl: mapboxgl,
  });

  map.addControl(geoCoder);

  geoCoder.on("result", (event: mapboxgl.EventData) => {
    if (postData.value) {
      postData.value.location = event.result.place_name;
      postData.value.geometry.coordinates = event.result.center;
    }
  });
});
</script>

<template>
  <div v-if="postData" class="flex-1 bg-stone-100">
    <div
      class="w-[60rem] mx-auto bg-stone-100 flex flex-col overflow-auto my-12 gap-4 border-4 border-stone-700"
    >
      <div class="flex flex-col items-center mt-10 px-10">
        <h3 class="text-xl 2xl:text-3xl font-bold">新照片</h3>
        <div class="border-t-2 my-4 mt-10 border-stone-500 w-full"></div>
      </div>
      <form
        method="POST"
        autocomplete="off"
        @submit.prevent="handleSubmit"
        class="flex-1 w-full flex flex-col gap-10"
      >
        <div class="flex flex-col items-center gap-8 px-10">
          <div
            class="contentBlock flex flex-col items-center gap-8 w-full text-stone-700"
          >
            <div class="relative w-[400px] flex flex-col items-center gap-2">
              <label for="title" class="text-lg 2xl:text-xl 2xl:p-4 font-bold"
                >標題</label
              >
              <input
                v-model="postData.title"
                @blur="validateInput('title')"
                type="text"
                id="title"
                class="w-full p-2 border-2 focus:border-stone-500 focus:outline-none text-stone-700 2xl:text-lg 2xl:px-4"
                :class="
                  postInputInvalid.title ? 'border-stone-600' : 'border-red-500'
                "
                placeholder="2~15字"
                required
              />
              <div
                v-if="!postInputInvalid.title"
                class="w-full absolute left-0 -bottom-6 flex justify-center items-center gap-1 text-sm 2xl:text-base 2xl:-bottom-7 text-red-500"
              >
                <ExclamationCircleIcon class="w-4" />
                <p>請輸入2 ~ 15字之標題</p>
              </div>
            </div>
            <div class="relative w-[400px] flex flex-col items-center gap-2">
              <label
                for="description"
                class="block text-lg 2xl:text-xl 2xl:p-4 font-bold"
                >簡短描述</label
              >
              <textarea
                v-model="postData.description"
                @blur="validateInput('description')"
                id="description"
                rows="4"
                maxlength="100"
                class="w-full border-2 resize-none focus:border-stone-500 focus:outline-none text-stone-700 p-2 2xl:text-lg 2xl:p-4"
                :class="
                  postInputInvalid.description
                    ? 'border-stone-600'
                    : 'border-red-500'
                "
                placeholder="5~100字(中英2:1)"
                required
              ></textarea>
              <div
                v-if="!postInputInvalid.description"
                class="w-full absolute left-0 -bottom-6 flex justify-center items-center gap-1 text-sm 2xl:text-base 2xl:-bottom-7 text-red-500"
              >
                <ExclamationCircleIcon class="w-4" />
                <p>請輸入5 ~ 100字之內容</p>
              </div>
            </div>
          </div>
          <div class="imgBlock flex flex-col items-center gap-4 w-full">
            <div class="border-t-2 border-stone-500 w-full" />
            <div
              class="mt-4 flex flex-col items-center gap-2 text-sm leading-6 text-gray-600"
            >
              <div
                v-if="previewUrls.length > 0"
                class="relative border-4 border-stone-500 rounded-sm w-[400px] h-[300px] bg-stone-100 cursor-pointer"
              >
                <img
                  :src="previewUrls[previewImgIndex]"
                  alt=""
                  class="w-full h-full object-cover rounded-sm"
                />
                <EyeIcon
                  class="absolute top-2 right-2 w-8 z-10 text-stone-100 hover:scale-110"
                  @click="showPreview = true"
                />
                <TrashIcon
                  v-if="
                    postData.images.some(
                      (image) => image.url === previewUrls[previewImgIndex]
                    )
                  "
                  @click="handleSelectDeleteImage"
                  class="absolute bottom-2 right-2 w-8 z-10 text-red-600 hover:scale-105 transition-all duration-300"
                />
                <Transition
                  name="previewImgIndex"
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="opacity-0"
                  enter-to-class="opacity-100"
                  leave-active-class="transition ease-in duration-300"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <div
                    v-if="showPreview"
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] 2xl:w-[800px] 2xl:h-[600px] border-4 border-stone-500 rounded-sm z-10"
                  >
                    <img
                      :src="previewUrls[previewImgIndex]"
                      alt="Preview"
                      class="w-full h-full object-cover rounded-sm"
                    />
                    <XCircleIcon
                      class="w-8 text-stone-100 absolute top-1 right-1 hover:scale-105"
                      @click="showPreview = false"
                    />
                  </div>
                </Transition>
              </div>
              <div
                v-else
                class="flex justify-center items-center border-4 border-dashed border-stone-500 rounded-sm w-[400px] h-[300px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-14 h-14 text-stone-300"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <label
                for="imgUpload"
                class="relative cursor-pointer bg-stone-100 w-full"
              >
                <span
                  type="button"
                  class="bg-stone-600 text-stone-100 p-2 w-full font-bold hover:bg-stone-700 transition-all duration-300 text-center text-lg 2xl:text-xl"
                  >選擇圖片</span
                >
                <input
                  ref="imgInput"
                  id="imgUpload"
                  name="imgUpload"
                  type="file"
                  class="sr-only"
                  @change="previewImages"
                  multiple
                />
              </label>
            </div>
            <div class="previewRows flex gap-3 w-full overflow-auto p-1">
              <div v-if="previewUrls.length > 0" class="flex gap-3 mx-auto">
                <div
                  v-for="(url, index) in previewUrls"
                  class="border-4 rounded-sm w-[140px] h-[105px] bg-stone-500"
                  :class="
                    previewImgIndex === index
                      ? 'border-stone-500 border-solid'
                      : 'border-dashed border-stone-600 '
                  "
                >
                  <img
                    :src="url"
                    :key="index"
                    @click="previewImgIndex = index"
                    class="w-full h-full object-cover rounded-sm cursor-pointer"
                  />
                </div>
                <div class="flex gap-3">
                  <div
                    class="border-4 border-dashed border-stone-600 rounded-sm w-[140px] h-[105px] flex items-center justify-center text-stone-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-10 h-10 text-stone-300"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div v-else class="flex gap-3 mx-auto">
                <div
                  v-for=" in 5"
                  class="border-4 border-dashed border-stone-600 rounded-sm w-[140px] h-[105px] flex items-center justify-center text-stone-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-10 h-10"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div
            class="mapBlock w-full flex flex-col items-center border-stone-700 border-2"
          >
            <input
              v-model="postData.location"
              type="text"
              id="location"
              placeholder="請選擇照片拍攝地點"
              class="w-full p-2 pointer-events-none bg-white text-center 2xl:text-lg tracking-wide border-b-2 border-stone-600 border-dashed"
              required
              readonly
            />
            <div ref="mapContainer" class="w-full h-80 2xl:h-96"></div>
          </div>
        </div>
        <button
          type="submit"
          class="w-full bg-stone-700 text-stone-100 px-4 py-2 basis-1 text-lg 2xl:text-xl font-bold hover:text-white transition-all duration-300"
        >
          發佈
        </button>
      </form>
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
      @closePopup="showDialog = false"
    />
  </Transition>
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
