<script setup>
import { useRoute } from 'vue-router'
import { useContactStore } from '../../stores/contactStore'
import { useLojaStore } from '../../stores/lojaStore'

const route = useRoute()
const lojaId = parseInt(route.params.id)

const contactStore = useContactStore()
const lojaStore = useLojaStore()

const loja = lojaStore.lojas.find((l) => l.id === lojaId)
const contatos = contactStore.contact.filter((c) => c.empresa === lojaId)
</script>

<template>
  <div class="max-w-xl mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-4 text-center">Contatos de {{ loja?.nome || 'Loja não encontrada' }}</h1>

    <ul class="space-y-3 mt-4">
      <li v-for="(c, i) in contatos" :key="i" class="flex items-center space-x-4">
        <img :src="c.foto" alt="Foto" class="w-10 h-10 rounded-full object-cover" />
        <div>
          <p class="font-semibold">{{ c.nome }}</p>
          <p class="text-sm text-gray-600">{{ c.contato }}</p>
        </div>
      </li>
    </ul>

    <div v-if="contatos.length === 0" class="text-center text-gray-500 mt-6">
      Nenhum contato cadastrado para esta loja.
    </div>
  </div>
</template>
