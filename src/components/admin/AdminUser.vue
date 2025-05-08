<template>
  <section>
    <h1 class="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
    <p class="text-gray-700">Aqui você pode visualizar, editar e excluir usuários do sistema (quem cadastra e configura as vitrines e os contatos).</p>

    <div class="overflow-x-auto mt-6">
      <table class="min-w-full bg-white border border-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left px-4 py-2 border-b">Nome</th>
            <th class="text-left px-4 py-2 border-b">Email</th>
            <th class="text-left px-4 py-2 border-b">Grupo</th>
            <th class="text-left px-4 py-2 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in adminStore.users" :key="user.id">
            <td class="px-4 py-2 border-b">{{ user.name }}</td>
            <td class="px-4 py-2 border-b">{{ user.email }}</td>
            <td class="px-4 py-2 border-b">{{ user.role }}</td>
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

<script setup>
import { onMounted } from 'vue';
import { useAdminStore } from '../../stores/adminStore';

const adminStore = useAdminStore();

onMounted(() => {
  adminStore.fetchUsers();
});
</script>
