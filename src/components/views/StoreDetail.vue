<script setup>
import { useRoute } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import { useContactStore } from '../../stores/contactStore'
import { computed } from 'vue'

const route = useRoute()
const lojaStore = useLojaStore()
const contactStore = useContactStore()

const lojaId = parseInt(route.params.id)
const loja = lojaStore.lojas.find(l => l.id === lojaId)

const contatosDaLoja = computed(() =>
  contactStore.contact.filter(c => c.empresa === lojaId)
)
</script>

<template>
  <div v-if="loja" class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-6">Detalhes da Loja</h1>

    <!-- Logo e Nome -->
    <div class="flex items-center gap-6 mb-8">
      <img :src="loja.logo" alt="Logo da Loja" class="w-24 h-24 object-contain" />
      <h2 class="text-2xl font-semibold">{{ loja.nome }}</h2>
    </div>

    <!-- Links da Loja -->
    <section class="mb-10">
      <h3 class="text-xl font-bold mb-4">Links</h3>
      <div v-if="loja.links.length > 0" class="space-y-2">
        <div
          v-for="(link, index) in loja.links"
          :key="index"
          class="flex items-center gap-2"
        >
          <i :class="link.icone"></i>
          <a :href="link.url" target="_blank" class="text-indigo-600 hover:underline">
            {{ link.texto }}
          </a>
        </div>
      </div>
      <div v-else class="text-gray-500">Nenhum link cadastrado.</div>
    </section>

    <!-- Contatos da Loja -->
    <section>
      <h3 class="text-xl font-bold mb-4">Contatos</h3>
      <div v-if="contatosDaLoja.length > 0" class="space-y-3">
        <div
          v-for="contato in contatosDaLoja"
          :key="contato.id"
          class="flex gap-2 items-center p-4 border rounded shadow-sm"
        >
        <img :src="contato.foto" alt="Foto" class="w-10 h-10 rounded-full object-cover" />
        <div>
            <p><strong>Nome:</strong> {{ contato.nome }}</p>
              <p><strong>Telefone:</strong> {{ contato.contato }}</p>
        </div>  
        </div>
      </div>
      <div v-else class="text-gray-500">Nenhum contato atribuído a esta loja.</div>
    </section>
  </div>

  <div v-else class="text-center text-red-600 mt-10">
    Loja não encontrada.
  </div>
</template>
