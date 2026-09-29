<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'

const adminStore = useAdminStore()
const searchQuery = ref('')
const selectedStatusFilter = ref('all')

const filteredStores = computed(() => {
  let list = adminStore.stores ?? []
  
  if (selectedStatusFilter.value === 'active') {
    list = list.filter(s => s.ativo === 1)
  } else if (selectedStatusFilter.value === 'inactive') {
    list = list.filter(s => s.ativo === 0)
  }
  
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(s => 
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.slug && s.slug.toLowerCase().includes(q))
    )
  }
  
  return list
})

onMounted(() => {
  adminStore.fetchStores()
})
</script>

<template>
  <section class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gerenciamento de Vitrines</h1>
        <p class="text-sm text-gray-600 mt-1">
          Visualização de todas as vitrines digitais cadastradas no sistema.
        </p>
      </div>
    </div>

    <!-- Barra de Filtros -->
    <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="relative w-full md:w-80">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar vitrine por nome ou slug..."
          class="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
        />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <label class="text-xs font-semibold text-gray-600 whitespace-nowrap">Status:</label>
        <select 
          v-model="selectedStatusFilter"
          class="text-sm bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
        >
          <option value="all">Todas as vitrines</option>
          <option value="active">Apenas Ativas</option>
          <option value="inactive">Apenas Inativas</option>
        </select>
      </div>
    </div>

    <!-- Tabela -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div v-if="adminStore.loading" class="p-8 text-center text-gray-500">
        <i class="fa-solid fa-circle-notch fa-spin text-2xl text-indigo-600 mb-2"></i>
        <p class="text-sm">Carregando vitrines...</p>
      </div>

      <div v-else-if="adminStore.error" class="p-8 text-center text-red-600 bg-red-50">
        <i class="fa-solid fa-triangle-exclamation text-xl mb-1"></i>
        <p class="text-sm font-medium">{{ adminStore.error }}</p>
      </div>

      <div v-else-if="filteredStores.length === 0" class="p-8 text-center text-gray-500">
        <i class="fa-solid fa-store-slash text-2xl text-gray-300 mb-2"></i>
        <p class="text-sm font-medium">Nenhuma vitrine encontrada.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th class="px-5 py-3">Vitrine</th>
              <th class="px-5 py-3">Link Público</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3">Cadastro</th>
              <th class="px-5 py-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="store in filteredStores" :key="store.id" class="hover:bg-gray-50/80 transition-colors">
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <img v-if="store.logo" :src="store.logo" class="w-9 h-9 rounded-lg object-cover border border-gray-200" alt="logo" />
                  <div v-else class="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-200">
                    <i class="fa-solid fa-store"></i>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900">{{ store.name }}</p>
                    <p class="text-xs text-gray-500">ID: {{ store.id }}</p>
                  </div>
                </div>
              </td>

              <td class="px-5 py-4 whitespace-nowrap">
                <span class="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                  /{{ store.slug }}
                </span>
              </td>

              <td class="px-5 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="store.ativo === 1 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="store.ativo === 1 ? 'bg-green-600' : 'bg-red-600'"></span>
                  {{ store.ativo === 1 ? 'Ativo' : 'Inativo' }}
                </span>
              </td>

              <td class="px-5 py-4 whitespace-nowrap text-gray-500 text-xs">
                {{ store.created_at ? new Date(store.created_at).toLocaleDateString('pt-BR') : '-' }}
              </td>

              <td class="px-5 py-4 whitespace-nowrap text-right">
                <router-link 
                  :to="`/${store.slug}`" 
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                >
                  Visualizar <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
