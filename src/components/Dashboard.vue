<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHouse, faStore, faAddressBook, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/ui/Button.vue'

library.add(faHouse, faStore, faAddressBook, faSignOutAlt)


const authStore = useAuthStore()
const sidebarOpen = ref(false)

const links = [
  { name: 'Home', route: '/home', icon: 'house' },
  { name: 'Vitrines', route: '/stores', icon: 'store' },
  { name: 'Contatos', route: '/contacts', icon: 'address-book' },
]

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function logout() {
  authStore.logout()
}

watch(sidebarOpen, (newVal) => {
  if (window.innerWidth < 768) {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.overflow = newVal ? 'hidden' : 'auto';
    }
  }
});
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
                <font-awesome-icon 
                  :icon="link.icon" 
                  class="w-5 h-5 mr-3 transition-colors duration-200"
                  :class="{
                    'text-gray-500 group-hover:text-indigo-600': !$route.path.includes(link.route),
                    'text-indigo-600': $route.path.includes(link.route)
                  }"
                />
                  {{ link.name }}
                </router-link>
              </li>
            </ul>
            <div class="pt-4 border-t border-gray-100 mt-auto sticky bottom-0 bg-white">
              <Button 
                @click="logout" 
                class="w-full gap-2 flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
              >
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
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
      <main class="flex-1 p-6 transition-all duration-300 md:overflow-y-auto md:h-screen" :class="{ 'overflow-hidden': sidebarOpen }">
        <div class="min-h-full md:h-full">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
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

@media (max-width: 767px) {
  main {
    height: calc(100vh - 3.5rem);
  }
  
  main.overflow-hidden {
    overflow: hidden !important;
  }
}

@media (min-width: 768px) {
  aside {
    box-shadow: none;
    height: 100vh;
    top: 0; 
  }

  main {
    height: 100vh;
    overflow-y: auto;
  }
  
  main > div {
    min-height: calc(100% - 3rem); /* Ajuste conforme necessidade */
  }
}
</style>