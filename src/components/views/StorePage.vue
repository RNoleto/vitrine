<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import Loading from '../ui/Loading.vue'

const route = useRoute()
const router = useRouter()
const lojaStore = useLojaStore()

const lojaId = parseInt(route.params.id)
const loja = ref(null)
const contatos = ref([])

onMounted(async () => {
  lojaStore.carregando = true

  try {
    // Buscar loja e contatos da API pública
    loja.value = await lojaStore.obterLojaPublica(lojaId)
    contatos.value = await lojaStore.obterContatosLojaPublica(lojaId)
  } catch (error) {
    console.error('Erro ao carregar dados públicos da loja:', error)
  } finally {
    lojaStore.carregando = false
  }
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

function abrirWhatsapp(contato) {
  const numeroFormatado = contato.whatsapp.replace(/\D/g, '')
  const nomeLoja = loja.value?.name || 'sua loja'
  const mensagem = `Olá ${contato.name}, vi a vitrine da sua loja ${nomeLoja} e gostaria de um atendimento`
  const url = `https://wa.me/${numeroFormatado}?text=${encodeURIComponent(mensagem)}`
  window.open(url, '_blank')
}
</script>


<template>
  <section class="flex-1 p-6 overflow-y-auto">
    <Loading v-if="lojaStore.carregando" text="Carregando página da loja" />
    <div v-else-if="loja" class="max-w-xl mx-auto text-center mt-8">
      <img :src="loja.logo_url" alt="Logo da loja" class="w-32 h-32 mx-auto object-contain" />
      <h1 class="text-2xl font-bold mt-2">{{ loja.name }}</h1>

      <div class="mt-6 space-y-3">
        <div v-for="(link, index) in loja.links" :key="index" class="flex items-center justify-center gap-2">
          <button @click="abrirLink(link.url)"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm shadow-zinc-500">
            <i :class="link.icone"></i> {{ link.texto }}
          </button>
        </div>
      </div>
      <!-- Lista de Contatos da Loja -->
      <!-- <div v-if="contatosDaLoja.length === 1" class="mt-3 space-y-3 mb-2">
        <div class="flex items-center gap-4 p-4 border rounded cursor-pointer hover:bg-gray-100"
          @click="abrirWhatsapp(contatosDaLoja[0])">
          <img :src="contatosDaLoja[0].photo" alt="Foto do contato" class="w-10 h-10 rounded-full object-cover" />
          <div class="text-left">
            <p><strong>Nome:</strong> {{ contatosDaLoja[0].name }}</p>
            <p><strong>Telefone:</strong> {{ contatosDaLoja[0].whatsapp }}</p>
          </div>
        </div>
      </div> -->

      <!-- <div v-else-if="contatosDaLoja.length > 1" class="mt-3 mb-2">
        <button @click="irParaContatos" class="text-indigo-600 underline hover:text-indigo-800 text-sm">
          Ver todos os contatos ({{ contatosDaLoja.length }})
        </button>
      </div> -->
    </div>
    <div v-else class="text-center text-red-600 mt-10">
      Loja não encontrada.
    </div>
  </section>
</template>
