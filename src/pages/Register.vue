<script setup lang="ts">
import { ref, watch } from 'vue';
import {
    ExclamationCircleIcon,
} from '@heroicons/vue/24/solid';
import { useRouter } from 'vue-router';
import { useLoadingStore } from '../store/loading';
import { useUserStore } from '../store/user';
import { postUserData } from '../api/user.ts';
import { FieldName, userDataInputValidator } from '../utils/validator';

const loadingStore = useLoadingStore();
const router = useRouter();

const topicTags = {
    ecology: {
        color: "#A89376",
        tag: [
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
        tag: [
            "動物行為",
            "遷徒",
            "奇特行為",
            "攝影技巧",
        ],
    },
    geographicalFeatures: {
        color: "#B7AFA6",
        tag: [
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
        tag: [
            "自然風景",
            "夜間攝影",
            "微距攝影",
            "野外探險",
            "地理風貌",
        ],
    },
    issue: {
        color: "#22577A",
        tag: [
            "環境保育",
            "全球生態",
            "嚴重議題",
        ],
    },
    geolocation: {
        color: "#F4B860",
        tag: [
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

//表單註冊
const formInput = ref({
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    selectedAvatarIndex: Math.floor(Math.random() * 12) + 1
});


////表單註冊-頭像
const showAvatarSelector = ref<boolean>(false);

////表單註冊-主題
const selectedTags = ref<string[]>([]);

////表單註冊-驗證
const validator = userDataInputValidator();
const validateInput = (fieldName: FieldName) => { //重新包裝validator
    validator.validate(fieldName, formInput.value)
}
////表單註冊-提交
const handleRegisterSuccess = (email: string, password: string) => {
    const userStore = useUserStore();
    console.log(userStore.login);
    userStore.login(email, password);
    router.push('Articles');
}

async function handleSubmit() {
    loadingStore.setLoadingStatus(true);
    loadingStore.setInRequest(true);
    loadingStore.setIsCountingSeconds(true);
    loadingStore.setIsCountingSeconds(false);
    const submitFormData = {
        email: formInput.value.email,
        username: formInput.value.username,
        password: formInput.value.password,
        selectedAvatarIndex: formInput.value.selectedAvatarIndex,
        selectedTags: selectedTags.value
    };

    await postUserData(submitFormData)
        .catch((err) => {
            console.log(`postUserData 失敗: ${err}`);
        })
    loadingStore.setInRequest(false);
    loadingStore.setLoadingStatus(false);

    handleRegisterSuccess(submitFormData.email, submitFormData.password);
}

////表單註冊-交互流程
const finished = ref<boolean>(true);
const formStep = ref<number>(0);
const formInputInvalid = validator.formInputInvalid;
const nextStep = () => {
    if (formStep.value === 0) {
        validateInput('email');
        validateInput('username');
        if (!formInputInvalid.value.email.valid || formInputInvalid.value.email.registered || !formInputInvalid.value.username) {
            return;
        }
    } else if (formStep.value === 1) {
        validateInput('password');
        validateInput('passwordConfirm');
        if (!formInputInvalid.value.password || !formInputInvalid.value.passwordConfirm) {
            return;
        }
    }
    formStep.value++;
};
const previousStep = () => { formStep.value-- };

//右側tab互動效果
const button = ref<HTMLButtonElement | null>();
const nav = ref<HTMLButtonElement | null>();
enum Tab {
    Tab1 = 0,
    Tab2 = 1,
    Tab3 = 2
};

const activeTab = ref<Tab>(Tab.Tab1);
const addTabClass = (index: number) => {
    activeTab.value = index;
};

watch(activeTab, () => {
    Array.from(nav.value?.children || []).forEach((item, index) => {
        if (index === activeTab.value) {
            item.classList.add('text-white', 'border-white', 'border-b-2', 'scale-110');
        } else {
            item.classList.remove('text-white', 'border-white', 'border-b-2', 'scale-110');
        }
    });
});
</script>

<template>
    <div class="relative flex h-screen w-screen overflow-hidden">
        <div class="loginForm min-w-fit bg-stone-700 opacity-95 flex flex-col items-center w-96 gap-10">
            <div class="mt-8">
                <div class="flex-1 flex items-center border-4 border-white p-4 w-fit mx-auto">
                    <img src="/assets/img/deerIcon.png" alt="deerIcon" class="w-16">
                </div>
                <span class="text-white text-3xl font-bold">WILDLENS</span>
            </div>
            <form method="POST" autocomplete="off" @submit.prevent="handleSubmit"
                class="text-white flex flex-col items-center gap-6 w-80">
                <div class="formContent w-full">
                    <div v-if="formStep === 0" class="step1 flex flex-col gap-6">
                        <div class="relative mb-3 text-center flex flex-col bg-[#61606058] px-2 pt-1 pb-0 border-2"
                            :class="formInputInvalid.email.valid || formInputInvalid.email.registered ? 'border-transparent' : 'border-red-500 pb-1'">
                            <div class="border-b-2 border-stone-300 flex gap-2 w-full py-1"
                                :class="formInputInvalid.email.valid || formInputInvalid.email.registered ? '' : 'border-none'">
                                <label class="text-gray-200 opacity-80" for="email">信&emsp;&emsp;箱 :</label>
                                <input v-model="formInput.email" @blur="validateInput('email')"
                                    class="border-0 focus:ring-0 focus:outline-none bg-transparent w-48 text-sm" type="text"
                                    placeholder="請輸入有效信箱" name="email" id="email" required autocomplete="autocomplete_off">
                            </div>
                            <div v-if="!formInputInvalid.email.valid"
                                class="w-full absolute left-0 -top-6 flex items-center justify-center gap-1 text-sm text-red-500">
                                <ExclamationCircleIcon class="w-4" />
                                <p>請輸入有效信箱</p>
                            </div>
                            <div v-else-if="formInputInvalid.email.registered"
                                class="w-full absolute left-0 -top-6 flex items-center justify-center gap-1 text-sm text-red-500">
                                <ExclamationCircleIcon class="w-4" />
                                <p>此信箱已被註冊</p>
                            </div>
                        </div>
                        <div class="relative mb-3 text-center flex flex-col bg-[#61606058] px-2 pt-1 pb-0 border-2"
                            :class="formInputInvalid.username ? 'border-transparent' : 'border-red-500 pb-1'">
                            <div class="border-b-2 border-stone-300 flex gap-2 w-full py-1"
                                :class="formInputInvalid.username ? '' : 'border-none'">
                                <label class="text-gray-200 opacity-80" for="username">用戶暱稱 :</label>
                                <input v-model="formInput.username" @blur="validateInput('username')"
                                    class="border-0 focus:ring-0 focus:outline-none bg-transparent w-48 text-sm" type="text"
                                    placeholder="2~7字" name="username" id="username" required
                                    autocomplete="autocomplete_off">
                            </div>
                            <div v-if="!formInputInvalid.username"
                                class="w-full absolute left-0 -top-6 flex justify-center items-center gap-1 text-sm text-red-500">
                                <ExclamationCircleIcon class="w-4" />
                                <p>請輸入有效暱稱</p>
                            </div>
                        </div>
                    </div>
                    <div v-if="formStep === 1" class="step2 flex flex-col gap-6">
                        <div class="relative mb-3 text-center flex flex-col bg-[#61606058] px-2 pt-1 pb-0 border-2"
                            :class="formInputInvalid.password ? 'border-transparent' : 'border-red-500 pb-1'">
                            <div class="border-b-2 border-stone-300 flex gap-2 w-full py-1"
                                :class="formInputInvalid.password ? '' : 'border-none'">
                                <label class="text-gray-200 opacity-80" for="password">密&emsp;&emsp;碼 :</label>
                                <input v-model="formInput.password" @blur="validateInput('password')" placeholder="6 ~ 15字"
                                    class="border-0 focus:ring-0 focus:outline-none bg-transparent w-48 text-sm"
                                    type="password" name="password" id="password" required autocomplete="new-password">
                            </div>
                            <div v-if="!formInputInvalid.password"
                                class="w-full absolute left-0 -top-6 flex justify-center items-center gap-1 text-sm text-red-500">
                                <ExclamationCircleIcon class="w-4" />
                                <p>請輸入六個字以上的有效密碼</p>
                            </div>
                        </div>
                        <div class="relative mb-3 text-center flex flex-col bg-[#61606058] px-2 pt-1 pb-0 border-2"
                            :class="formInputInvalid.passwordConfirm ? 'border-transparent' : 'border-red-500 pb-1'">
                            <div class="border-b-2 border-stone-300 flex gap-2 w-full py-1"
                                :class="formInputInvalid.passwordConfirm ? '' : 'border-none'">
                                <label class="text-gray-200 opacity-80" for="passwordConfirm">密碼確認 :</label>
                                <input v-model="formInput.passwordConfirm" @blur="validateInput('passwordConfirm')"
                                    placeholder="6 ~ 15字"
                                    class="border-0 focus:ring-0 focus:outline-none bg-transparent w-48 text-sm"
                                    type="password" name="passwordConfirm" id="passwordConfirm" required
                                    autocomplete="new-password">
                            </div>
                            <div v-if="!formInputInvalid.passwordConfirm"
                                class="w-full absolute left-0 -top-6 flex justify-center items-center gap-1 text-sm text-red-500">
                                <ExclamationCircleIcon class="w-4" />
                                <p>請輸入與上方相同之密碼</p>
                            </div>

                        </div>
                    </div>
                    <div v-if="formStep === 2" class="step3 flex flex-col items-center gap-4 -mt-4 mb-8">
                        <div class="bg-stone-100 border-2 border-dashed border-stone-700 w-32">
                            <img class=" p-3"
                                :src="`../../public//assets/img/avatar (${formInput.selectedAvatarIndex}).png`" alt="">
                        </div>
                        <button @click="showAvatarSelector = true" type="button"
                            class="w-32 bg-stone-600 text-white px-4 py-2 hover:bg-stone-500 focus:outline-none tracking-widest transition-all duration-500">
                            選擇頭像
                        </button>
                    </div>
                    <div v-if="formStep === 3" class="step4 flex flex-col -mt-4 mb-2 w-full">
                        <p
                            class="w-full bg-stone-500 text-stone-100 px-4 py-2 text-center border border-stone-500 border-b-0">
                            挑選一些感興趣的主題
                        </p>
                        <div
                            class="overflow-auto flex items-center justify-center flex-wrap w-full h-40 border border-stone-500 p-2 bg-stone-600 border-t-0">
                            <div class="flex items-center justify-center flex-wrap" v-for="topic in topicTags">
                                <label v-for="tag in topic.tag" class="border p-1 m-1 bg-stone-600"
                                    :style="selectedTags.includes(tag) ? `background-color:${topic.color}` : ''">
                                    <input type="checkbox" v-model="selectedTags" :value="tag" class="hidden">
                                    <span class="cursor-pointer">{{ tag }}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="formActions w-full flex gap-4">
                    <button @click.prevent="previousStep()" v-if="formStep !== 0" type="button"
                        class="flex-1 border-2 bg-stone-600 border-stone-100 text-white px-4 py-2 hover:bg-stone-100 hover:text-stone-800 focus:outline-none tracking-widest transition-all duration-500">
                        上一步
                    </button>
                    <button v-if="formStep !== 3" @click.prevent="nextStep" type="button"
                        class="flex-1 bg-stone-600 border-2 border-stone-100 text-white px-4 py-2 hover:bg-stone-100 hover:text-stone-800 focus:outline-none tracking-widest transition-all duration-500">
                        下一步
                    </button>
                    <button v-else :disabled="!finished" type="submit"
                        class="flex-1 bg-stone-600 border-2 border-stone-100 text-white px-4 py-2 hover:bg-stone-100 hover:text-stone-800 focus:outline-none tracking-widest transition-all duration-500">
                        註冊
                    </button>
                </div>
                <button v-if="formStep !== 2" type="button"
                    class="w-full bg-[#FF5722] text-white border-2 border-[#FF5722] px-4 py-2 opacity-90 hover:bg-[#FF5722] hover:opacity-100 transition-all duration-500">
                    使用Google帳號註冊
                </button>
                <router-link :to="{ name: 'Login' }">
                    <div class="text-sm underline">已有帳號?</div>
                </router-link>
            </form>
        </div>
        <div
            class="relative banner font-Raleway flex flex-col items-center justify-start gap-10 flex-grow h-screen bg-white text-stone-100 bg-register bg-no-repeat bg-cover bg-center text-shadow-md shadow-inner">
            <div class="flex flex-col items-center gap-10 py-16 px-4 w-full">
                <div ref="nav" class="flex gap-16 font-semibold text-[#ffffff9e] text-2xl">
                    <button @mouseover="addTabClass(0)"
                        class="transition duration-500 border-white border-b-2 scale-110">探索</button>
                    <button @mouseover="addTabClass(1)" class="transition duration-500">紀錄</button>
                    <button @mouseover="addTabClass(2)" class="transition duration-500">分享</button>
                </div>
                <div class="w-full h-52 flex flex-col items-center relative mt-20">
                    <transition>
                        <div v-if="activeTab == 0" class="w-full flex flex-col items-center absolute top-0">
                            <h2 class="text-8xl mb-4 font-Cormorant tracking-tighter">探索&nbsp;&nbsp;視界.</h2>
                            <p class="text-lg tracking-wide text-center">這個廣大壯闊的世界，還有多少你未曾發現的事物?</p>
                            <p class="text-lg tracking-wide text-center">以全新的視野，重新走進這個世界，發掘那些你從前不曾留意過的美麗</p>
                        </div>
                    </transition>
                    <transition>
                        <div v-if="activeTab == 1" class="flex flex-col items-center absolute top-0">
                            <h2 class="text-8xl mb-4 font-Cormorant tracking-tighter">紀錄&nbsp;&nbsp;冒險.</h2>
                            <p class="text-lg tracking-wide">無論大或小，每一段記憶都值得被好好珍藏</p>
                            <p class="text-lg tracking-wide">從這裡開始，和我們一起，紀錄下那些獨一無二的獨特時光</p>
                        </div>
                    </transition>
                    <transition>
                        <div v-if="activeTab == 2" class="flex flex-col items-center absolute top-0">
                            <h2 class="text-8xl mb-4 font-Cormorant tracking-tighter">分享&nbsp;&nbsp;體驗.</h2>
                            <p class="text-lg tracking-wide text-center">將你的感動化成照片和文字，與世界各地的人們交流</p>
                            <p class="text-lg tracking-wide text-center">分享的力量是無限的，將你的所見傳遞給出去，彼此的距離因此變得不再遙遠</p>
                        </div>
                    </transition>
                </div>
                <div class="absolute bottom-10 flex justify-end w-full gap-4 pr-4">

                    <router-link :to="{ name: 'Articles' }">
                        <button
                            class="text-white py-2 px-4 hover:bg-stone-100 hover:text-stone-600 tracking-widest transition-all duration-500">
                            返回主頁
                        </button>
                    </router-link>
                    <router-link :to="{ name: 'Help' }">
                        <button
                            class="border-2 border-stone-100 text-stone-100 py-2 px-4 hover:bg-stone-100 hover:text-stone-600 tracking-widest transition-all duration-500">
                            聯絡我們
                        </button>
                    </router-link>
                </div>
            </div>
            <Transition name="avatarSelector" enter-active-class="animate-slideInRight"
                leave-active-class="animate-slideInRightBack">
                <div v-if="showAvatarSelector"
                    class="absolute top-0 left-0 w-full h-full bg-stone-700 bg-opacity-60 flex justify-center items-center">
                    <div
                        class="flex z-10 bg-white flex-col items-center justify-around gap-4 pt-4 pb-10 px-16 w-full h-full overflow-auto">
                        <p class="block text-stone-700 text-xl font-bold tracking-widest">選擇頭像</p>
                        <div class="grid grid-cols-6 gap-4 p-4">
                            <div v-for="index in 12" :key="index">
                                <label class="cursor-pointer">
                                    <input class="hidden" type="radio" :value="index" name="avatar"
                                        v-model="formInput.selectedAvatarIndex" />
                                    <div
                                        class="p-1 border-2 border-dashed border-stone-600 hover:scale-105 transition-all duration-300 hover:border-solid group focus-within:border-solid focus-within:border-[3px]">
                                        <img class="sm:w-16 md:w-20 lg:w-32 w-12 focus:scale-110 transition-all duration-300"
                                            :src="`../../public//assets/img/avatar (${index}).png`" alt="" tabindex="0">
                                    </div>

                                </label>
                            </div>
                        </div>
                        <button @click="showAvatarSelector = false"
                            class="w-full bg-stone-600 font-bold px-4 py-3 hover:bg-stone-700 text-white focus:outline-none tracking-widest transition-all duration-500">
                            完成
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>../utils/validator.ts