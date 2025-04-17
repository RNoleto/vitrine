<script setup>
import { useRoute } from 'vue-router'
import { useContactStore } from '../../stores/contactStore'
import { useLojaStore } from '../../stores/lojaStore'
import { computed } from 'vue'

const route        = useRoute()
const lojaId       = parseInt(route.params.id)
const contactStore = useContactStore()
const lojaStore    = useLojaStore()

const loja    = lojaStore.lojas.find(l => l.id === lojaId)
const contatos = contactStore.contact.filter(c => c.empresa === lojaId)

function openWhatsapp(telefone, nomeContato) {
  // limpa tudo que não é dígito
  const phone = telefone.replace(/\D/g, '')
  // mensagem personalizada
  const text = `Olá ${nomeContato}, tudo bem? Estou entrando em contato pela Vitrine da Loja ${loja?.nome} e gostaria de solicitar atendimento. Obrigado!`
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}
</script>

<template>
  <div class="max-w-xl mx-auto mt-8 space-y-6">
    <h1 class="text-2xl font-bold text-center">
      Contatos de {{ loja?.nome || 'Loja não encontrada' }}
    </h1>

    <ul v-if="contatos.length" class="space-y-4">
      <li
        v-for="(c, i) in contatos"
        :key="i"
        @click="openWhatsapp(c.contato, c.nome)"
        class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
      >
        <img
          :src="c.foto"
          alt="Foto"
          class="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
        <div class="flex-1 text-left">
          <p class="font-semibold">{{ c.nome }}</p>
          <p class="text-sm text-gray-600">{{ c.contato }}</p>
        </div>
        <i class="fa-brands fa-whatsapp text-green-500 text-xl"></i>
      </li>
    </ul>

    <p v-else class="text-center text-gray-500">
      Nenhum contato cadastrado para esta loja.
    </p>
  </div>
</template>

<style scoped>
/* Se quiser, ajuste o tamanho do ícone */
.fa-whatsapp {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
