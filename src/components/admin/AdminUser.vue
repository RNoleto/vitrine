<template>
  <section>
    <h1 class="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
    <p class="text-gray-700">Aqui você pode visualizar, editar e excluir usuários do sistema (quem cadastra e configura
      as vitrines e os contatos).</p>

    <div class="flex flex-wrap gap-2">
      <MetricCard title="Total" class="mt-2" :metrics="[
        { value: totalUsers }
      ]">
        <template #value="{ item }">
          <span
            :class="[
              'font-bold text-xl',
              item.value > 0 ? 'text-green-600' : 'text-gray-400'
            ]"
          >
            {{ item.value }}
          </span>
        </template>
      </MetricCard>

      <MetricCard title="Novos" class="mt-2" :metrics="[
        { value: todayUsers }
      ]">
        <template #value="{ item }">
          <span
            :class="[
              'font-bold text-xl',
              item.value > 0 ? 'text-green-600' : 'text-gray-400'
            ]"
          >
            {{ item.value }}
          </span>
        </template>
      </MetricCard>
    </div>

    <div class="overflow-x-auto mt-6">
      <table class="min-w-full bg-white border border-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left px-4 py-2 border-b">Nome</th>
            <th class="text-left px-4 py-2 border-b">Email</th>
            <th class="text-left px-4 py-2 border-b">Grupo</th>
            <th class="text-left px-4 py-2 border-b">Data de Cadastro</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in adminStore.users" :key="user.id">
            <td class="px-4 py-2 border-b">{{ user.name }}</td>
            <td class="px-4 py-2 border-b">{{ user.email }}</td>
            <td class="px-4 py-2 border-b">{{ user.role }}</td>
            <td class="px-4 py-2 border-b">{{ new Date(user.created_at).toLocaleDateString('pt-BR') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import MetricCard from '../ui/MetricCard.vue';

const adminStore = useAdminStore();

const totalUsers = computed(() => (adminStore.users ?? []).length);

const today = new Date().toLocaleDateString('pt-BR'); // ex: 09/05/2025

const todayUsers = computed(() => {
  const users = adminStore.users ?? [];
  return users.filter(c => {
    const userDate = new Date(c.created_at).toLocaleDateString('pt-BR');
    return userDate === today;
  }).length;
});

onMounted(() => {
  adminStore.fetchUsers();
});
</script>
