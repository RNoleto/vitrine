<script setup>
import { ref } from 'vue'

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

const links = [
  { name: 'Home', route: '/' },
  { name: 'Empresas', route: '/stores' },
  { name: 'Contatos', route: '/contacts' },
  // Adicione mais links conforme necessário
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Cabeçalho Mobile -->
    <header class="bg-white p-4 border-b border-gray-300 flex items-center md:hidden">
      <button @click="toggleSidebar" class="text-gray-700 focus:outline-none">
        <!-- Ícone de Hamburger -->
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      <h1 class="text-xl font-bold text-gray-800 ml-4">Dashboard</h1>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside :class="['bg-white p-4 border-r border-gray-300 w-64 transition-all duration-300',
        sidebarOpen ? 'block' : 'hidden', 'md:block']">
        <h1 class="text-xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <nav>
          <ul>
            <li v-for="link in links" :key="link.name" class="mb-3">
              <router-link :to="link.route" class="block p-2 rounded text-gray-700 hover:bg-gray-200">
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Área Principal -->
      <main class="flex-1 p-6 overflow-y-auto">
        <!-- Cabeçalho na área principal (apenas em telas maiores) -->
        <header class="hidden md:block mb-4 border-b border-gray-300 pb-2">
          <h2 class="text-2xl text-gray-800">Conteúdo Principal</h2>
        </header>
        <section>
          <router-view />
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* O componente utiliza apenas classes utilitárias do Tailwind CSS */
</style>