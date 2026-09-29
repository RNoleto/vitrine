<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-10">
    
    <!-- Top Header Card -->
    <div class="bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
            <i class="fa-solid fa-store text-[10px]"></i> Gestão de Lojas
          </span>
          <span class="text-xs text-gray-400 font-medium">({{ lojaStore.lojas.length }} vitrines ativas)</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-gray-900">
          Minhas Vitrines Digitais
        </h1>
        <p class="text-xs text-gray-500">
          Crie, altere temas e gerencie todos os links das suas vitrines.
        </p>
      </div>

      <!-- Tab Switcher Navigation Bar -->
      <div class="flex items-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200 shrink-0">
        <button
          @click="activeTab = 'list'"
          :class="[
            'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'list' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
          ]"
        >
          <i class="fa-solid fa-list-check"></i>
          <span>Minhas Vitrines ({{ lojaStore.lojas.length }})</span>
        </button>

        <button
          @click="activeTab = 'create'"
          :class="[
            'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'create' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
          ]"
        >
          <i class="fa-solid fa-plus text-xs"></i>
          <span>Cadastrar Vitrine</span>
        </button>
      </div>
    </div>

    <!-- TAB 1: LISTA DE VITRINES -->
    <div v-show="activeTab === 'list'" class="space-y-4 animate-fade-in">
      
      <!-- Filter & Search Bar -->
      <div v-if="lojaStore.lojas.length > 0" class="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="relative w-full sm:w-80">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nome da vitrine..."
            class="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
        </div>

        <span class="text-xs text-gray-500 font-medium">
          Exibindo {{ filteredLojas.length }} de {{ lojaStore.lojas.length }} vitrines
        </span>
      </div>

      <!-- Loading State -->
      <Loading v-if="lojaStore.carregando" text="Carregando suas vitrines..." />

      <!-- Erro -->
      <div v-else-if="lojaStore.erro" class="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-semibold">
        {{ lojaStore.erro }}
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredLojas.length === 0" class="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center space-y-4">
        <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
          <i class="fa-solid fa-store-slash"></i>
        </div>
        <h3 class="text-base font-bold text-gray-900">
          {{ searchQuery ? 'Nenhuma vitrine encontrada para a busca.' : 'Nenhuma vitrine cadastrada.' }}
        </h3>
        <p class="text-xs text-gray-500 max-w-sm mx-auto">
          {{ searchQuery ? 'Tente buscar por outro termo.' : 'Clique no botão abaixo para criar sua primeira vitrine digital.' }}
        </p>
        <button
          @click="activeTab = 'create'"
          class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <i class="fa-solid fa-plus"></i> Cadastrar Nova Vitrine
        </button>
      </div>

      <!-- Grid de Vitrines -->
      <ul v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StoreCard
          v-for="(loja, idx) in filteredLojas"
          :key="loja.id"
          :store="loja"
          :index="idx"
          @access="acessarLoja"
          @detail="acessarDetalheLoja"
          @edit="openEditModal"
          @delete="deletarLoja"
        />
      </ul>

    </div>

    <!-- TAB 2: FORMULÁRIO DE CADASTRO DE VITRINE -->
    <div v-show="activeTab === 'create'" class="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-fade-in max-w-3xl mx-auto">
      
      <div class="border-b pb-4">
        <h2 class="text-base font-bold text-gray-900 flex items-center gap-2">
          <i class="fa-solid fa-circle-plus text-indigo-600"></i> Cadastrar Nova Vitrine
        </h2>
        <p class="text-xs text-gray-500">Defina o nome, logo e adicione os primeiros links da sua vitrine</p>
      </div>

      <div class="space-y-5">
        <!-- 1. Nome da Loja -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-gray-700">
            <i class="fa-solid fa-signature text-indigo-500 mr-1"></i> Nome da Vitrine *
          </label>
          <input
            v-model="novaLojaNome"
            type="text"
            placeholder="Ex: Dra. Mariana Silva - Advocacia"
            class="w-full p-3 border border-gray-300 rounded-xl text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
          />
          <span v-if="errosFormulario.nome" class="text-red-500 text-[11px] font-semibold block">{{ errosFormulario.nome }}</span>
        </div>

        <!-- 2. Logo Upload Preview -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-gray-700">
            <i class="fa-solid fa-image text-indigo-500 mr-1"></i> Logo ou Foto da Vitrine
          </label>
          <div class="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
            <img
              :src="novaLojaLogo || 'https://via.placeholder.com/64?text=Logo'"
              alt="Preview"
              class="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-xs shrink-0"
            />
            <div class="space-y-1">
              <input id="upload-logo-main" type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
              <label
                for="upload-logo-main"
                class="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-white border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 hover:border-indigo-400 transition-all shadow-xs"
              >
                <i class="fa-solid fa-cloud-arrow-up text-indigo-600"></i> Selecionar Imagem (.png, .jpg, .svg)
              </label>
              <p class="text-[10px] text-gray-400">Recomendado formato quadrado até 2MB.</p>
            </div>
          </div>
          <span v-if="errosFormulario.logo" class="text-red-500 text-[11px] font-semibold block">{{ errosFormulario.logo }}</span>
        </div>

        <!-- 3. Adicionar Links Inicial -->
        <div class="space-y-3 pt-2">
          <label class="block text-xs font-bold text-gray-700">
            <i class="fa-solid fa-link text-indigo-500 mr-1"></i> Links Principais da Vitrine *
          </label>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 bg-gray-50 border border-gray-200 rounded-2xl">
            <div class="sm:col-span-4">
              <IconSelect v-model="novoIcone" :options="opcoesIcones" placeholder="Selecione o Ícone" />
            </div>
            <div class="sm:col-span-4">
              <input
                v-model="novoTexto"
                type="text"
                placeholder="Ex: Instagram Oficial"
                class="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div class="sm:col-span-4 flex gap-2">
              <input
                v-model="novaUrl"
                type="text"
                placeholder="https://..."
                class="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-indigo-500"
              />
              <button
                @click="adicionarLink"
                class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 transition-all cursor-pointer"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>

          <span v-if="errosFormulario.links" class="text-red-500 text-[11px] font-semibold block">{{ errosFormulario.links }}</span>

          <!-- Lista de links adicionados -->
          <div v-if="novaLinks.length" class="space-y-2 pt-1">
            <span class="text-[11px] font-bold text-gray-500 block">Links Adicionados ({{ novaLinks.length }}):</span>
            <div class="space-y-1.5">
              <div
                v-for="(l, i) in novaLinks"
                :key="i"
                class="flex items-center justify-between p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <i :class="l.icone" class="text-indigo-600"></i>
                  <span class="font-bold text-gray-800 truncate">{{ l.texto }}</span>
                  <span class="text-gray-400 text-[10px] truncate max-w-[180px]">({{ l.url }})</span>
                </div>
                <button @click="novaLinks.splice(i, 1)" class="text-red-500 hover:text-red-700 text-xs p-1">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Botão Final Cadastrar -->
        <div class="pt-4 border-t flex items-center justify-end gap-3">
          <button
            @click="activeTab = 'list'"
            class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            @click="cadastrarLoja"
            :disabled="lojaStore.cadastrando || lojaStore.carregando"
            class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <i v-if="lojaStore.cadastrando" class="fa-solid fa-circle-notch fa-spin"></i>
            <i v-else class="fa-solid fa-check"></i>
            <span>{{ lojaStore.cadastrando ? 'Cadastrando...' : 'Criar Vitrine Digital' }}</span>
          </button>
        </div>

      </div>

    </div>

    <!-- Modal de Edição de Loja -->
    <EditStoreModal
      :isOpen="isEditModalOpen"
      :storeData="{
        id: editId,
        nome: editNome,
        logo: editLogo,
        links: editLinks
      }"
      :opcoesIcones="opcoesIcones"
      :inputBaseClass="inputBaseClass"
      @save="salvarEdicaoFinal"
      @cancel="closeEditModal"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import { useThemeStore } from '../../stores/themeStore'
import { useFeedbackStore } from '../../stores/feedbackStore'
import Loading from '../ui/Loading.vue'
import StoreCard from '../ui/StoreCard.vue'
import IconSelect from '../ui/IconSelect.vue'
import EditStoreModal from '../ui/EditStoreModal.vue'

const route = useRoute()
const router = useRouter()
const lojaStore = useLojaStore()
const themeStore = useThemeStore()
const feedbackStore = useFeedbackStore()

const activeTab = ref('list') // 'list' | 'create'
const searchQuery = ref('')

const novaLojaNome = ref('')
const novaLojaLogo = ref(null)
const novaLinks = ref([])
const novoIcone = ref('')
const novoTexto = ref('')
const novaUrl = ref('')

const errosFormulario = ref({
  nome: '',
  logo: '',
  links: ''
})

const filteredLojas = computed(() => {
  if (!searchQuery.value.trim()) return lojaStore.lojas
  const query = searchQuery.value.toLowerCase().trim()
  return lojaStore.lojas.filter(l => 
    l.name?.toLowerCase().includes(query) || 
    l.slug?.toLowerCase().includes(query)
  )
})

watch(novaLojaNome, (novoValor) => {
  if (novoValor.trim().length >= 3 && /^[\p{L}\d\s\-_]+$/u.test(novoValor)) {
    errosFormulario.value.nome = ''
  }
})

watch(novaLojaLogo, (novoValor) => {
  if (novoValor) errosFormulario.value.logo = ''
})

const inputBaseClass = 'w-full p-2 border border-gray-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-indigo-500'

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    feedbackStore.showError('Envie uma imagem válida (SVG, PNG, JPEG ou WebP).')
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    feedbackStore.showError('A imagem excede 2MB. Escolha um arquivo menor.')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    novaLojaLogo.value = reader.result
  }
  reader.readAsDataURL(file)
}

function adicionarLink() {
  if (!novoIcone.value || !novoTexto.value || !novaUrl.value) {
    feedbackStore.showError('Preencha ícone, texto e URL do link.')
    return
  }
  novaLinks.value.push({ icone: novoIcone.value, texto: novoTexto.value, url: novaUrl.value })
  novoIcone.value = ''
  novoTexto.value = ''
  novaUrl.value = ''
  errosFormulario.value.links = ''
}

async function cadastrarLoja() {
  errosFormulario.value = { nome: '', logo: '', links: '' }

  const nomeLimpo = novaLojaNome.value.trim()
  if (nomeLimpo.length < 3 || !/^[\p{L}\d\s\-_]+$/u.test(nomeLimpo)) {
    errosFormulario.value.nome = 'Nome inválido. Use pelo menos 3 caracteres alfanuméricos.'
    return
  }

  if (!novaLojaLogo.value) {
    novaLojaLogo.value = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzRGNjZFNSIgcng9IjIwIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMzAiIGZpbGw9IiNGRkZGRkYiLz48L3N2Zz4='
  }

  if (novaLinks.value.length < 1) {
    errosFormulario.value.links = 'Adicione pelo menos um link.'
    return
  }

  try {
    await lojaStore.adicionarLoja({
      name: novaLojaNome.value,
      logoBase64: novaLojaLogo.value,
      links: novaLinks.value
    })
    novaLojaNome.value = ''
    novaLojaLogo.value = null
    novaLinks.value = []
    activeTab.value = 'list'
    feedbackStore.showSuccess('Vitrine cadastrada com sucesso!')
  } catch (error) {
    feedbackStore.showError(error.message || 'Erro ao cadastrar a vitrine.')
  }
}

// Modal edição
const isEditModalOpen = ref(false)
const editIndex = ref(null)
const editId = ref(null)
const editNome = ref('')
const editLogo = ref('')
const editLinks = ref([])

function openEditModal(index) {
  const loja = filteredLojas.value[index] || lojaStore.lojas[index]
  if (!loja) return
  editIndex.value = index
  editId.value = loja.id
  editNome.value = loja.name
  editLogo.value = loja.logo_url
  editLinks.value = loja.links ? loja.links.map(l => ({ ...l })) : []
  isEditModalOpen.value = true
}

function closeEditModal() {
  isEditModalOpen.value = false
  editIndex.value = null
  editLinks.value = []
}

async function salvarEdicaoFinal(dados) {
  try {
    await lojaStore.editarLoja(dados.id, {
      name: dados.name,
      logo: dados.logoBase64,
      links: dados.links
    })
    feedbackStore.showSuccess('Vitrine editada com sucesso!')
    closeEditModal()
  } catch (error) {
    feedbackStore.showError(error.message || 'Erro ao editar a vitrine.')
  }
}

const deletarLoja = async (index) => {
  const loja = filteredLojas.value[index] || lojaStore.lojas[index]
  if (!loja) return
  const confirmed = await feedbackStore.confirm({
    title: 'Excluir Vitrine',
    message: `Deseja realmente excluir a vitrine "${loja.name}"?`
  })
  if (confirmed) {
    try {
      await lojaStore.excluirLoja(loja.id)
      feedbackStore.showSuccess('Vitrine excluída com sucesso!')
    } catch (error) {
      feedbackStore.showError('Erro ao excluir vitrine: ' + (error.message || 'Tente novamente.'))
    }
  }
}

const opcoesIcones = [
  { label: 'Facebook', value: 'fa-brands fa-facebook' },
  { label: 'Instagram', value: 'fa-brands fa-instagram' },
  { label: 'Twitter', value: 'fa-brands fa-twitter' },
  { label: 'YouTube', value: 'fa-brands fa-youtube' },
  { label: 'LinkedIn', value: 'fa-brands fa-linkedin' },
  { label: 'WhatsApp', value: 'fa-brands fa-whatsapp' },
  { label: 'Website', value: 'fa-solid fa-globe' },
  { label: 'Localização', value: 'fa-solid fa-location-dot' },
  { label: 'E-mail', value: 'fa-solid fa-envelope' },
  { label: 'Telefone', value: 'fa-solid fa-phone' }
]

function acessarLoja(slug) {
  const url = router.resolve(`/${slug}`).href
  window.open(url, '_blank', 'noopener,noreferrer')
}

function acessarDetalheLoja(slug) {
  router.push(`/stores/${slug}/detail`)
}

onMounted(() => {
  if (route.query.tab === 'create') {
    activeTab.value = 'create'
  }
  lojaStore.listarLojas()
  themeStore.initDynamicCss()
})
</script>

<style scoped>
button {
  cursor: pointer;
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
