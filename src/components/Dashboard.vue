<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import Button from '@/components/ui/Button.vue'

const authStore = useAuthStore()
const sidebarOpen = ref(false)

const links = [
  { name: 'Home', route: '/home', icon: 'home' },
  { name: 'Lojas', route: '/stores', icon: 'store' },
  { name: 'Contatos', route: '/contacts', icon: 'users' },
]

const icons = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  store: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function logout() {
  authStore.logout()
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Cabeçalho Mobile -->
    <header class="relative sm:static bg-white p-4 border-b border-gray-300 flex items-center md:hidden">
      <button 
        @click="toggleSidebar" 
        class="text-gray-700 focus:outline-none transition-transform duration-300"
        :class="{ 'rotate-45': sidebarOpen }"
      >
        <svg class="w-6 h-6 transform transition-all duration-300" :class="{ 'rotate-45': sidebarOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          <path v-if="sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <p class="text-xl font-bold text-gray-800 ml-4">Dashboard</p>
    </header>

    <div class="flex flex-1 overflow-hidden min-h-[calc(100vh-3.5rem)] md:min-h-screen">
      <!-- Sidebar -->
      <aside 
        :class="[
          'fixed md:relative bg-white flex flex-col p-4 border-r border-gray-300 w-64',
          'transform transition-all duration-300 ease-in-out',
          'h-[calc(100vh-3.5rem)] md:h-full', // Altura ajustada
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ]"
      >
      <div class="flex flex-col flex-1 h-full overflow-hidden">
        <h1 class="text-xl font-bold text-gray-800 px-2 mb-4">Dashboard</h1>
          <nav class="mt-10 flex-1 overflow-y-auto flex flex-col">
            <ul class="space-y-2">
              <li v-for="link in links" :key="link.name">
                <router-link 
                  :to="link.route" 
                  @click="toggleSidebar"
                  class="flex items-center p-3 rounded-lg text-gray-700 hover:bg-indigo-50 transition-colors duration-200 group"
                  active-class="bg-indigo-100 text-indigo-700"
                >
                  <svg 
                    class="w-5 h-5 mr-3 transition-colors duration-200"
                    :class="{
                      'text-gray-500 group-hover:text-indigo-600': !$route.path.includes(link.route),
                      'text-indigo-600': $route.path.includes(link.route)
                    }" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icons[link.icon]" />
                  </svg>
                  {{ link.name }}
                </router-link>
              </li>
            </ul>
            <div class="pt-4 border-t border-gray-100 mt-auto sticky bottom-0 bg-white">
              <Button 
                @click="logout" 
                class="w-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </Button>
            </div>
          </nav>
        </div>
      </aside>

      <!-- Overlay Mobile -->
      <div 
        v-if="sidebarOpen" 
        @click="toggleSidebar"
        class="fixed inset-0 z-20 bg-black/50 md:hidden transition-opacity duration-300"
      ></div>

      <!-- Área Principal -->
      <main class="flex-1 p-6 overflow-y-auto transition-all duration-300">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

aside {
  z-index: 30;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
  aside {
    box-shadow: none;
    height: 100vh;
    top: 0; 
  }
}
</style>