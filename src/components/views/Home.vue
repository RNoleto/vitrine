<template>
    <section>
        <p class="font-bold">Minhas Vitrines</p>
        <div class="mt-4">
            <div v-if="lojaStore.carregando">Carregando vitrines...</div>
            <div v-else-if="lojaStore.erro" class="text-red-500">{{ lojaStore.erro }}</div>
            <div v-else-if="lojaStore.lojas.length === 0">Nenhuma vitrine cadastrada</div>
            <div v-else v-for="(loja, index) in lojaStore.lojas" :key="index" class="p-2 border border-indigo-600  rounded-md shadow-sm mb-2">
                <div class="flex items-center gap-2">
                    <img :src="loja.logo_url" alt="logo" class="w-8 h-8 object-contain" />
                    <span class="font-medium">{{ loja.name }}</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useLojaStore } from '@/stores/lojaStore'

const lojaStore = useLojaStore()

onMounted(() => {
    lojaStore.listarLojas()
})
</script>