<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-10">
    
    <!-- Top Header Card -->
    <div class="bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
            <i class="fa-solid fa-headset text-[10px]"></i> Atendimento WhatsApp
          </span>
          <span class="text-xs text-gray-400 font-medium">({{ contactStore.contatos.length }} contatos cadastrados)</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-gray-900">
          Gestão de Contatos & Atendentes
        </h1>
        <p class="text-xs text-gray-500">
          Cadastre contatos de WhatsApp e atribua a qual vitrine digital eles pertencem.
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
          <i class="fa-solid fa-address-book"></i>
          <span>Meus Contatos ({{ contactStore.contatos.length }})</span>
        </button>

        <button
          @click="novoContatoTab"
          :class="[
            'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer',
            activeTab === 'create' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
          ]"
        >
          <i class="fa-solid fa-user-plus text-xs"></i>
          <span>{{ editIndex !== null ? 'Editar Contato' : 'Cadastrar Contato' }}</span>
        </button>
      </div>
    </div>

    <!-- TAB 1: LISTA DE CONTATOS -->
    <div v-show="activeTab === 'list'" class="space-y-4 animate-fade-in">
      
      <!-- Filter & Search Bar -->
      <div v-if="contactStore.contatos.length > 0" class="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="relative w-full sm:w-80">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nome ou whatsapp..."
            class="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
        </div>

        <span class="text-xs text-gray-500 font-medium">
          Exibindo {{ filteredContatos.length }} de {{ contactStore.contatos.length }} contatos
        </span>
      </div>

      <!-- Loading State -->
      <Loading v-if="contactStore.carregando" text="Carregando seus contatos..." />

      <!-- Erro -->
      <div v-else-if="contactStore.erro" class="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-semibold">
        {{ contactStore.erro }}
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredContatos.length === 0" class="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center space-y-4">
        <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
          <i class="fa-solid fa-address-card"></i>
        </div>
        <h3 class="text-base font-bold text-gray-900">
          {{ searchQuery ? 'Nenhum contato encontrado para a busca.' : 'Nenhum contato cadastrado.' }}
        </h3>
        <p class="text-xs text-gray-500 max-w-sm mx-auto">
          {{ searchQuery ? 'Tente pesquisar por outro nome.' : 'Cadastre seu primeiro número de WhatsApp para exibir na sua vitrine.' }}
        </p>
        <button
          @click="novoContatoTab"
          class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <i class="fa-solid fa-user-plus"></i> Cadastrar Novo Contato
        </button>
      </div>

      <!-- Grid de Contatos -->
      <ul v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ContactCard
          v-for="contact in filteredContatos"
          :key="contact.id"
          :contact="contact"
          @edit="editarContato"
          @delete="excluirContato"
        />
      </ul>

    </div>

    <!-- TAB 2: FORMULÁRIO DE CADASTRO/EDIÇÃO DE CONTATO -->
    <div v-show="activeTab === 'create'" class="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-fade-in max-w-2xl mx-auto">
      
      <div class="border-b pb-4 flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-gray-900 flex items-center gap-2">
            <i :class="editIndex !== null ? 'fa-solid fa-pen-to-square text-indigo-600' : 'fa-solid fa-user-plus text-emerald-600'"></i>
            <span>{{ editIndex !== null ? 'Editar Contato' : 'Cadastrar Novo Contato' }}</span>
          </h2>
          <p class="text-xs text-gray-500">Preencha os dados do atendente e selecione as vitrines em que ele aparecerá</p>
        </div>
        <span v-if="editIndex !== null" class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          Modo Edição
        </span>
      </div>

      <!-- Erros do Formulário -->
      <div v-if="erros.length" class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 space-y-1">
        <p class="font-bold">Atenção:</p>
        <ul class="list-disc pl-4 space-y-0.5">
          <li v-for="(erro, index) in erros" :key="index">{{ erro }}</li>
        </ul>
      </div>

      <div class="space-y-4">
        
        <!-- 1. Nome -->
        <div class="space-y-1">
          <label class="block text-xs font-bold text-gray-700">
            <i class="fa-solid fa-user text-indigo-500 mr-1"></i> Nome do Contato / Atendente *
          </label>
          <input
            v-model="name"
            type="text"
            placeholder="Ex: Suporte WhatsApp / Dr. Roberto"
            class="w-full p-2.5 border border-gray-300 rounded-xl text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all font-semibold"
          />
        </div>

        <!-- 2. WhatsApp -->
        <div class="space-y-1">
          <label class="block text-xs font-bold text-gray-700">
            <i class="fa-brands fa-whatsapp text-emerald-600 mr-1"></i> Número de WhatsApp *
          </label>
          <input
            v-model="whatsapp"
            type="text"
            placeholder="Ex: 11999998888"
            class="w-full p-2.5 border border-gray-300 rounded-xl text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
          />
          <p class="text-[10px] text-gray-400">Digite com DDD (ex: 11999998888 ou 21988887777).</p>
        </div>

        <!-- 3. Foto Upload -->
        <div class="space-y-1">
          <label class="block text-xs font-bold text-gray-700">
            <i class="fa-solid fa-camera text-indigo-500 mr-1"></i> Foto de Perfil (Opcional)
          </label>
          
          <div class="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-2xl">
            <div class="relative">
              <img
                :src="foto || 'https://via.placeholder.com/56?text=Foto'"
                alt="Pré-visualização"
                class="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-xs shrink-0"
              />
              <button
                v-if="foto"
                @click.stop="removeFoto"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-xs cursor-pointer"
                title="Remover foto"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="space-y-1">
              <input type="file" accept="image/*" @change="handleFotoUpload" class="hidden" id="foto-contato-upload" />
              <label
                for="foto-contato-upload"
                class="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-white border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 hover:border-indigo-400 transition-all shadow-xs"
              >
                <i class="fa-solid fa-upload text-indigo-600"></i> Selecionar Foto
              </label>
              <p class="text-[10px] text-gray-400">Formatos suportados: PNG, JPG ou WebP.</p>
            </div>
          </div>
        </div>

        <!-- 4. Vinculação de Vitrines -->
        <div class="space-y-2 pt-2">
          <label class="block text-xs font-bold text-gray-700 flex items-center justify-between">
            <span><i class="fa-solid fa-store text-indigo-500 mr-1"></i> Vincular a Vitrines *</span>
            <span class="text-[10px] font-normal text-gray-400">Clique nas vitrines para marcar</span>
          </label>

          <div v-if="lojaStore.lojas.length === 0" class="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 text-center font-medium">
            Nenhuma vitrine encontrada. Cadastre primeiro uma vitrine.
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="loja in lojaStore.lojas"
              :key="loja.id"
              @click="toggleLoja(loja.id)"
              :class="[
                'p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all select-none',
                empresaSelecionada.includes(loja.id)
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-xs'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              ]"
            >
              <div class="flex items-center gap-2 min-w-0">
                <img :src="loja.logo_url" alt="" class="w-6 h-6 rounded-lg object-cover shrink-0" />
                <span class="truncate">{{ loja.name }}</span>
              </div>
              
              <div :class="[
                'w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all',
                empresaSelecionada.includes(loja.id) ? 'bg-indigo-600 text-white' : 'border border-gray-300 bg-white'
              ]">
                <i v-if="empresaSelecionada.includes(loja.id)" class="fa-solid fa-check"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="pt-4 border-t flex items-center justify-end gap-3">
          <button
            @click="cancelarFormulario"
            class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            @click="cadastrarContato"
            :disabled="contactStore.cadastrando || contactStore.carregando"
            class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <i v-if="contactStore.cadastrando" class="fa-solid fa-circle-notch fa-spin"></i>
            <i v-else :class="editIndex !== null ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-plus'"></i>
            <span>{{ contactStore.cadastrando ? 'Salvando...' : (editIndex !== null ? 'Atualizar Contato' : 'Cadastrar Contato') }}</span>
          </button>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContactStore } from '../../stores/contactStore'
import { useLojaStore } from '../../stores/lojaStore'
import { useFeedbackStore } from '../../stores/feedbackStore'
import Loading from '../ui/Loading.vue'
import ContactCard from '../ui/ContactCard.vue'

const contactStore = useContactStore()
const lojaStore = useLojaStore()
const feedbackStore = useFeedbackStore()

const activeTab = ref('list') // 'list' | 'create'
const searchQuery = ref('')

const name = ref('')
const whatsapp = ref('')
const foto = ref(null)
const empresaSelecionada = ref([])
const editIndex = ref(null)
const erros = ref([])

const filteredContatos = computed(() => {
  if (!searchQuery.value.trim()) return contactStore.contatos
  const q = searchQuery.value.toLowerCase().trim()
  return contactStore.contatos.filter(c => 
    c.name?.toLowerCase().includes(q) || 
    c.whatsapp?.includes(q)
  )
})

function novoContatoTab() {
  resetForm()
  activeTab.value = 'create'
}

function handleFotoUpload(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = () => {
      foto.value = reader.result
    }
    reader.readAsDataURL(file)
  } else {
    feedbackStore.showError('Por favor, envie uma imagem válida.')
  }
}

function validateForm() {
  erros.value = []

  if (!name.value.trim()) erros.value.push('Nome do contato é obrigatório')

  const whatsappRegex = /^(?:(?:\+|00)?55\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:9\s?)?([0-9]{4,5})-?([0-9]{4})$/
  if (!whatsapp.value.trim()) {
    erros.value.push('Número de WhatsApp é obrigatório')
  } else if (!whatsappRegex.test(whatsapp.value)) {
    erros.value.push('Formato de WhatsApp inválido (exemplo: 11999998888)')
  }

  if (!empresaSelecionada.value.length) {
    erros.value.push('Selecione pelo menos uma vitrine digital')
  }

  return erros.value.length === 0
}

async function cadastrarContato() {
  if (!validateForm()) return

  const contato = {
    name: name.value,
    whatsapp: whatsapp.value,
    fotoBase64: foto.value,
    lojasIds: empresaSelecionada.value
  }

  try {
    if (editIndex.value !== null) {
      await contactStore.editarContato(editIndex.value, contato)
      feedbackStore.showSuccess('Contato editado com sucesso!')
    } else {
      await contactStore.adicionarContato(contato)
      feedbackStore.showSuccess('Contato cadastrado com sucesso!')
    }

    await contactStore.listarContatos()
    resetForm()
    activeTab.value = 'list'

  } catch (error) {
    feedbackStore.showError(error.message || 'Erro na operação ao salvar contato')
  }
}

function editarContato(id) {
  const c = contactStore.contatos.find(contato => contato.id === id)
  if (!c) return

  erros.value = []
  name.value = c.name
  whatsapp.value = c.whatsapp
  foto.value = c.photo
  empresaSelecionada.value = (c.stores || []).map(loja => loja?.id)
  editIndex.value = id
  activeTab.value = 'create'
}

function removeFoto() {
  foto.value = null
  const fileInput = document.getElementById('foto-contato-upload')
  if (fileInput) fileInput.value = ''
}

async function excluirContato(id) {
  const confirmed = await feedbackStore.confirm({
    title: 'Excluir Contato',
    message: 'Deseja realmente excluir este contato?'
  })
  if (confirmed) {
    try {
      await contactStore.excluirContato(id)
      feedbackStore.showSuccess('Contato excluído com sucesso!')
    } catch (error) {
      feedbackStore.showError('Erro ao excluir contato: ' + (error.message || 'Tente novamente.'))
    }
  }
}

function toggleLoja(lojaId) {
  const index = empresaSelecionada.value.indexOf(lojaId)
  if (index === -1) {
    empresaSelecionada.value.push(lojaId)
  } else {
    empresaSelecionada.value.splice(index, 1)
  }
}

function resetForm() {
  name.value = ''
  whatsapp.value = ''
  empresaSelecionada.value = []
  foto.value = null
  removeFoto()
  editIndex.value = null
  erros.value = []
}

function cancelarFormulario() {
  resetForm()
  activeTab.value = 'list'
}

onMounted(() => {
  lojaStore.listarLojas()
  contactStore.listarContatos()
  contactStore.carregarNomesLojas()
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
