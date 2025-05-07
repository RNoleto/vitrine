<template>
    <section>
        <h1 class="text-2xl font-bold mb-4">Resumo administrativo</h1>
        <p class="text-gray-700">Aqui você pode visualizar de forma resumida todos os dados do sistema.</p>
        <div class="flex justify-between mt-6">
            <div>
                <p class="font-bold">Métricas de Usuários</p>
                <p>Total:</p>
            </div>
            <div>
                <p class="font-bold">Métricas de Vitrines</p>
                <p>Total: {{ totalStores }}</p>
                <p>Criadas hoje: {{ todayStores }}</p>
                <p>Ativas: {{ activeStores }}</p>
                <p>Inativas: {{ inactiveStores }}</p>
            </div>
            <div>
                <p class="font-bold">Métricas de Contatos</p>
                <p>Total: {{ totalContacts }}</p>
                <p>Criados hoje: {{ todayContacts }}</p>
                <p>Ativos: {{ activeContacts }}</p>
                <p>Inativos: {{ inactiveContacts }}</p>
    
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAdminStore } from '@/stores/adminStore';

const adminStore = useAdminStore()

const today = new Date().toISOString().split('T')[0];

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