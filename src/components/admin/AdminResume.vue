<template>
  <section class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Visão Geral & Métricas do Sistema</h1>
        <p class="text-sm text-gray-600 mt-1">
          Acompanhe o crescimento, o engajamento e o status geral das vitrines e usuários.
        </p>
      </div>
    </div>

    <!-- Cards Superiores Principais -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Métricas de Usuários -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <i class="fa-solid fa-users text-lg"></i>
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900">Usuários</h2>
              <p class="text-xs text-gray-500">Cadastros e contas</p>
            </div>
          </div>
          <router-link to="/admin/users" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
            Gerenciar <i class="fa-solid fa-arrow-right text-[10px] ml-0.5"></i>
          </router-link>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          <div class="bg-gray-50 p-3 rounded-lg">
            <span class="text-xs font-semibold text-gray-500 block">Total</span>
            <span class="text-xl font-bold text-gray-900">{{ totalUsers }}</span>
          </div>
          <div class="bg-emerald-50/70 p-3 rounded-lg border border-emerald-100">
            <span class="text-xs font-semibold text-emerald-700 block">Novos Hoje</span>
            <span class="text-xl font-bold text-emerald-800">{{ todayUsers }}</span>
          </div>
        </div>
      </div>

      <!-- Métricas de Vitrines -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <i class="fa-solid fa-store text-lg"></i>
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900">Vitrines (Lojas)</h2>
              <p class="text-xs text-gray-500">Páginas de exibição</p>
            </div>
          </div>
          <router-link to="/admin/stores" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
            Ver todas <i class="fa-solid fa-arrow-right text-[10px] ml-0.5"></i>
          </router-link>
        </div>

        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
          <div class="bg-gray-50 p-2.5 rounded-lg">
            <span class="text-[11px] font-semibold text-gray-500 block">Total</span>
            <span class="text-lg font-bold text-gray-900">{{ totalStores }}</span>
          </div>
          <div class="bg-green-50 p-2.5 rounded-lg border border-green-100">
            <span class="text-[11px] font-semibold text-green-700 block">Ativas</span>
            <span class="text-lg font-bold text-green-800">{{ activeStores }}</span>
          </div>
          <div class="bg-red-50 p-2.5 rounded-lg border border-red-100">
            <span class="text-[11px] font-semibold text-red-600 block">Inativas</span>
            <span class="text-lg font-bold text-red-700">{{ inactiveStores }}</span>
          </div>
        </div>
      </div>

      <!-- Métricas de Contatos -->
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4 sm:col-span-2 lg:col-span-1">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <i class="fa-solid fa-address-book text-lg"></i>
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900">Contatos</h2>
              <p class="text-xs text-gray-500">Cartões de WhatsApp</p>
            </div>
          </div>
          <router-link to="/admin/contacts" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
            Ver todos <i class="fa-solid fa-arrow-right text-[10px] ml-0.5"></i>
          </router-link>
        </div>

        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
          <div class="bg-gray-50 p-2.5 rounded-lg">
            <span class="text-[11px] font-semibold text-gray-500 block">Total</span>
            <span class="text-lg font-bold text-gray-900">{{ totalContacts }}</span>
          </div>
          <div class="bg-purple-50 p-2.5 rounded-lg border border-purple-100">
            <span class="text-[11px] font-semibold text-purple-700 block">Ativos</span>
            <span class="text-lg font-bold text-purple-800">{{ activeContacts }}</span>
          </div>
          <div class="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
            <span class="text-[11px] font-semibold text-amber-700 block">Novos Hoje</span>
            <span class="text-lg font-bold text-amber-800">{{ todayContacts }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela Resumida de Recentes -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Últimos Usuários -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 class="font-bold text-gray-900 text-sm flex items-center gap-2">
            <i class="fa-solid fa-user-clock text-indigo-600"></i>
            Últimos Usuários Cadastrados
          </h3>
          <router-link to="/admin/users" class="text-xs font-semibold text-indigo-600 hover:underline">
            Ver todos
          </router-link>
        </div>

        <div v-if="adminStore.users.length === 0" class="text-xs text-gray-400 py-4 text-center">
          Nenhum usuário cadastrado.
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div v-for="user in recentUsers" :key="user.id" class="py-2.5 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
                {{ user.name ? user.name[0].toUpperCase() : 'U' }}
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-900">{{ user.name }}</p>
                <p class="text-[11px] text-gray-500 font-mono">{{ user.email }}</p>
              </div>
            </div>
            <span 
              class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'"
            >
              {{ user.role === 'admin' ? 'Admin' : 'Usuário' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Últimas Vitrines -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 class="font-bold text-gray-900 text-sm flex items-center gap-2">
            <i class="fa-solid fa-store text-blue-600"></i>
            Últimas Vitrines Criadas
          </h3>
          <router-link to="/admin/stores" class="text-xs font-semibold text-indigo-600 hover:underline">
            Ver todas
          </router-link>
        </div>

        <div v-if="adminStore.stores.length === 0" class="text-xs text-gray-400 py-4 text-center">
          Nenhuma vitrine criada.
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div v-for="store in recentStores" :key="store.id" class="py-2.5 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img v-if="store.logo" :src="store.logo" class="w-8 h-8 rounded-lg object-cover border border-gray-200" alt="logo" />
              <div v-else class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                <i class="fa-solid fa-store"></i>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-900">{{ store.name }}</p>
                <p class="text-[11px] text-gray-500">/{{ store.slug }}</p>
              </div>
            </div>
            <span 
              class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              :class="store.ativo === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
            >
              {{ store.ativo === 1 ? 'Ativa' : 'Inativa' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAdminStore } from '@/stores/adminStore';

const adminStore = useAdminStore();

const today = new Date().toLocaleDateString('pt-BR');

const totalUsers = computed(() => adminStore.users.length);
const todayUsers = computed(() => {
  const users = adminStore.users ?? [];
  return users.filter(c => {
    if (!c.created_at) return false;
    const userDate = new Date(c.created_at).toLocaleDateString('pt-BR');
    return userDate === today;
  }).length;
});

const recentUsers = computed(() => (adminStore.users ?? []).slice(0, 5));

const totalStores = computed(() => adminStore.stores.length);
const activeStores = computed(() => adminStore.stores.filter(s => s.ativo === 1).length);
const inactiveStores = computed(() => adminStore.stores.filter(s => s.ativo === 0).length);
const recentStores = computed(() => (adminStore.stores ?? []).slice(0, 5));

const totalContacts = computed(() => adminStore.contacts.length);
const activeContacts = computed(() => adminStore.contacts.filter(c => c.ativo === 1).length);
const todayContacts = computed(() => {
  const contacts = adminStore.contacts ?? [];
  return contacts.filter(c => c.created_at && new Date(c.created_at).toLocaleDateString('pt-BR') === today).length;
});

onMounted(() => {
  adminStore.fetchUsers();
  adminStore.fetchStores();
  adminStore.fetchContacts();
});
</script>