<script setup>
import { onMounted, computed } from 'vue'
import { useWhatsapp } from '@/composables/useWhatsapp'
import { useRoute, useRouter } from 'vue-router'
import { useContactStore } from '../../stores/contactStore'
import { useLojaStore } from '../../stores/lojaStore'
import Loading from '../ui/Loading.vue'
import Card from '../ui/Card.vue'
import Footer from '../Footer.vue'


const { abrirWhatsapp } = useWhatsapp()
const route = useRoute()
const router = useRouter()
const lojaId = parseInt(route.params.id)
const contactStore = useContactStore()
const lojaStore = useLojaStore()

const loja = computed(() => lojaStore.lojas.find(l => l.id === lojaId))

onMounted(async () => {
  if (lojaStore.lojas.length === 0) {
    await lojaStore.listarLojasPublicas()
  }

  if (contactStore.contatos.length === 0) {
    await contactStore.listarContatosPublicosPorLoja(lojaId)
  }
})


const contatos = computed(() =>
  contactStore.contatos.filter(c => c.store_id === lojaId && c.ativo)
)

</script>

<template>
  <section class="flex flex-col min-h-[100vh] flex-1">
    <main class="flex">
      <Loading v-if="lojaStore.carregando" text="Carregando dados da loja" />
      <div v-else class="storePage text-center">
        <div v-if="loja" class="mt-6">
          <img :src="loja.logo_url" alt="Logo da loja" class="w-32 h-32 mx-auto object-contain" />
          <h1 class="title font-bold">{{ loja.name }}</h1>
        </div>
        <div>
          <Loading v-if="contactStore.carregando" text="" />
          <div v-if="contatos.length">
            <div v-for="(c, i) in contatos" :key="i" @click="abrirWhatsapp(c, loja?.name)">
              <Card :photo="c.photo" :text="c.name" />
            </div>
          </div>
          <p v-else class="text-center text-gray-500">
            Nenhum contato cadastrado para esta loja.
          </p>
        </div>
        <div class="flex justify-end mt-2" @click="router.back()">
          <p class="text-zinc-800 cursor-pointer border p-2 bg-white rounded-md shadow-md hover:shadow-lg hover:bg-zinc-100 transition duration-200 ease-in-out">
            ← Voltar
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </section>
</template>