<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-10">
    
    <!-- Hero Header Banner Card -->
    <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-indigo-700/30">
      <!-- Background Decorative Elements -->
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute right-40 -top-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div class="space-y-2 z-10 max-w-xl">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-indigo-200 border border-white/10 flex items-center gap-1.5">
            <i class="fa-solid fa-sparkles text-amber-400"></i> Painel Geral
          </span>
          <span class="text-xs text-gray-300 font-mono">{{ dataAtual }}</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
          Minhas Vitrines Digitais
        </h1>
        <p class="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
          Gerencie seus links, contatos de atendimento e personalize seus temas em tempo real.
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-wrap items-center gap-3 z-10 shrink-0">
        <button 
          @click="irParaNovesVitrines" 
          class="px-4 py-3 bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <i class="fa-solid fa-plus text-indigo-600"></i>
          <span>Nova Vitrine</span>
        </button>

        <button 
          @click="irParaNovoContato" 
          class="px-4 py-3 bg-indigo-600/60 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl border border-indigo-400/30 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <i class="fa-solid fa-user-plus"></i>
          <span>Novo Contato</span>
        </button>
      </div>
    </div>

    <!-- Overview KPI Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Vitrines -->
      <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
        <div class="space-y-1">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Vitrines Cadastradas</span>
          <div class="text-2xl font-black text-gray-900">{{ lojaStore.lojas.length }}</div>
          <span class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <i class="fa-solid fa-check-circle"></i> {{ lojaStore.lojas.length }} Ativas
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 text-xl font-bold">
          <i class="fa-solid fa-store"></i>
        </div>
      </div>

      <!-- Total Contatos -->
      <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
        <div class="space-y-1">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Atendentes / Contatos</span>
          <div class="text-2xl font-black text-gray-900">{{ contactStore.contatos.length }}</div>
          <span class="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
            <i class="fa-solid fa-headset"></i> Vinculados
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-xl font-bold">
          <i class="fa-brands fa-whatsapp"></i>
        </div>
      </div>

      <!-- Total Links -->
      <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
        <div class="space-y-1">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Links Totais</span>
          <div class="text-2xl font-black text-gray-900">{{ totalLinks }}</div>
          <span class="text-[10px] text-gray-500 font-medium">Em todas as vitrines</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 text-xl font-bold">
          <i class="fa-solid fa-link"></i>
        </div>
      </div>

      <!-- Temas Disponíveis -->
      <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
        <div class="space-y-1">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Temas Disponíveis</span>
          <div class="text-2xl font-black text-gray-900">{{ themeStore.allThemes.length }}</div>
          <span class="text-[10px] text-purple-600 font-semibold flex items-center gap-1">
            <i class="fa-solid fa-crown text-amber-500"></i> Padrão & Premium VIP
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 text-xl font-bold">
          <i class="fa-solid fa-palette"></i>
        </div>
      </div>
    </div>

    <!-- Main Content Grid (2 Columns: Stores & Quick Access) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left Column: Minhas Vitrines (8 Cols) -->
      <div class="lg:col-span-8 space-y-4">
        
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b pb-4">
            <div>
              <h2 class="text-base font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-store text-indigo-600"></i> Minhas Vitrines
              </h2>
              <p class="text-xs text-gray-500">Gerencie e acesse suas vitrines digitais</p>
            </div>

            <button 
              @click="irParaVitrines" 
              class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Ver todas</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>

          <!-- Loading State -->
          <Loading v-if="lojaStore.carregando" text="Carregando vitrines..." />

          <!-- Erro -->
          <div v-else-if="lojaStore.erro" class="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
            {{ lojaStore.erro }}
          </div>

          <!-- Empty State -->
          <div v-else-if="lojaStore.lojas.length === 0" class="p-10 border border-dashed border-gray-300 rounded-2xl text-center space-y-3">
            <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              <i class="fa-solid fa-store-slash"></i>
            </div>
            <h3 class="text-sm font-bold text-gray-800">Nenhuma vitrine cadastrada ainda</h3>
            <p class="text-xs text-gray-500 max-w-sm mx-auto">
              Crie sua primeira vitrine digital para organizar seus links e contatos em um só lugar.
            </p>
            <button 
              @click="irParaNovesVitrines" 
              class="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-indigo-700 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <i class="fa-solid fa-plus"></i> Cadastrar Minha Primeira Vitrine
            </button>
          </div>

          <!-- Stores Grid -->
          <ul v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StoreCard 
              v-for="(loja, index) in lojaStore.lojas" 
              :key="loja.id" 
              :store="loja" 
              :index="index"
              @access="acessarLoja"
              @detail="acessarDetalheLoja"
              @edit="irParaVitrines"
              @delete="deletarLoja"
            />
          </ul>
        </div>

      </div>

      <!-- Right Column: Shortcuts & Contatos Recentes (4 Cols) -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- Atalhos Rápidos Card -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-bolt text-amber-500"></i> Atalhos Rápidos
          </h3>

          <div class="space-y-2">
            <button 
              @click="irParaNovesVitrines" 
              class="w-full p-3 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <i class="fa-solid fa-circle-plus"></i>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">Cadastrar Vitrine</h4>
                  <p class="text-[10px] text-gray-500">Crie um novo link na bio</p>
                </div>
              </div>
              <i class="fa-solid fa-chevron-right text-xs text-gray-400 group-hover:text-indigo-600 transition-colors"></i>
            </button>

            <button 
              @click="irParaNovoContato" 
              class="w-full p-3 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <i class="fa-solid fa-user-plus"></i>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">Novo Atendente</h4>
                  <p class="text-[10px] text-gray-500">Cadastre número no WhatsApp</p>
                </div>
              </div>
              <i class="fa-solid fa-chevron-right text-xs text-gray-400 group-hover:text-indigo-600 transition-colors"></i>
            </button>
          </div>
        </div>

        <!-- Contatos Cadastrados Recentes -->
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b pb-3">
            <h3 class="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <i class="fa-solid fa-headset text-indigo-600"></i> Atendentes Recentes
            </h3>
            <button @click="irParaNovoContato" class="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer">
              Ver todos
            </button>
          </div>

          <div v-if="contactStore.contatos.length === 0" class="text-center py-6 text-xs text-gray-400 italic">
            Nenhum contato cadastrado.
          </div>

          <div v-else class="space-y-2 max-h-80 overflow-y-auto pr-1">
            <div 
              v-for="contato in contactStore.contatos.slice(0, 5)" 
              :key="contato.id" 
              class="p-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-2 hover:bg-white hover:shadow-xs transition-all"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <img 
                  :src="contato.photo || 'https://via.placeholder.com/32'" 
                  alt="Foto" 
                  class="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200 shrink-0" 
                />
                <div class="min-w-0">
                  <p class="text-xs font-bold text-gray-800 truncate">{{ contato.name }}</p>
                  <p class="text-[10px] text-emerald-600 font-semibold truncate flex items-center gap-1">
                    <i class="fa-brands fa-whatsapp"></i> {{ contato.whatsapp }}
                  </p>
                </div>
              </div>

              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
                {{ contato.stores ? contato.stores.length : 0 }} vitrines
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLojaStore } from '@/stores/lojaStore'
import { useContactStore } from '@/stores/contactStore'
import { useThemeStore } from '@/stores/themeStore'
import { useFeedbackStore } from '@/stores/feedbackStore'
import Loading from '../ui/Loading.vue'
import StoreCard from '../ui/StoreCard.vue'

const router = useRouter()
const lojaStore = useLojaStore()
const contactStore = useContactStore()
const themeStore = useThemeStore()
const feedbackStore = useFeedbackStore()

const dataAtual = computed(() => {
  const h = new Date()
  return h.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
})

const totalLinks = computed(() => {
  if (!lojaStore.lojas || !Array.isArray(lojaStore.lojas)) return 0
  return lojaStore.lojas.reduce((acc, l) => acc + (l.links ? l.links.length : 0), 0)
})

function irParaVitrines() {
  router.push('/stores')
}

function irParaNovesVitrines() {
  router.push('/stores?tab=create')
}

function irParaNovoContato() {
  router.push('/contacts')
}

function acessarLoja(slug) {
  const url = router.resolve(`/${slug}`).href
  window.open(url, '_blank', 'noopener,noreferrer')
}

function acessarDetalheLoja(slug) {
  router.push(`/stores/${slug}/detail`)
}

async function deletarLoja(index) {
  const confirmed = await feedbackStore.confirm({
    title: 'Excluir Vitrine',
    message: 'Deseja realmente excluir esta vitrine?'
  })
  if (confirmed) {
    try {
      await lojaStore.excluirLoja(lojaStore.lojas[index].id)
      feedbackStore.showSuccess('Loja excluída com sucesso!')
    } catch (error) {
      feedbackStore.showError('Erro ao excluir loja: ' + (error.message || 'Tente novamente.'))
    }
  }
}

onMounted(() => {
  lojaStore.listarLojas()
  contactStore.listarContatos()
  themeStore.initDynamicCss()
})
</script>

<style scoped>
button {
  cursor: pointer;
}
</style>