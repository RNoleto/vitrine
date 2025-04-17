<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import { ref, computed } from 'vue'

const route = useRoute()
const router = useRouter()
const lojaStore = useLojaStore()

const lojaId = route.params.id
const loja = computed(() => lojaStore.lojas[lojaId])

function deletarLoja() {
  if (confirm("Tem certeza que deseja deletar esta loja?")) {
    lojaStore.removerLoja(lojaId)
    router.push('/') // volta para a lista
  }
}
</script>

<template>
  <div v-if="loja">
    <h2 class="text-xl font-bold mb-4">Detalhes da Loja</h2>

    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <img :src="loja.logo" alt="Logo da loja" class="w-16 h-16" />
        <h3 class="text-lg font-semibold">{{ loja.nome }}</h3>
      </div>

      <div>
        <h4 class="font-medium">Links</h4>
        <ul class="flex flex-wrap gap-2 mt-2">
          <li v-for="(link, i) in loja.links" :key="i">
            <a :href="link.url" target="_blank" class="flex items-center gap-1 bg-indigo-100 px-3 py-1 rounded-md text-indigo-700 hover:bg-indigo-200">
              <i :class="link.icone"></i>
              <span>{{ link.texto }}</span>
            </a>
          </li>
        </ul>
      </div>

      <div v-if="loja.contatos && loja.contatos.length">
        <h4 class="font-medium">Contatos</h4>
        <ul class="space-y-2 mt-2">
          <li v-for="(contato, i) in loja.contatos" :key="i" class="flex items-center gap-2">
            <img :src="contato.foto" class="w-8 h-8 rounded-full" />
            <div>
              <p class="text-sm font-medium">{{ contato.nome }}</p>
              <p class="text-xs text-gray-500">{{ contato.telefone }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="mt-4 flex gap-3">
        <button class="bg-yellow-400 text-white px-4 py-2 rounded-md">Editar</button>
        <button class="bg-red-500 text-white px-4 py-2 rounded-md" @click="deletarLoja">Excluir</button>
        <button class="bg-gray-300 px-4 py-2 rounded-md" @click="router.push('/')">Voltar</button>
      </div>
    </div>
  </div>
</template>
