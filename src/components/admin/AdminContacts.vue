<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '../../stores/adminStore';
import { usePhoneMask } from '../../composables/usePhoneMask';

const adminStore = useAdminStore();
const { maskPhone } = usePhoneMask();

const searchQuery = ref('');
const selectedStatusFilter = ref('all');

const filteredContacts = computed(() => {
  let list = adminStore.contacts ?? [];
  
  if (selectedStatusFilter.value === 'active') {
    list = list.filter(c => c.ativo === 1);
  } else if (selectedStatusFilter.value === 'inactive') {
    list = list.filter(c => c.ativo === 0);
  }
  
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(c => 
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.whatsapp && c.whatsapp.includes(q))
    );
  }
  
  return list;
});

onMounted(() => {
  adminStore.fetchContacts();
});
</script>

<template>
  <section class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gerenciamento de Contatos</h1>
        <p class="text-sm text-gray-600 mt-1">
          Visualização de todos os cartões de contatos/WhatsApp vinculados às vitrines.
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
          placeholder="Buscar por nome ou número..."
          class="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
        />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <label class="text-xs font-semibold text-gray-600 whitespace-nowrap">Status:</label>
        <select 
          v-model="selectedStatusFilter"
          class="text-sm bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
        >
          <option value="all">Todos os contatos</option>
          <option value="active">Apenas Ativos</option>
          <option value="inactive">Apenas Inativos</option>
        </select>
      </div>
    </div>

    <!-- Tabela -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div v-if="adminStore.loading" class="p-8 text-center text-gray-500">
        <i class="fa-solid fa-circle-notch fa-spin text-2xl text-indigo-600 mb-2"></i>
        <p class="text-sm">Carregando contatos...</p>
      </div>

      <div v-else-if="adminStore.error" class="p-8 text-center text-red-600 bg-red-50">
        <i class="fa-solid fa-triangle-exclamation text-xl mb-1"></i>
        <p class="text-sm font-medium">{{ adminStore.error }}</p>
      </div>

      <div v-else-if="filteredContacts.length === 0" class="p-8 text-center text-gray-500">
        <i class="fa-solid fa-address-book text-2xl text-gray-300 mb-2"></i>
        <p class="text-sm font-medium">Nenhum contato encontrado.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th class="px-5 py-3">Contato</th>
              <th class="px-5 py-3">WhatsApp / Telefone</th>
              <th class="px-5 py-3">Vitrines Vinculadas</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3">Cadastro</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="contact in filteredContacts" :key="contact.id" class="hover:bg-gray-50/80 transition-colors">
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <img 
                    v-if="contact.photo" 
                    :src="contact.photo" 
                    class="w-10 h-10 rounded-full object-cover border border-gray-200" 
                    :alt="contact.name"
                  />
                  <div 
                    v-else 
                    class="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs border border-purple-200"
                  >
                    <i class="fa-solid fa-user"></i>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900">{{ contact.name }}</p>
                    <p class="text-xs text-gray-500">ID: {{ contact.id }}</p>
                  </div>
                </div>
              </td>

              <td class="px-5 py-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                  <i class="fa-brands fa-whatsapp text-sm"></i>
                  {{ maskPhone(contact.whatsapp) }}
                </span>
              </td>

              <td class="px-5 py-4">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="store in (contact.stores ?? []).filter(s => s.ativo === 1)" 
                    :key="store.id"
                    class="text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200"
                  >
                    {{ store.name }}
                  </span>
                  <span v-if="!contact.stores || contact.stores.length === 0" class="text-xs text-gray-400 italic">
                    Nenhuma vitrine
                  </span>
                </div>
              </td>

              <td class="px-5 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="contact.ativo === 1 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="contact.ativo === 1 ? 'bg-green-600' : 'bg-red-600'"></span>
                  {{ contact.ativo === 1 ? 'Ativo' : 'Inativo' }}
                </span>
              </td>

              <td class="px-5 py-4 whitespace-nowrap text-gray-500 text-xs">
                {{ contact.created_at ? new Date(contact.created_at).toLocaleDateString('pt-BR') : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
