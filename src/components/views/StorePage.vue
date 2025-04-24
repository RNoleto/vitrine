<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import { useContactStore } from '../../stores/contactStore'

const route = useRoute()
const router = useRouter()
const lojaStore = useLojaStore()
const contactStore = useContactStore()

const lojaId = parseInt(route.params.id)
const loja = ref(null)

onMounted(async () => {
  // Carrega as lojas se ainda não tiverem sido carregadas
  if (lojaStore.lojas.length === 0) {
    await lojaStore.listarLojas()
  }
 
  // Procura a loja pelo ID
  loja.value = lojaStore.lojas.find((l) => l.id === lojaId)
})

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
  <section class="flex-1 p-6 overflow-y-auto">
    <div v-if="loja" class="max-w-xl mx-auto text-center mt-8">
      <img :src="loja.logo_url" alt="Logo da loja" class="w-32 h-32 mx-auto object-contain" />
      <h1 class="text-2xl font-bold mt-2">{{ loja.name }}</h1>

      <div class="mt-6 space-y-3">
        <div
          v-for="(link, index) in loja.links"
          :key="index"
          class="flex items-center justify-center gap-2"
        >
          <button
            @click="abrirLink(link.url)"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm shadow-zinc-500"
          >
            <i :class="link.icone"></i> {{ link.texto }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-red-600 mt-10">
      Loja não encontrada.
    </div>

    <!-- <div v-for="contato in contatosDaLoja" :key="contato.id">
      <p>{{ contato.name }}</p>
      <p>{{ contato.whatsapp }}</p>
    </div> -->
  </section>
</template>
