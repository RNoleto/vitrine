<template>
  <Transition name="fade">
    <div
      v-if="store.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      @click.self="handleOverlayClick"
    >
      <Transition name="zoom">
        <div
          class="w-full max-w-md bg-white rounded-2xl shadow-xl border overflow-hidden transform transition-all duration-300"
          :class="borderClass"
        >
          <!-- Ícone do Cabeçalho -->
          <div class="flex flex-col items-center pt-8 pb-4 px-6 text-center">
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-3xl animate-scale-up"
              :class="iconBgClass"
            >
              <FontAwesomeIcon :icon="currentIcon" />
            </div>

            <!-- Título -->
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ store.title }}
            </h3>

            <!-- Mensagem -->
            <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {{ store.message }}
            </p>
          </div>

          <!-- Rodapé de Ações -->
          <div class="px-6 py-4 bg-gray-50 flex gap-3 justify-end border-t border-gray-100">
            <!-- Botão Cancelar (Apenas no tipo Confirm) -->
            <button
              v-if="store.type === 'confirm'"
              @click="store.handleCancel"
              class="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              {{ store.cancelText }}
            </button>

            <!-- Botão Confirmar -->
            <button
              @click="store.handleConfirm"
              class="px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-xs focus:outline-hidden focus:ring-2 focus:ring-offset-2 transition-all duration-200"
              :class="confirmButtonClass"
            >
              {{ store.confirmText }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'
import { useFeedbackStore } from '../../stores/feedbackStore'

const store = useFeedbackStore()

const currentIcon = computed(() => {
  switch (store.type) {
    case 'success':
      return faCheckCircle
    case 'error':
      return faTimesCircle
    case 'confirm':
      return faQuestionCircle
    case 'info':
    default:
      return faInfoCircle
  }
})

const borderClass = computed(() => {
  switch (store.type) {
    case 'success':
      return 'border-green-100'
    case 'error':
      return 'border-red-100'
    case 'confirm':
      return 'border-indigo-100'
    case 'info':
    default:
      return 'border-blue-100'
  }
})

const iconBgClass = computed(() => {
  switch (store.type) {
    case 'success':
      return 'bg-green-50 text-green-600'
    case 'error':
      return 'bg-red-50 text-red-600'
    case 'confirm':
      return 'bg-indigo-50 text-indigo-600'
    case 'info':
    default:
      return 'bg-blue-50 text-blue-600'
  }
})

const confirmButtonClass = computed(() => {
  switch (store.type) {
    case 'success':
      return 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
    case 'error':
      return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    case 'confirm':
      return 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
    case 'info':
    default:
      return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
  }
})

const handleOverlayClick = () => {
  if (store.type !== 'confirm') {
    store.handleConfirm()
  }
}
</script>

<style scoped>
/* Transições do Modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes scaleUp {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
