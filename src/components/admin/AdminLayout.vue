<script setup>
import { ref } from 'vue'
import { faUsers, faStore, faChartBar, faSignOutAlt, faGear, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const logout = () => {
  authStore.logout()
}

const menuItems = [
  { label: 'Usuários', icon: faUsers, route: '/admin/users' },
  { label: 'Lojas', icon: faStore, route: '/admin/stores' },
  // { label: 'Relatórios', icon: faChartBar, route: '/admin/reports' },
  { label: 'Configurações', icon: faGear, route: '/admin/settings' },
  { label: 'Sair', icon: faSignOutAlt, action: logout },
]
</script>

<template>
  <div class="flex flex-col sm:flex-row h-screen bg-gray-100 text-gray-800">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed sm:static z-40 top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'sm:translate-x-0'
      ]"
      aria-label="Navegação lateral"
    >
      <div class="p-4 text-2xl font-bold text-blue-600 border-b border-gray-200">
        Admin
      </div>
      <nav class="mt-4 space-y-1">
        <button
          v-for="item in menuItems"
          :key="item.label"
          class="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition-colors"
          @click="item.action ? item.action() : $router.push(item.route)"
          :aria-label="item.label"
        >
          <FontAwesomeIcon :icon="item.icon" class="w-5 h-5 mr-3" />
          <span class="text-sm font-medium">{{ item.label }}</span>
        </button>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Topbar (Mobile) -->
      <header class="sm:hidden flex items-center justify-between bg-white px-4 py-3 border-b shadow-md">
        <button @click="toggleSidebar" class="text-gray-600 focus:outline-none" aria-label="Abrir menu">
          <FontAwesomeIcon :icon="faBars" class="w-6 h-6" />
        </button>
        <h1 class="text-lg font-semibold text-gray-800">Painel Admin</h1>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 sm:p-6 overflow-y-auto" aria-live="polite">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Garantia de acessibilidade para foco */
button:focus-visible {
  outline: 2px solid #2563eb; /* azul */
  outline-offset: 2px;
}
</style>
