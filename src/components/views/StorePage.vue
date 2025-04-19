<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import { useContactStore } from '../../stores/contactStore'

const route = useRoute()
const router = useRouter()
const lojaStore = useLojaStore()
const contactStore = useContactStore()

const lojaId = parseInt(route.params.id)
const loja = lojaStore.lojas.find((l) => l.id === lojaId)

const contatosDaLoja = computed(() => 
  contactStore.contact.filter(c => c.empresa === lojaId)
)

function abrirLink(url) {
  if (url) {
    window.open(url, '_blank')
  } else {
    alert('Link inválido.')
  }
}

function irParaContatos() {
  router.push(`/contacts/${lojaId}/contacts`)
}
</script>

<template>
  <div v-if="loja" class="max-w-xl mx-auto text-center mt-8">
    <img :src="loja.logo_url" alt="Logo da loja" class="w-32 h-32 mx-auto object-contain" />
    <h1 class="text-2xl font-bold mt-4">{{ loja.name }}</h1>

    <!-- Lista de Links -->
    <div class="mt-6 space-y-3">
      <div
        v-for="(link, index) in loja.links"
        :key="index"
        class="flex items-center justify-center gap-2"
      >
        <button
          @click="abrirLink(link.url)"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2 shadow-sm"
        >
          <i :class="link.icone"></i> {{ link.texto }}
        </button>
      </div>

      <!-- Link para contatos (só mostra se tiver contatos atribuídos à loja) -->
      <div v-if="contatosDaLoja.length > 0" class="flex justify-center">
        <button
          @click="irParaContatos"
          class="w-full bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <i class="fas fa-users"></i> Nossos Contatos
        </button>
      </div>
    </div>
  </div>

  <div v-else class="text-center text-red-600 mt-10">
    Loja não encontrada.
  </div>
</template>
