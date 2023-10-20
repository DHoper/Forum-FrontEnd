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
    ArrowLeftOnRectangleIcon,
    QuestionMarkCircleIcon,
    BellIcon
} from '@heroicons/vue/24/outline';

const userStore = useUserStore();

const isLogin = computed<boolean>(() => userStore.isLogin);


const userActions = [
    { actionName: '個人資訊', href: '#', icon: UserIcon },
    { actionName: '貼文', href: '#', icon: BookmarkSquareIcon },
    { actionName: '追蹤', href: '#', icon: HeartIcon },
    { actionName: '幫助', href: '#', icon: QuestionMarkCircleIcon },
    {
        actionName: '登出',
        href: '#',
        action: userStore.logout,
        icon: ArrowLeftOnRectangleIcon
    },
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
    <nav class="sticky font-Cormorant top-0 w-full bg-stone-600 text-white px-6 py-2 flex items-center justify-between z-40"
        id="navbar">
        <div class="logo flex items-center">
            <img src="/assets/img/deerIcon.png" alt="deerIcon" class="w-8 mr-0">
            <a class="ml-2 text-2xl font-bold" href="/">WILDLENS</a>
        </div>
        <div class="navbar flex items-center gap-4">
            <ul class="flex gap-3 text-lg font-thin">
                <li
                    class="border-2 border-transparent hover:border-white transition-all duration-700 ease-in-out font-bold py-1 text-white">
                    <router-link :to="{ name: 'Articles' }" class="tracking-widest px-4">文章</router-link>
                </li>
                <li
                    class="border-2 border-transparent hover:border-white transition-all duration-700 ease-in-out font-bold py-1 text-white">
                    <router-link :to="{ name: 'Explore' }" class="tracking-widest px-4">探索</router-link>
                </li>
                <li
                    class="border-2 border-transparent hover:border-white transition-all duration-700 ease-in-out font-bold py-1 text-white">
                    <router-link :to="{ name: 'Gallery' }" class="tracking-widest px-4">照片牆</router-link>
                </li>
                <li
                    class="border-2 border-transparent hover:border-white transition-all duration-700 ease-in-out font-bold py-1 text-white">
                    <router-link :to="{ name: 'Community' }" class="tracking-widest px-4">社區</router-link>
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
                            <div class="rounded-full bg-white w-12 h-12 p-1 flex items-center justify-center">
                                <img class="rounded-full"
                                    :src="`/assets/img/avatar (${userStore.userData.selectedAvatarIndex}).png`"
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
                                        <div
                                            class="rounded-full bg-white w-16 h-16 p-2 flex items-center justify-center border border-stone-700">
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
                                            class="px-6 py-4 text leading-6 hover:bg-stone-200 text-stone-700 cursor-pointer">
                                            <a v-if="userAction.href" :href="userAction.href" @click="userAction.action"
                                                class="flex-auto flex gap-2">
                                                <div class="flex flex-none items-center justify-center">
                                                    <component :is="userAction.icon" class="h-4 w-4" aria-hidden="true" />
                                                </div>
                                                <span class="whitespace-nowrap text-center block tracking-widest">
                                                    {{ userAction.actionName }}
                                                </span>
                                            </a>
                                            <div v-else class="flex-auto flex gap-2" @click="userAction.action">
                                                <div class="flex flex-none items-center justify-center">
                                                    <component :is="userAction.icon" class="h-4 w-4" aria-hidden="true" />
                                                </div>
                                                <span class="whitespace-nowrap text-center block tracking-widest">
                                                    {{ userAction.actionName }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PopoverPanel>
                        </transition>
                    </Popover>
                </PopoverGroup>
            </div>
            <button v-else
                class="text-stone-600 text-lg bg-white border-2 border-stone-600 hover:bg-[#4b493ded] hover:text-white hover:border-white transition-all duration-700 ease-in-out font-bold py-1 px-2">
                <router-link :to="{ name: 'Login' }">Get started</router-link>
            </button>
        </div>
    </nav>
</template>