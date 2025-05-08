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
    <h1 class="text-2xl font-bold mb-4">Gerenciamento de Vitrines</h1>
    <p class="text-gray-700">Aqui visualiza todas as vitrines criadas no sistema</p>
    <div v-if="adminStore.loading">Carregando vitrines...</div>
    <div v-else-if="adminStore.error">{{ adminStore.error }}</div>
    <div v-else class="overflow-x-auto mt-6">
      <table class="min-w-full bg-white border border-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left px-4 py-2 border-b">Logo</th>
            <th class="text-left px-4 py-2 border-b">Nome</th>
            <th class="text-left px-4 py-2 border-b">Data de Cadastro</th>
            <th class="text-left px-4 py-2 border-b">Situação</th>
            <th class="text-left px-4 py-2 border-b">Data de exclusão</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="store in adminStore.stores" :key="store.id">
            <td class="px-4 py-2 border-b"><img :src="store.logo" class="w-[30px] h-[30px]" :alt="'foto ' + store.name">
            </td>
            <td class="px-4 py-2 border-b font-semibold">{{ store.name }}</td>
            <td class="px-4 py-2 border-b">{{ new Date(store.created_at).toLocaleDateString('pt-BR') }}</td>
            <td class="px-4 py-2 border-b"><span class="font-semibold px-2 py-1 rounded-full"
                :class="store.ativo === 1 ? 'text-green-600  bg-green-100' : 'text-red-600 bg-red-100'">{{ store.ativo
                  === 1 ? 'Ativo' : 'Inativo' }}</span></td>
            <td class="px-4 py-2 border-b font-semibold"><span class="text-red-600">{{ store.ativo === 0 ? new Date(store.updated_at).toLocaleDateString('pt-BR')
              : '-' }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
