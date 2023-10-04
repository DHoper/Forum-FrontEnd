<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '../../store/user';
import {
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/vue';
import {
    UserIcon,
    BookmarkSquareIcon,
    HeartIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    BellIcon
} from '@heroicons/vue/24/outline';

const userStore = useUserStore();
console.log(333, userStore.userData);

const isLogin = computed<boolean>(() => userStore.isLogin);

const userActions = [
    { action: '個人資訊', href: '#', icon: UserIcon },
    { action: '貼文', href: '#', icon: BookmarkSquareIcon },
    { action: '追蹤', href: '#', icon: HeartIcon },
    { action: '設定', href: '#', icon: Cog6ToothIcon },
    { action: '幫助', href: '#', icon: QuestionMarkCircleIcon },
]

const notifications = [
    { content: '有人喜歡妳在"我的靴子裡有蛇"的留言: 「笑死,我就看他什麼時候摔下去」', href: '#' },
    { content: 'Molina123 為你的一則貼文點了讚', href: '#' },
    { content: 'Fain64543 為你的一則貼文點了讚', href: '#' },
    { content: 'Ol34i2 開始追蹤您', href: '#' },
    { content: 'Albert34442 喜歡妳在"我的靴子裡有蛇"的留言', href: '#' },
]

</script>

<template>
    <nav class="sticky font-Cormorant top-0 w-full bg-stone-600 text-white px-4 pl-6 py-2 flex items-center justify-between z-40"
        id="navbar">
        <div class="logo flex items-center">
            <img src="/assets/img/deerIcon.png" alt="deerIcon" class="w-6 mr-0">
            <a class="ml-2 text-2xl" href="/">WILDLENS</a>
        </div>
        <div class="navbar flex items-center gap-4">
            <ul class="flex gap-3 text-lg font-thin">
                <li
                    class="border-2 border-transparent hover:border-white transition-all duration-700 ease-in-out font-bold py-0 text-white">
                    <router-link to="Articles" class="tracking-widest px-4">文章</router-link>
                </li>
                <li
                    class="border-2 border-transparent hover:border-white transition-all duration-700 ease-in-out font-bold py-0 text-white">
                    <router-link to="Explore" class="tracking-widest px-4">探索</router-link>
                </li>
                <li
                    class="border-2 border-transparent hover:border-white transition-all duration-700 ease-in-out font-bold py-0 text-white">
                    <router-link to="Gallery" class="tracking-widest px-4">照片牆</router-link>
                </li>
                <li
                    class="border-2 border-transparent hover:border-white transition-all duration-700 ease-in-out font-bold py-0 text-white">
                    <router-link to="Community" class="tracking-widest px-4">社區</router-link>
                </li>
            </ul>
            <div v-if="isLogin" class="avatar flex items-center gap-2">
                <PopoverGroup class="flex items-center gap-2">
                    <Popover>
                        <PopoverButton class="flex items-center gap-x-1 text-sm font-semibold leading-6 focus:outline-none">
                            <BellIcon class="w-6 h-6  text-white" />
                        </PopoverButton>

                        <transition enter-active-class="transition ease-out duration-200"
                            enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                            leave-active-class="transition ease-in duration-150"
                            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
                            <PopoverPanel
                                class="flex items-center flex-col absolute right-2 top-2/3  z-10 mt-3 overflow-hidden rounded bg-white shadow-lg ring-1 ring-stone-600 w-72">
                                <div class="w-full">
                                    <span
                                        class="block rounded rounded-b-none bg-stone-600 text-white border border-white p-3 px-5 font-bold w-full">通知</span>
                                    <div class="border border-white">
                                        <div v-for="notification, index in notifications" :key="index"
                                            class="p-3 px-5 text-sm leading-6 hover:bg-stone-100 text-stone-700">
                                            <div class="flex-auto">
                                                <a :href="notification.href"
                                                    class="whitespace-nowrap block overflow-hidden truncate">
                                                    {{ notification.content }}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PopoverPanel>
                        </transition>
                    </Popover>
                    <Popover>
                        <PopoverButton class="focus:outline-none">
                            <div class="rounded-full bg-white w-10 h-10 p-1 flex items-center justify-center">
                                <img class="rounded-full"
                                    :src="`../../../public/assets/img/avatar (${userStore.userData.selectedAvatarIndex}).png`"
                                    alt="avatar">
                            </div>
                        </PopoverButton>

                        <transition enter-active-class="transition ease-out duration-200"
                            enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                            leave-active-class="transition ease-in duration-150"
                            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
                            <PopoverPanel
                                class="flex items-center flex-col absolute right-2 top-2/3  z-10 mt-3  overflow-hidden rounded bg-white shadow-lg ring-1 ring-stone-600">
                                <div class="w-64">
                                    <div
                                        class="px-6 py-4 flex gap-4 bg-stone-600 rounded rounded-b-none border border-b-0 border-white">
                                        <div class="rounded-full bg-white w-16 h-16 p-2 flex items-center justify-center border border-stone-700">
                                            <img class="rounded-full"
                                                :src="`../../../public/assets/img/avatar (${userStore.userData.selectedAvatarIndex}).png`"
                                                alt="avatar">
                                        </div>
                                        <div class="flex flex-col">  
                                            <span class="text-xl font-bold">#{{ userStore.userData.username }}</span>
                                            <span class="text-sm">{{ userStore.userData.email }}</span>
                                        </div>
                                    </div>
                                    <div class="border border-white">
                                        <div v-for="userAction, index in userActions" :key="index"
                                            class="px-6 py-4 text leading-6 hover:bg-stone-200 text-stone-700">
                                            <a :href="userAction.href" class="flex-auto flex gap-2">
                                                <div class="flex flex-none items-center justify-center">
                                                    <component :is="userAction.icon" class="h-4 w-4" aria-hidden="true" />
                                                </div>
                                                <span class="whitespace-nowrap text-center block tracking-widest">
                                                    {{ userAction.action }}
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </PopoverPanel>
                        </transition>
                    </Popover>
                </PopoverGroup>
            </div>
            <button v-else
                class="text-stone-600 text-lg bg-white border-2 border-stone-600 hover:bg-[#4b493ded] hover:text-white hover:border-white transition-all duration-700 ease-in-out font-bold py-0 px-2">
                <router-link to="Login">Get started</router-link>
            </button>
        </div>
    </nav>
</template>