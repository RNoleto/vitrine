<template>
  <li class="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between">
    <div>
      <!-- Top header: Avatar, Name & Action buttons -->
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex items-center gap-3 min-w-0">
          <img
            :src="contact.photo || 'https://via.placeholder.com/48?text=Contato'"
            alt="Foto do Contato"
            class="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-xs shrink-0"
          />
          <div class="min-w-0">
            <h3 class="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {{ contact.name }}
            </h3>
            <a 
              :href="whatsappUrl" 
              target="_blank" 
              class="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold mt-0.5 hover:underline"
              title="Abrir no WhatsApp"
            >
              <i class="fa-brands fa-whatsapp text-sm"></i>
              <span>{{ formatPhone(contact.whatsapp) }}</span>
            </a>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="flex items-center gap-1 shrink-0">
          <button
            @click="$emit('edit', contact.id)"
            class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            title="Editar contato"
          >
            <i class="fa-solid fa-pen-to-square text-xs"></i>
          </button>
          <button
            @click="$emit('delete', contact.id)"
            class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Excluir contato"
          >
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Linked Stores section -->
      <div class="pt-2 border-t border-gray-100">
        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
          Vitrines Vinculadas ({{ activeStores.length }})
        </span>
        <div v-if="activeStores.length" class="flex flex-wrap gap-1.5">
          <span
            v-for="store in activeStores"
            :key="store.id"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
          >
            <i class="fa-solid fa-store text-[10px]"></i>
            <span>{{ store.name }}</span>
          </span>
        </div>
        <p v-else class="text-xs text-gray-400 italic">Nenhuma vitrine vinculada.</p>
      </div>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  contact: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const activeStores = computed(() => {
  if (!props.contact?.stores || !Array.isArray(props.contact.stores)) return []
  return props.contact.stores.filter(s => !s.pivot || !s.pivot.deleted_at)
})

const whatsappUrl = computed(() => {
  const cleanNum = props.contact?.whatsapp ? props.contact.whatsapp.replace(/\D/g, '') : ''
  return `https://wa.me/55${cleanNum}`
})

const formatPhone = (number) => {
  if (!number) return ''
  const clean = number.replace(/\D/g, '')
  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return number
}
</script>

<style scoped>
button {
  cursor: pointer;
}
</style>