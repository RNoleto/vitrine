<script setup>
import { ref, onMounted } from 'vue'
import { useWhatsapp } from '@/composables/useWhatsapp'
import { useRoute, useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import Loading from '../ui/Loading.vue'
import Card from '../ui/Card.vue'
import Footer from '../Footer.vue'


const { abrirWhatsapp } = useWhatsapp()
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

// function abrirLink(url) {
//   if (url) {
//     window.open(url, '_blank')
//   } else {
//     alert('Link inválido.')
//   }
// }

function irParaContatos() {
  router.push(`/contacts/${lojaId}/contacts`)
}

</script>

<template>
  <section class="flex flex-col min-h-[100vh] flex-1">
    <main class="flex">
      <Loading v-if="lojaStore.carregando" text="Carregando vitrine da loja" class="flex-1"/>
      <div v-else-if="loja" class="storePage text-center">
        <div class="mt-6">
          <img :src="loja.logo_url" alt="Logo da loja" class="w-32 h-32 mx-auto object-contain" />
          <h1 class="title font-bold">{{ loja.name }}</h1>
        </div>
        <!-- Links da loja -->
        <div class="space-y-3">
          <div v-for="(link, index) in loja.links" :key="index">
            <Card :text="link.texto" :icon="link.icone" :link="link.url" />
          </div>
        </div>
        <!-- Lista de Contatos da Loja -->
        <div v-if="contatos.length === 1" class="space-y-3 mb-2">
          <Card :text="contatos[0].name" :photo="contatos[0].photo" @click="abrirWhatsapp(contatos[0], loja?.name)" />
        </div>
        <div v-else-if="contatos.length > 1">
          <Card text="Fale com um de nossos consultores" icon="fa-solid fa-headset icon"  @click="irParaContatos" />
        </div>
      </div>
      <div v-else class="text-center text-red-600 mt-10">
        Loja não encontrada.
      </div>  
    </main>
    <Footer />
  </section>
</template>