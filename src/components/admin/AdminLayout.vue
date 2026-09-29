<script setup>
import { ref, watch } from 'vue'
import { version } from '../../../package.json'
import { useAuthStore } from '@/stores/authStore'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faChartPie, 
  faUsers, 
  faStore, 
  faAddressBook, 
  faArrowLeft, 
  faShieldHalved, 
  faArrowRightFromBracket,
  faPalette
} from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/ui/Button.vue'

library.add(faChartPie, faUsers, faStore, faAddressBook, faArrowLeft, faShieldHalved, faArrowRightFromBracket, faPalette)

const authStore = useAuthStore()
const sidebarOpen = ref(false)

const links = [
  { name: 'Visão Geral', route: '/admin/resume', icon: 'chart-pie' },
  { name: 'Usuários & Roles', route: '/admin/users', icon: 'users' },
  { name: 'Vitrines', route: '/admin/stores', icon: 'store' },
  { name: 'Contatos', route: '/admin/contacts', icon: 'address-book' },
  { name: 'Temas Visuais', route: '/admin/themes', icon: 'palette' },
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
    <header class="relative sm:static bg-white p-4 border-b border-gray-300 flex items-center justify-between md:hidden">
      <div class="flex items-center">
        <button 
          @click="toggleSidebar" 
          class="text-gray-700 focus:outline-none transition-transform duration-300 mr-3"
          :class="{ 'rotate-45': sidebarOpen }"
        >
          <svg class="w-6 h-6 transform transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-if="sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <p class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <font-awesome-icon icon="shield-halved" class="text-indigo-600 w-5 h-5" />
          Painel Admin
        </p>
      </div>
      <router-link to="/home" class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors">
        Modo Usuário
      </router-link>
    </header>

    <div class="flex flex-1 overflow-hidden min-h-[calc(100vh-3.5rem)] md:min-h-screen">
      <!-- Sidebar -->
      <aside 
        :class="[
          'fixed md:relative bg-white flex flex-col p-4 border-r border-gray-300 w-64',
          'transform transition-all duration-300 ease-in-out',
          'h-[calc(100vh-3.5rem)] md:h-full',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ]"
      >
        <div class="flex flex-col flex-1 h-full overflow-hidden">
          <div class="flex items-center justify-between px-2 mb-4">
            <div>
              <div class="flex items-center gap-2">
                <font-awesome-icon icon="shield-halved" class="text-indigo-600 w-6 h-6" />
                <h1 class="text-xl font-bold text-gray-900">Vitrine Admin</h1>
              </div>
              <span class="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-1">
                Área Restrita
              </span>
            </div>
          </div>

          <nav class="mt-6 flex-1 overflow-y-auto flex flex-col">
            <ul class="space-y-2">
              <li v-for="link in links" :key="link.name">
                <router-link 
                  :to="link.route" 
                  @click="sidebarOpen = false"
                  class="flex items-center p-3 rounded-lg text-gray-700 hover:bg-indigo-50 transition-colors duration-200 group"
                  active-class="bg-indigo-100 text-indigo-700 font-medium"
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

            <div class="pt-4 border-t border-gray-100 mt-auto sticky bottom-0 bg-white flex flex-col gap-2">
              <router-link 
                to="/home"
                class="w-full gap-2 flex items-center justify-center py-2 px-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold transition-colors duration-200 border border-indigo-200/80"
              >
                <font-awesome-icon icon="arrow-left" class="w-4 h-4" />
                Voltar ao App
              </router-link>
              <Button 
                @click="logout" 
                class="w-full gap-2 flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
              >
                <font-awesome-icon icon="arrow-right-from-bracket" />
                Sair
              </Button>
              <div class="text-[10px] text-gray-400 text-center font-mono select-none pt-1">
                Versão Admin v{{ version }}
              </div>
            </div>
          </nav>
        </div>
      </aside>

      <!-- Overlay Mobile -->
      <div 
        v-if="sidebarOpen" 
        @click="sidebarOpen = false"
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
    min-height: calc(100% - 3rem);
  }
}
</style>
