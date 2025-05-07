<script setup>
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore';

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.fetchStores()
})
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold mb-4">Gerenciamento de Lojas</h1>
    <div v-if="adminStore.loading">Carregando lojas...</div>
    <div v-else-if="adminStore.error">{{ adminStore.error }}</div>
    <div class="overflow-x-auto mt-6">
      <table class="min-w-full bg-white border border-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left px-4 py-2 border-b">Nome da loja</th>
            <th class="text-left px-4 py-2 border-b">Data de Cadastro</th>
            <th class="text-left px-4 py-2 border-b">Situação</th>
            <th class="text-left px-4 py-2 border-b">Data de exclusão</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="store in adminStore.stores" :key="store.id">
            <td class="px-4 py-2 border-b">{{ store.name }}</td>
            <td class="px-4 py-2 border-b">{{ new Date(store.created_at).toLocaleDateString('pt-BR') }}</td>
            <td class="px-4 py-2 border-b">{{ store.ativo === 1 ? 'Ativo' : 'Inativo' }}</td>
            <td class="px-4 py-2 border-b">{{ store.ativo === 0 ? new Date(store.updated_at).toLocaleDateString('pt-BR') : '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
