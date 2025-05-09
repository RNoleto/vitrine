<template>
    <section>
        <h1 class="text-2xl font-bold mb-4">Resumo administrativo</h1>
        <p class="text-gray-700">Aqui você pode visualizar de forma resumida todos os dados do sistema.</p>
        <div class="flex gap-2 justify-between mt-6">

            <MetricCard title="Métricas de Usuários" class="mt-2" :metrics="[
              { value: totalUsers, label: 'Total' },
              { value: todayUsers, label: 'Novos' }
            ]">
              <template #value="{ item }">
                <span
                  :class="[
                    'font-bold text-xl',
                    item.label === 'Inativos'
                      ? 'text-red-500'
                      : item.value > 0
                        ? 'text-green-600'
                        : 'text-gray-400'
                  ]"
                >
                  {{ item.value }}
                </span>
              </template>
            </MetricCard>
            
            <MetricCard title="Métricas de Vitrines" class="mt-2" :metrics="[
              { value: totalStores, label: 'Total' },
              { value: todayStores, label: 'Novos' },
              { label: 'Ativas', value: activeStores },
              { label: 'Inativas', value: inactiveStores }
            ]">
              <template #value="{ item }">
                <span
                  :class="[
                    'font-bold text-xl',
                    item.label === 'Inativas'
                      ? 'text-red-500'
                      : item.value > 0
                        ? 'text-green-600'
                        : 'text-gray-400'
                  ]"
                >
                  {{ item.value }}
                </span>
              </template>
            </MetricCard>
            
            <MetricCard title="Métricas de Contatos" class="mt-2" :metrics="[
                { label: 'Total', value: totalContacts },
                { label: 'Criados hoje', value: todayContacts },
                { label: 'Ativos', value: activeContacts },
                { label: 'Inativos', value: inactiveContacts }
            ]">
              <template #value="{ item }">
                <span
                  :class="[
                    'font-bold text-xl',
                    item.label === 'Inativos'
                      ? 'text-red-500'
                      : item.value > 0
                        ? 'text-green-600'
                        : 'text-gray-400'
                  ]"
                >
                  {{ item.value }}
                </span>
              </template>
            </MetricCard>
        </div>
    </section>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import MetricCard from '../ui/MetricCard.vue';

const adminStore = useAdminStore()

const today = new Date().toLocaleDateString('pt-BR');

const totalUsers = computed(() => adminStore.users.length);

const todayUsers = computed(() => {
  const users = adminStore.users ?? [];
  return users.filter(c => {
    const userDate = new Date(c.created_at).toLocaleDateString('pt-BR');
    return userDate === today;
  }).length;
});

const totalStores = computed(() => adminStore.stores.length);
const activeStores = computed(() => adminStore.stores.filter(s => s.ativo === 1).length);
const inactiveStores = computed(() => adminStore.stores.filter(s => s.ativo === 0).length);
const todayStores = computed(() => adminStore.stores.filter(s => s.created_at.startsWith(today)).length);

const totalContacts = computed(() => adminStore.contacts.length);
const activeContacts = computed(() => adminStore.contacts.filter(c => c.ativo === 1).length);
const inactiveContacts = computed(() => adminStore.contacts.filter(c => c.ativo === 0).length);
const todayContacts = computed(() => adminStore.contacts.filter(c => c.created_at.startsWith(today)).length);

onMounted(() => {
    adminStore.fetchUsers();
    adminStore.fetchStores();
    adminStore.fetchContacts();
})
</script>