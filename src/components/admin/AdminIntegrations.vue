<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDiscordStore } from '@/stores/discordStore'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faRobot, 
  faPlus, 
  faPaperPlane, 
  faTrash, 
  faPen, 
  faCheck, 
  faXmark, 
  faSpinner, 
  faTriangleExclamation,
  faLink,
  faCircle,
  faClock,
  faShieldHalved,
  faCopy
} from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/ui/Button.vue'

library.add(
  faRobot, faPlus, faPaperPlane, faTrash, faPen, faCheck, 
  faXmark, faSpinner, faTriangleExclamation, faLink, faCircle, 
  faClock, faShieldHalved, faCopy
)

const discordStore = useDiscordStore()

// Modal and Form states
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const actionLoading = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })

const form = ref({
  name: '',
  webhook_url: '',
  channel_type: 'errors-log',
  is_active: true,
  events: ['system.error', 'system.exception']
})

const availableChannelTypes = [
  { value: 'errors-log', label: '🚨 Logs de Erros & Exceções' },
  { value: 'migrations-log', label: '🗄️ Logs de Migrações do Banco (Deploy)' },
  { value: 'general', label: '📢 Canal Geral / Notificações' },
  { value: 'leads', label: '📊 Métricas & Acessos de Lojas' },
  { value: 'system', label: '⚙️ Alertas de Sistema' },
]

const availableEvents = [
  { key: 'system.error', label: 'Erros fatais do sistema' },
  { key: 'system.exception', label: 'Exceções HTTP 500' },
  { key: 'migration.started', label: 'Início da execução de migrations (Deploy)' },
  { key: 'migration.success', label: 'Sucesso das migrations (Deploy)' },
  { key: 'migration.failed', label: 'Falha/Erro nas migrations (Deploy)' },
  { key: 'system.test', label: 'Testes de webhook' },
  { key: 'store.created', label: 'Criação de novas vitrines' },
]

onMounted(() => {
  discordStore.fetchWebhooks()
})

const activeWebhooksCount = computed(() => {
  return discordStore.webhooks.filter(w => w.is_active).length
})

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

function openAddModal() {
  isEditing.value = false
  editingId.value = null
  form.value = {
    name: '',
    webhook_url: '',
    channel_type: 'errors-log',
    is_active: true,
    events: ['system.error', 'system.exception']
  }
  showModal.value = true
}

function openEditModal(bot) {
  isEditing.value = true
  editingId.value = bot.id
  form.value = {
    name: bot.name,
    webhook_url: bot.webhook_url,
    channel_type: bot.channel_type || 'errors-log',
    is_active: Boolean(bot.is_active),
    events: bot.events || ['system.error']
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function toggleEvent(eventKey) {
  const index = form.value.events.indexOf(eventKey)
  if (index === -1) {
    form.value.events.push(eventKey)
  } else {
    form.value.events.splice(index, 1)
  }
}

async function handleSubmit() {
  if (!form.value.name || !form.value.webhook_url) {
    showToast('Por favor, preencha o nome e a URL do Webhook do Discord.', 'error')
    return
  }

  actionLoading.value = true
  try {
    if (isEditing.value) {
      await discordStore.updateWebhook(editingId.value, form.value)
      showToast('Bot do Discord atualizado com sucesso!')
    } else {
      await discordStore.addWebhook(form.value)
      showToast('Bot do Discord cadastrado com sucesso!')
    }
    closeModal()
  } catch (err) {
    showToast(discordStore.error || 'Ocorreu um erro ao salvar o Bot.', 'error')
  } finally {
    actionLoading.value = false
  }
}

async function handleTest(bot) {
  try {
    const res = await discordStore.testWebhook(bot.id)
    showToast(res.message || 'Mensagem de teste enviada ao canal do Discord!')
  } catch (err) {
    showToast(err.message || 'Erro ao enviar mensagem de teste.', 'error')
  }
}

async function handleDelete(bot) {
  if (!confirm(`Deseja realmente remover o Bot/Webhook "${bot.name}"?`)) {
    return
  }

  try {
    await discordStore.deleteWebhook(bot.id)
    showToast('Bot/Webhook removido com sucesso!')
  } catch (err) {
    showToast(discordStore.error || 'Erro ao remover bot.', 'error')
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  showToast('URL do Webhook copiada para a área de transferência!')
}

function formatDate(dateStr) {
  if (!dateStr) return 'Nunca enviado'
  const date = new Date(dateStr)
  return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function maskUrl(url) {
  if (!url) return ''
  if (url.length <= 40) return url
  return url.substring(0, 35) + '...' + url.substring(url.length - 8)
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 pb-12">
    <!-- Toast Notification -->
    <transition name="toast">
      <div 
        v-if="toast.show" 
        :class="[
          'fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-white font-medium text-sm transition-all duration-300',
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        ]"
      >
        <font-awesome-icon :icon="toast.type === 'error' ? 'triangle-exclamation' : 'check'" class="w-5 h-5" />
        <span>{{ toast.message }}</span>
      </div>
    </transition>

    <!-- Header Banner Discord Theme -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 text-white shadow-xl border border-indigo-700/50">
      <div class="absolute -right-10 -bottom-10 opacity-10 text-white pointer-events-none">
        <font-awesome-icon icon="robot" class="w-80 h-80" />
      </div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="px-3 py-1 bg-indigo-500/30 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-indigo-400/30 text-indigo-200">
              Módulo de Integrações
            </span>
            <span class="px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-emerald-400/30 text-emerald-300 flex items-center gap-1.5">
              <font-awesome-icon icon="circle" class="w-2 h-2 animate-pulse text-emerald-400" />
              Discord Active
            </span>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <font-awesome-icon icon="robot" class="text-indigo-300" />
            Integração com Webhooks do Discord
          </h1>
          <p class="mt-2 text-indigo-200 max-w-2xl text-sm leading-relaxed">
            Cadastre novos bots e webhooks do Discord para receber notificações automáticas do sistema, alertas de erros em tempo real (Canal de erros-log) e eventos da plataforma.
          </p>
        </div>

        <div>
          <button 
            @click="openAddModal"
            class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <font-awesome-icon icon="plus" />
            Adicionar Novo Bot
          </button>
        </div>
      </div>

      <!-- Quick Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-indigo-700/50">
        <div class="bg-indigo-950/40 backdrop-blur-sm p-4 rounded-xl border border-indigo-700/30">
          <div class="text-xs text-indigo-300 font-medium">Total de Webhooks</div>
          <div class="text-2xl font-bold text-white mt-1">{{ discordStore.webhooks.length }}</div>
        </div>
        <div class="bg-indigo-950/40 backdrop-blur-sm p-4 rounded-xl border border-indigo-700/30">
          <div class="text-xs text-indigo-300 font-medium">Webhooks Ativos</div>
          <div class="text-2xl font-bold text-emerald-400 mt-1">{{ activeWebhooksCount }}</div>
        </div>
        <div class="bg-indigo-950/40 backdrop-blur-sm p-4 rounded-xl border border-indigo-700/30">
          <div class="text-xs text-indigo-300 font-medium">Status da Conexão</div>
          <div class="text-sm font-semibold text-indigo-200 mt-1 flex items-center gap-2">
            <font-awesome-icon icon="shield-halved" class="text-emerald-400" />
            Monitoramento HTTP OK
          </div>
        </div>
      </div>
    </div>

    <!-- Webhooks List -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Bots e Webhooks Cadastrados</h2>
          <p class="text-sm text-gray-500">Gerencie as URLs de Webhook que enviam mensagens para o seu servidor Discord</p>
        </div>
        <button 
          @click="discordStore.fetchWebhooks" 
          class="text-sm text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5"
          :disabled="discordStore.loading"
        >
          <font-awesome-icon icon="spinner" :class="{ 'animate-spin': discordStore.loading }" />
          Atualizar Lista
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="discordStore.loading && discordStore.webhooks.length === 0" class="py-12 text-center text-gray-500">
        <font-awesome-icon icon="spinner" class="animate-spin text-3xl text-indigo-600 mb-3" />
        <p class="text-sm">Carregando bots integrados...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="discordStore.webhooks.length === 0" class="py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
        <font-awesome-icon icon="robot" class="text-4xl text-gray-300 mb-3" />
        <h3 class="text-lg font-bold text-gray-700">Nenhum bot do Discord cadastrado</h3>
        <p class="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-4">
          Adicione seu primeiro Webhook do Discord para receber alertas de erros e notificações automáticas do sistema.
        </p>
        <button 
          @click="openAddModal"
          class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <font-awesome-icon icon="plus" />
          Cadastrar Webhook
        </button>
      </div>

      <!-- Webhooks Grid Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="bot in discordStore.webhooks" 
          :key="bot.id"
          class="bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
        >
          <div>
            <!-- Card Header -->
            <div class="flex items-start justify-between gap-4 mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-200">
                  <font-awesome-icon icon="robot" class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 text-base leading-tight">{{ bot.name }}</h3>
                  <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md mt-1" :class="bot.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'">
                    <font-awesome-icon icon="circle" class="w-1.5 h-1.5" :class="bot.is_active ? 'text-emerald-500' : 'text-gray-400'" />
                    {{ bot.is_active ? 'Ativo' : 'Inativo' }}
                  </span>
                </div>
              </div>

              <!-- Channel Type Badge -->
              <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-indigo-200/60 uppercase tracking-wider">
                {{ bot.channel_type || 'general' }}
              </span>
            </div>

            <!-- Webhook URL Box -->
            <div class="bg-white border border-gray-200 rounded-xl p-3 my-4 flex items-center justify-between text-xs text-gray-600 font-mono">
              <div class="truncate flex items-center gap-2 pr-2">
                <font-awesome-icon icon="link" class="text-gray-400 flex-shrink-0" />
                <span class="truncate" :title="bot.webhook_url">{{ maskUrl(bot.webhook_url) }}</span>
              </div>
              <button 
                @click="copyToClipboard(bot.webhook_url)"
                class="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                title="Copiar URL"
              >
                <font-awesome-icon icon="copy" />
              </button>
            </div>

            <!-- Subscribed Events -->
            <div class="mb-4">
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Eventos Notificados</span>
              <div class="flex flex-wrap gap-1.5">
                <span 
                  v-for="ev in (bot.events || ['system.error'])" 
                  :key="ev"
                  class="bg-gray-200/80 text-gray-700 text-xs px-2 py-0.5 rounded-md font-medium"
                >
                  {{ ev }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card Footer & Actions -->
          <div class="pt-4 border-t border-gray-200/60 flex items-center justify-between gap-2">
            <div class="text-xs text-gray-400 flex items-center gap-1.5">
              <font-awesome-icon icon="clock" class="w-3 h-3" />
              <span>Último envio: {{ formatDate(bot.last_sent_at) }}</span>
            </div>

            <div class="flex items-center gap-2">
              <button 
                @click="handleTest(bot)"
                :disabled="discordStore.testingId === bot.id"
                class="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                title="Enviar mensagem de teste no canal do Discord"
              >
                <font-awesome-icon icon="spinner" v-if="discordStore.testingId === bot.id" class="animate-spin" />
                <font-awesome-icon icon="paper-plane" v-else />
                <span>Testar</span>
              </button>

              <button 
                @click="openEditModal(bot)"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg text-xs transition-colors"
                title="Editar Bot"
              >
                <font-awesome-icon icon="pen" />
              </button>

              <button 
                @click="handleDelete(bot)"
                class="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg text-xs transition-colors"
                title="Excluir Bot"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form (Add / Edit) -->
    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border border-gray-100 animate-in fade-in zoom-in duration-200">
          <!-- Close Button -->
          <button 
            @click="closeModal" 
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <font-awesome-icon icon="xmark" class="w-5 h-5" />
          </button>

          <!-- Modal Title -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <font-awesome-icon icon="robot" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">
                {{ isEditing ? 'Editar Bot do Discord' : 'Novo Bot do Discord' }}
              </h3>
              <p class="text-xs text-gray-500">Configure as credenciais e o canal de envio</p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Nome do Bot -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Nome do Bot / Canal *
              </label>
              <input 
                v-model="form.name" 
                type="text" 
                placeholder="Ex: Canal de erros-log"
                required
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
              />
            </div>

            <!-- URL do Webhook -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                URL do Webhook do Discord *
              </label>
              <input 
                v-model="form.webhook_url" 
                type="url" 
                placeholder="https://discordapp.com/api/webhooks/..."
                required
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono transition-all"
              />
              <span class="text-[11px] text-gray-400 mt-1 block">
                No Discord, vá em Configurações do Canal > Integrações > Webhooks > Criar Webhook.
              </span>
            </div>

            <!-- Tipo de Canal -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Tipo de Canal
              </label>
              <select 
                v-model="form.channel_type"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all bg-white"
              >
                <option v-for="ch in availableChannelTypes" :key="ch.value" :value="ch.value">
                  {{ ch.label }}
                </option>
              </select>
            </div>

            <!-- Eventos Notificados -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Eventos Inscritos
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label 
                  v-for="ev in availableEvents" 
                  :key="ev.key"
                  class="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer text-xs transition-colors"
                >
                  <input 
                    type="checkbox"
                    :checked="form.events.includes(ev.key)"
                    @change="toggleEvent(ev.key)"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span class="text-gray-700 font-medium">{{ ev.label }}</span>
                </label>
              </div>
            </div>

            <!-- Status Ativo/Inativo -->
            <div class="pt-2">
              <label class="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="form.is_active"
                  class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-5 h-5"
                />
                <div>
                  <span class="text-sm font-bold text-gray-800">Bot Ativo</span>
                  <span class="block text-xs text-gray-500">Enviar mensagens e notificações para este webhook</span>
                </div>
              </label>
            </div>

            <!-- Buttons -->
            <div class="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button 
                type="button" 
                @click="closeModal"
                class="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <Button 
                type="submit" 
                :disabled="actionLoading"
                class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2"
              >
                <font-awesome-icon icon="spinner" v-if="actionLoading" class="animate-spin" />
                <span>{{ isEditing ? 'Salvar Alterações' : 'Cadastrar Bot' }}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
