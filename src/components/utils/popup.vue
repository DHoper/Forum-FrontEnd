<script setup lang="ts">

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    paragraph: {
        type: String,
    },
    isOpen: {
        type: Boolean,
        required: true
    }
});
</script>

<template>
    <div v-if="isOpen" class="bg-white absolute top-o left-0 w-screen h-screen z-50 flex justify-center items-center">
        <div class="bg-white p-1  w-1/3">
            <div class="bg-stone-600 h-full text-white flex flex-col justify-around items-center py-10 gap-6">
                <h3 class="text-2xl tracking-widest">{{ props.title }}</h3>
                <p>{{ props.paragraph }}</p>
                <button @click="$emit('closePopup')"
                    class="text-lg  border-2 border-white p-2 px-16 hover:bg-white hover:text-stone-600 transition-all duration-300">確認</button>
            </div>
        </div>
    </div>
</template>