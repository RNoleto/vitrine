<script setup>
const props = defineProps({
    text: {
        type: String,
        default: 'Carregando loja...'
    }
})
</script>

<template>
    <div class="flex flex-col items-center justify-center mt-20 text-gray-600">
        <div class="loader mb-4"></div>
        <p v-if="text" class="text-lg font-medium">{{ text }}</p>
    </div>
</template>

<style scoped>
.loader {
    border: 4px solid #e5e7eb;
    /* gray-200 */
    border-top: 4px solid #3b82f6;
    /* blue-500 */
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>