<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useContactStore } from '../../stores/contactStore'
import { useLojaStore } from '../../stores/lojaStore'
import Loading from '../ui/Loading.vue'

const route = useRoute()
const lojaId = parseInt(route.params.id)
const contactStore = useContactStore()
const lojaStore = useLojaStore()

const loja = computed(() => lojaStore.lojas.find(l => l.id === lojaId))

onMounted(async () => {
  if (lojaStore.lojas.length === 0) {
    await lojaStore.listarLojas()
  }

  if (contactStore.contatos.length === 0) {
    await contactStore.listarContatos()
  }
})


const contatos = computed(() =>
  contactStore.contatos.filter(c => c.store_id === lojaId && c.ativo)
)

function openWhatsapp(telefone, nomeContato) {
  const phone = telefone.replace(/\D/g, '')
  const text = `Olá ${nomeContato}, tudo bem? Estou entrando em contato pela Vitrine da Loja ${loja.value?.name || ''} e gostaria de solicitar atendimento. Obrigado!`
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}
</script>

<template>
  <section class="flex-1 p-6 overflow-y-auto">
    <Loading v-if="lojaStore.carregando" text="Carregando dados da loja" />
    <div v-else class="max-w-xl mx-auto text-center mt-8">
      <div v-if="loja" class="mb-6">
        <img :src="loja.logo_url" alt="Logo da loja" class="w-32 h-32 mx-auto object-contain" />
        <h1 class="text-2xl font-bold mt-2">{{ loja.name }}</h1>
      </div>
      <div>
        <p class="text-2xl font-bold text-center">
          Contatos de {{ loja?.name || 'Loja não encontrada' }}
        </p>
        <Loading v-if="contactStore.carregando" text="" />
        <ul v-if="contatos.length" class="mt-2 space-y-4">
          <li
            v-for="(c, i) in contatos"
            :key="i"
            @click="openWhatsapp(c.whatsapp, c.name)"
            class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            <img
              :src="c.photo"
              alt="Foto"
              class="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div class="flex-1 text-left">
              <p class="font-semibold">{{ c.name }}</p>
              <p class="text-sm text-gray-600">{{ c.whatsapp }}</p>
            </div>
            <i class="fa-brands fa-whatsapp text-green-500 text-xl"></i>
          </li>
        </ul>
    
        <p v-else class="text-center text-gray-500">
          Nenhum contato cadastrado para esta loja.
        </p>
      </div>
  
    </div>
  </section>
</template>

<style scoped>
/* Se quiser, ajuste o tamanho do ícone */
.fa-whatsapp {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
