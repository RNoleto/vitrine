<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

import Button from '@/components/ui/Button.vue'

const authStore = useAuthStore()

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

const links = [
  { name: 'Home', route: '/home' },
  { name: 'Lojas', route: '/stores' },
  { name: 'Contatos', route: '/contacts' },
  // Adicione mais links conforme necessário
]

function logout() {
  authStore.logout()
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Cabeçalho Mobile -->
    <header class="relative sm:static bg-white p-4 border-b border-gray-300 flex items-center md:hidden">
      <button @click="toggleSidebar" class="text-gray-700 focus:outline-none" name="menu-button">
        <!-- Ícone de Hamburger -->
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      <p class="text-xl font-bold text-gray-800 ml-4">Dashboard</p>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside :class="['absolute bg-white sm:static flex flex-col p-4 border-r border-gray-300 w-64 transition-all duration-300',
        sidebarOpen ? 'block' : 'hidden', 'md:block']">
        <div class="flex flex-col flex-1 h-full">
          <h1 class="text-xl font-bold text-gray-800 mb-6">Dashboard</h1>
          <nav class="flex flex-col flex-1">
            <ul class="flex-1">
              <li v-for="link in links" :key="link.name" class="mb-3">
                <router-link :to="link.route" @click="toggleSidebar" class="block p-2 rounded text-gray-700 hover:bg-gray-200">
                  {{ link.name }}
                </router-link>
              </li>
            </ul>
              <Button @click="logout()" class="mt-auto">Logout</Button>
          </nav>
        </div>
      </aside>

      <!-- Área Principal -->
      <main class="flex-1 p-6 overflow-y-auto">
        <section>
          <main>
            <router-view />
          </main>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
aside {
  z-index: 10;
  min-height: 100vh;
}

@media(max-width: 767px){
  aside {
    min-height: calc(100vh - 3.8rem);
  }
}
</style>