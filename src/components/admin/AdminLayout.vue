<script setup>
import { ref } from 'vue'
import { faUsers, faStore, faChartBar, faSignOutAlt, faGear } from '@fortawesome/free-solid-svg-icons'
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
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div :class="['fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-md transition-transform transform', sidebarOpen ? 'translate-x-0' : '-translate-x-full', 'sm:translate-x-0 sm:static sm:inset-auto']">
      <div class="p-4 text-xl font-bold text-blue-600">Admin</div>
      <nav class="mt-4 space-y-1">
        <button
          v-for="item in menuItems"
          :key="item.label"
          class="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          @click="item.action ? item.action() : $router.push(item.route)"
        >
          <FontAwesomeIcon :icon="item.icon" class="w-4 h-4 mr-2" />
          <span>{{ item.label }}</span>
        </button>
      </nav>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar -->
      <header class="flex items-center justify-between bg-white px-4 py-3 shadow-sm sm:hidden">
        <button @click="toggleSidebar" class="text-gray-500 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <span class="font-semibold text-gray-700">Painel Admin</span>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
