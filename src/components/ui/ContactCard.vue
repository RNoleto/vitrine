<template>
    <li class="relative p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <!-- Botões de ação -->
      <div class="absolute top-3 right-3 flex gap-2">
        <button
          class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-all duration-200"
          @click="$emit('edit', contact.id)"
          title="Editar contato"
        >
          <FontAwesomeIcon :icon="penIcon" class="w-4 h-4" />
        </button>
        <button
          class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md transition-all duration-200"
          @click="$emit('delete', contact.id)"
          title="Excluir contato"
        >
          <FontAwesomeIcon :icon="trashIcon" class="w-4 h-4" />
        </button>
      </div>
  
      <!-- Conteúdo principal -->
      <div class="flex items-center gap-4">
        <!-- Foto -->
        <img
          :src="contact.photo"
          alt="Foto do contato"
          class="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
        />
  
        <!-- Informações -->
        <div class="flex-1 min-w-0">
          <!-- Nome e WhatsApp -->
          <div class="mb-2">
            <h3 class="text-lg font-semibold text-gray-900 truncate">{{ contact.name }}</h3>
            <p class="text-sm text-gray-600 mt-1">
              <FontAwesomeIcon :icon="phoneIcon" class="mr-1.5" />
              {{ formatPhone(contact.whatsapp) }}
            </p>
          </div>
  
          <!-- Lojas associadas -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="store in contact.stores"
              :key="store.id"
              class="px-2.5 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
            >
              {{ store.name }}
            </span>
          </div>
        </div>
      </div>
    </li>
  </template>
  
  <script setup>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faPen, faTrash, faPhone } from '@fortawesome/free-solid-svg-icons'
  
  const penIcon = faPen
  const trashIcon = faTrash
  const phoneIcon = faPhone
  
  defineProps({
    contact: {
      type: Object,
      required: true,
      validator: (value) => {
        return ['id', 'name', 'photo', 'whatsapp', 'stores'].every(prop => prop in value)
      }
    }
  })
  
  defineEmits(['edit', 'delete'])
  
  const formatPhone = (number) => {
    // Implemente sua formatação de telefone aqui
    return number.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  </script>