<script setup>
import { ref, onMounted } from 'vue'
import { useLojaStore } from '@/stores/lojaStore'

const lojaStore = useLojaStore()

onMounted(() => {
    lojaStore.listarLojas()
})
</script>

<template>
    <section>
        <p>Minhas Lojas</p>
        <div class="mt-2">
            <div v-if="lojaStore.carregando">Carregando lojas...</div>
            <div v-else-if="lojaStore.erro" class="text-red-500">{{ lojaStore.erro }}</div>
            <div v-else-if="lojaStore.lojas.length === 0">Nenhuma loja cadastrada</div>
            <div v-else v-for="(loja, index) in lojaStore.lojas" :key="index" class="flex items-center gap-2 space-y-2">
                <div class="flex items-center gap-3">
                    <img :src="loja.logo_url" alt="logo" class="w-8 h-8 object-contain" />
                    <span class="font-medium">{{ loja.name }}</span>
                </div>
            </div>
            <!-- <pre>{{ lojaStore }}</pre> -->
        </div>
    </section>
</template>
