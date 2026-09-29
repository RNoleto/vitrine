<template>
  <li class="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative">
    
    <!-- Top row: Logo, Store Name, Status & Actions -->
    <div>
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex items-center gap-3 min-w-0">
          <img
            :src="store.logo_url || 'https://via.placeholder.com/48'"
            alt="Logo da Vitrine"
            class="w-12 h-12 rounded-xl object-cover p-1 bg-gray-50 border border-gray-200 shrink-0 shadow-xs"
          />
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                {{ store.name }}
              </h3>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span> Ativa
              </span>
            </div>
            <p class="text-[11px] text-gray-400 font-mono truncate mt-0.5">
              /{{ store.slug }}
            </p>
          </div>
        </div>

        <!-- Botão de Excluir -->
        <button
          @click="$emit('delete', index)"
          class="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors shrink-0"
          title="Excluir vitrine"
        >
          <i class="fa-solid fa-trash-can text-xs"></i>
        </button>
      </div>

      <!-- Theme Badge & Metrics Summary -->
      <div class="flex flex-wrap items-center gap-2 mb-4 pt-1">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <i class="fa-solid fa-palette text-[10px]"></i>
          <span>{{ getThemeName(store.theme) }}</span>
        </span>
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
          <i class="fa-solid fa-link text-[10px]"></i>
          <span>{{ store.links ? store.links.length : 0 }} Links</span>
        </span>
      </div>
    </div>

    <!-- Bottom Actions Bar -->
    <div class="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
      <div class="flex items-center gap-1.5">
        <!-- Ver Pública -->
        <button
          @click="$emit('access', store.slug)"
          class="px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all flex items-center gap-1.5"
          title="Ver página pública"
        >
          <i class="fa-solid fa-arrow-up-right-from-square text-[11px] text-indigo-600"></i>
          <span>Ver Pública</span>
        </button>

        <!-- Editar Dados Básicos -->
        <button
          @click="$emit('edit', index)"
          class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
          title="Editar nome/logo/links"
        >
          <i class="fa-solid fa-pen-to-square text-xs"></i>
        </button>
      </div>

      <!-- Ir para Detalhes / Customização -->
      <button
        @click="$emit('detail', store.slug)"
        class="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
      >
        <span>Gerenciar</span>
        <i class="fa-solid fa-chevron-right text-[10px]"></i>
      </button>
    </div>

  </li>
</template>

<script setup>
import { useThemeStore } from '../../stores/themeStore'

const themeStore = useThemeStore()

defineProps({
  store: { type: Object, required: true },
  index: { type: Number, required: true }
})

defineEmits(['access', 'detail', 'edit', 'delete'])

function getThemeName(themeId) {
  if (!themeId) return 'Padrão Minimal'
  const found = themeStore.allThemes.find(t => t.id === themeId)
  return found ? found.label : themeId
}
</script>

<style scoped>
button {
  cursor: pointer;
}
</style>