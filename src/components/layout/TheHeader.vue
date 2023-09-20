<script setup lang="ts">
import { ref } from 'vue'
import {
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/vue'
import {
    UserIcon,
    BookmarkSquareIcon,
    HeartIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    BellIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
    isLogin: {
        type: Boolean,
        required: true,
    },
})

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
    <nav class="sticky font-Cormorant top-0 w-full bg-stone-600 text-white px-16 py-1 flex items-center justify-between z-50"
        id="navbar">
        <div class="logo flex items-center">
            <img src="/assets/img/deerIcon.png" alt="deerIcon" class="w-6 mr-0">
            <a class="ml-2 text-2xl" href="/">WILDLENS</a>
        </div>
        <div class="navbar flex items-center gap-4">
            <ul class="flex gap-2 text-lg font-thin">
                <li
                    class="hover:bg-white hover:text-stone-600 hover:border-white transition-all duration-700 ease-in-out font-bold py-0 px-2 text-white">
                    <router-link to="/articles" class="tracking-widest px-4">文章</router-link>
                </li>
                <li
                    class="hover:bg-white hover:text-stone-600 hover:border-white transition-all duration-700 ease-in-out font-bold py-0 px-2 text-white">
                    <router-link to="/explore" class="tracking-widest px-4">探索</router-link>
                </li>
                <li
                    class="hover:bg-white hover:text-stone-600 hover:border-white transition-all duration-700 ease-in-out font-bold py-0 px-2 text-white">
                    <router-link to="/gallery" class="tracking-widest px-4">照片牆</router-link>
                </li>
                <li
                    class="hover:bg-white hover:text-stone-600 hover:border-white transition-all duration-700 ease-in-out font-bold py-0 px-2 text-white">
                    <router-link to="/" class="tracking-widest px-4">社區</router-link>
                </li>
            </ul>
            <div v-if="props.isLogin" class="avatar flex items-center gap-2">
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
                                            class="p-3 px-5 text-sm leading-6 hover:bg-gray-100 text-gray-600">
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
                            <div class="rounded-full bg-white w-8 h-8 p-1 flex items-center justify-center">
                                <img class="border border-red rounded-full" src="/public/assets/img/deerIcon.png"
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
                                        <div class="rounded-full bg-white w-12 h-12 p-1 flex items-center justify-center">
                                            <img class=" border border-red rounded-full"
                                                src="/public/assets/img/deerIcon.png" alt="avatar">
                                        </div>
                                        <div class="flex flex-col font-bold">
                                            <span>嘟嘟嚕</span>
                                            <span>#dhoper777</span>
                                        </div>
                                    </div>
                                    <div class="border border-white">
                                        <div v-for="userAction, index in userActions" :key="index"
                                            class="px-6 py-4 text leading-6 hover:bg-black text-gray-700 hover:text-white">
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
                class="text-stone-600 text-lg bg-white border border-stone-600 hover:bg-[#4b493ded] hover:text-white hover:border-white transition-all duration-700 ease-in-out font-bold py-0 px-2">
                Get started
        </button>
    </div>
</nav></template>