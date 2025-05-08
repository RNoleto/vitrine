<template>
    <section>
        <h1 class="text-2xl font-bold mb-4">Resumo administrativo</h1>
        <p class="text-gray-700">Aqui você pode visualizar de forma resumida todos os dados do sistema.</p>
        <div class="flex gap-2 justify-between mt-6">

            <MetricCard 
                title="Métricas de Usuários"
                :metrics="[
                    { label: 'Total', value: totalUsers },
                    { label: 'Criados hoje', value: todayUsers },
                ]"
            />        

            <MetricCard 
                title="Métricas de Vitrines"
                :metrics="[
                    { label: 'Total', value: totalStores },
                    { label: 'Criadas hoje', value: todayStores },
                    { label: 'Ativas', value: activeStores },
                    { label: 'Inativas', value: inactiveStores }
                ]"
            />

            <MetricCard 
                title="Métricas de Contatos"
                :metrics="[
                    { label: 'Total', value: totalContacts },
                    { label: 'Criados hoje', value: todayContacts },
                    { label: 'Ativos', value: activeContacts },
                    { label: 'Inativos', value: inactiveContacts }
                ]"
            />
        </div>
    </section>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import MetricCard from '../ui/MetricCard.vue';

const adminStore = useAdminStore()

const today = new Date().toISOString().split('T')[0];

const totalUsers = computed(() => adminStore.users.length);
const todayUsers = computed(() => adminStore.users.filter(c => c.created_at.startsWith(today)).length);

const totalStores = computed(() => adminStore.stores.length);
const activeStores = computed(() => adminStore.stores.filter(s => s.ativo === 1).length);
const inactiveStores = computed(() => adminStore.stores.filter(s => s.ativo === 0).length);
const todayStores = computed(() => adminStore.stores.filter(s => s.created_at.startsWith(today)).length);

const totalContacts = computed(() => adminStore.contacts.length);
const activeContacts = computed(() => adminStore.contacts.filter(c => c.ativo === 1).length);
const inactiveContacts = computed(() => adminStore.contacts.filter(c => c.ativo === 0).length);
const todayContacts = computed(() => adminStore.contacts.filter(c => c.created_at.startsWith(today)).length);

onMounted(() => {
    adminStore.fetchStores();
    adminStore.fetchContacts();
})
</script>