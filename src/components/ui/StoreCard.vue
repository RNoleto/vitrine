<template>
    <li class="relative p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <!-- Botão de excluir flutuante -->
      <button
        class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-sm z-10"
        @click="$emit('delete', index)"
        title="Excluir vitrine"
      >
        <FontAwesomeIcon :icon="trashIcon" class="text-xs" />
      </button>
  
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <!-- Informações da loja -->
        <div class="flex items-center gap-3 min-w-0">
          <img
            :src="store.logo_url"
            alt="Logo"
            class="w-10 h-10 object-contain rounded-md flex-shrink-0 border border-gray-100"
          />
          <span class="text-gray-900 font-medium truncate">{{ store.name }}</span>
        </div>
  
        <!-- Ações -->
        <div class="flex items-center gap-2 sm:gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
          <!-- Acessar -->
          <div class="tooltip-container">
            <button
              class="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
              @click="$emit('access', store.slug)"
            >
              <FontAwesomeIcon :icon="doorOpenIcon" class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span class="tooltip">Acessar vitrine</span>
          </div>
  
          <!-- Detalhes -->
          <div class="tooltip-container">
            <button
              class="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
              @click="$emit('detail', store.slug)"
            >
              <FontAwesomeIcon :icon="eyeIcon" class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span class="tooltip">Ver detalhes da vitrine</span>
          </div>
  
          <!-- Divisor -->
          <div class="h-6 w-px bg-gray-200 hidden sm:block"></div>
  
          <!-- Editar -->
          <div class="tooltip-container">
            <button
              class="p-2 text-gray-500 hover:text-yellow-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
              @click="$emit('edit', index)"
            >
              <FontAwesomeIcon :icon="penIcon" class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span class="tooltip">Editar Vitrine</span>
          </div>
        </div>
      </div>
    </li>
  </template>
  
  <script setup>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faDoorOpen, faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
  
  const doorOpenIcon = faDoorOpen
  const eyeIcon = faEye
  const penIcon = faPen
  const trashIcon = faTrash
  
  defineProps({
    store: { type: Object, required: true },
    index: { type: Number, required: true }
  })
  
  defineEmits(['access', 'detail', 'edit', 'delete'])
  </script>
  
  <style scoped>
  button{
    cursor: pointer;
  }
  
  .tooltip-container {
    position: relative;
    display: inline-block;
  }
  
  .tooltip {
    visibility: hidden;
    width: max-content;
    background-color: #1f2937;
    color: #fff;
    text-align: center;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    position: absolute;
    z-index: 20;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.2s ease;
    font-size: 0.75rem;
    white-space: nowrap;
    pointer-events: none;
  }
  
  .tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #1f2937 transparent transparent transparent;
  }
  
  .tooltip-container:hover .tooltip {
    visibility: visible;
    opacity: 1;
    transition-delay: 0.3s;
  }
  </style>