<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import { ref, computed, watch } from 'vue'

const route = useRoute()
const router = useRouter()
const lojaStore = useLojaStore()

const lojaId = route.params.id
const loja = computed(() => lojaStore.lojas[lojaId])

const editando = ref(false)
const nomeEditado = ref('')
const logoEditada = ref('')
const linksEditados = ref([])
const contatosEditados = ref([])

watch(loja, (novaLoja) => {
    if (novaLoja) {
        nomeEditado.value = novaLoja.nome
        logoEditada.value = novaLoja.logo

        // Evita erro ao acessar contatos ou links se forem undefined
        if (!novaLoja.contatos) novaLoja.contatos = []
        if (!novaLoja.links) novaLoja.links = []
    }
}, { immediate: true })


function deletarLoja() {
  if (confirm("Tem certeza que deseja deletar esta loja?")) {
    lojaStore.removerLoja(lojaId)
    router.push('/')
  }
}

function salvarEdicao() {
  const novosDados = {
    nome: nomeEditado.value,
    logo: logoEditada.value,
    links: linksEditados.value,
    contatos: contatosEditados.value
  }

  lojaStore.editarLoja(lojaId, novosDados)
  editando.value = false
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    logoEditada.value = URL.createObjectURL(file)
  }
}

// Links
function adicionarLink() {
  linksEditados.value.push({ texto: '', url: '', icone: '' })
}
function removerLink(i) {
  linksEditados.value.splice(i, 1)
}

// Contatos
function adicionarContato() {
  contatosEditados.value.push({ nome: '', telefone: '', foto: '' })
}
function removerContato(i) {
  contatosEditados.value.splice(i, 1)
}
function onFotoContatoChange(e, i) {
  const file = e.target.files[0]
  if (file) {
    contatosEditados.value[i].foto = URL.createObjectURL(file)
  }
}
</script>

<template>
  <div v-if="loja">
    <h2 class="text-xl font-bold mb-4">Detalhes da Loja</h2>

    <div class="space-y-4">
      <!-- Logo e Nome -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="relative">
          <img :src="editando ? logoEditada : loja.logo" alt="Logo da loja" class="w-20 h-20 object-contain object-center rounded" />
          <div v-if="editando" class="mt-2">
            <input type="file" @change="onFileChange" class="text-sm" />
          </div>
        </div>

        <div class="w-full sm:w-auto">
          <div v-if="editando" class="w-full">
            <label for="name" class="text-sm block mb-1">Nome da Loja</label>
            <input v-model="nomeEditado" name="name" class="border rounded p-2 w-full" placeholder="Nome da loja" />
          </div>
          <h3 v-else class="text-lg font-semibold">{{ loja.nome }}</h3>
        </div>
      </div>

      <!-- Links -->
      <div>
        <h4 class="font-medium">Links</h4>
        <div v-if="editando" class="space-y-2 mt-2">
          <div v-for="(link, i) in linksEditados" :key="i" class="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <input v-model="link.texto" placeholder="Texto" class="border p-2 rounded w-full sm:w-1/4" />
            <input v-model="link.url" placeholder="URL" class="border p-2 rounded w-full sm:w-1/2" />
            <input v-model="link.icone" placeholder="Classe do ícone" class="border p-2 rounded w-full sm:w-1/4" />
            <button @click="removerLink(i)" class="text-red-500 text-sm mt-1 sm:mt-0">✖</button>
          </div>
          <button @click="adicionarLink" class="text-blue-500 text-sm mt-2">+ Adicionar link</button>
        </div>
        <ul v-else class="flex flex-wrap gap-2 mt-2">
          <li v-for="(link, i) in loja.links" :key="i">
            <a :href="link.url" target="_blank" class="flex items-center gap-1 bg-indigo-100 px-3 py-1 rounded-md text-indigo-700 hover:bg-indigo-200">
              <i :class="link.icone"></i>
              <span>{{ link.texto }}</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Contatos -->
      <div v-if="loja.contatos && loja.contatos.length">
        <h4 class="font-medium">Contatos</h4>
        <div v-if="editando" class="space-y-2 mt-2">
          <div v-for="(contato, i) in contatosEditados" :key="i" class="flex flex-col sm:flex-row items-center gap-2">
            <img :src="contato.foto" class="w-8 h-8 rounded-full" />
            <input type="file" @change="(e) => onFotoContatoChange(e, i)" class="text-sm" />
            <input v-model="contato.nome" placeholder="Nome" class="border p-2 rounded w-full sm:w-1/4" />
            <input v-model="contato.telefone" placeholder="Telefone" class="border p-2 rounded w-full sm:w-1/4" />
            <button @click="removerContato(i)" class="text-red-500 text-sm">✖</button>
          </div>
          <button @click="adicionarContato" class="text-blue-500 text-sm mt-2">+ Adicionar contato</button>
        </div>
        <ul v-else class="space-y-2 mt-2">
          <li v-for="(contato, i) in loja.contatos" :key="i" class="flex items-center gap-2">
            <img :src="contato.foto" class="w-8 h-8 rounded-full" />
            <div>
              <p class="text-sm font-medium">{{ contato.nome }}</p>
              <p class="text-xs text-gray-500">{{ contato.telefone }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Botões -->
      <div class="mt-4 flex flex-col sm:flex-row gap-2">
        <button v-if="!editando" class="bg-yellow-400 text-white px-4 py-2 rounded-md w-full sm:w-auto" @click="editando = true">
          Editar
        </button>
        <button v-else class="bg-green-500 text-white px-4 py-2 rounded-md w-full sm:w-auto" @click="salvarEdicao">
          Salvar
        </button>
        <button v-if="editando" class="bg-gray-400 text-white px-4 py-2 rounded-md w-full sm:w-auto" @click="editando = false">
          Cancelar
        </button>
        <button class="bg-red-500 text-white px-4 py-2 rounded-md w-full sm:w-auto" @click="deletarLoja">
          Excluir
        </button>
        <button v-if="!editando" class="bg-gray-300 px-4 py-2 rounded-md w-full sm:w-auto" @click="router.push('/stores')">
          Voltar
        </button>
      </div>
    </div>
  </div>
</template>

