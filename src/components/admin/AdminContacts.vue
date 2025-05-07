<script setup>
import { onMounted } from 'vue';
import { useAdminStore } from '../../stores/adminStore';
import { usePhoneMask } from '../../composables/usePhoneMask';

const adminStore = useAdminStore();
const { maskPhone } = usePhoneMask();

onMounted(() => {
  adminStore.fetchContacts()
})
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold mb-4">Gerenciamento de Contatos das Vitrines</h1>
    <p class="text-gray-700">Aqui visualiza todos os contatos criados para as vitrines no sistema</p>
    <div v-if="adminStore.loading">Carregando contatos...</div>
    <div v-else-if="adminStore.error">{{ adminStore.error }}</div>
    <div v-else class="overflow-x-auto mt-6">
      <table class="min-w-full bg-white border border-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left px-4 py-2 border-b">Foto</th>
            <th class="text-left px-4 py-2 border-b">Nome</th>
            <th class="text-left px-4 py-2 border-b">Telefone</th>
            <th class="text-left px-4 py-2 border-b">Situação</th>
            <th class="text-left px-4 py-2 border-b">Vitrine(s)</th>
            <th class="text-left px-4 py-2 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contact in adminStore.contacts" :key="contact.id">
            <td class="px-4 py-2 border-b"><img :src="contact.photo" class="w-[45px] h-[45px] rounded-[50%] overflow-hidden object-cover" :alt="'foto ' + contact.name"></td>
            <td class="px-4 py-2 border-b">{{ contact.name }}</td>
            <td class="px-4 py-2 border-b">{{ maskPhone(contact.whatsapp) }}</td>
            <td class="px-4 py-2 border-b">{{ contact.ativo === 1 ? 'Ativo' : 'Inativo' }}</td>
            <td class="px-4 py-2 border-b">
                <ul>
                    <li v-for="store in contact.stores.filter(s => s.ativo === 1)" :key="store.id">{{ store.name }}</li>
                </ul>
            </td>
            <td class="px-4 py-2 border-b">
              <div class="flex gap-2">
                <button class="text-blue-600 hover:underline">Editar</button>
                <button class="text-red-600 hover:underline ml-2">Excluir</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
