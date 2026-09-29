<template>
  <div class="max-w-4xl mx-auto pb-12">
    <Loading v-if="lojaStore.carregando" text="Carregando detalhes da vitrine..." />
    <div v-else-if="loja" class="space-y-8">
      
      <!-- Top Bar & Title -->
      <div class="flex items-center justify-between border-b pb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Gerenciar Vitrine</h1>
          <p class="text-xs text-gray-500">Personalize o tema visual, links e compartilhamento da sua loja</p>
        </div>
        <button @click="back" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-2 transition-all">
          <i class="fa-solid fa-arrow-left"></i> Voltar às Lojas
        </button>
      </div>

      <!-- Header da Loja -->
      <section class="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <img :src="loja.logo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'" alt="Logo da Loja" class="w-24 h-24 rounded-2xl object-cover shadow-sm ring-2 ring-indigo-50" />
        <div class="text-center sm:text-left space-y-1">
          <div class="flex items-center justify-center sm:justify-start gap-2">
            <h2 class="text-2xl font-bold text-gray-900">{{ loja.name }}</h2>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Ativa</span>
          </div>
          <p class="text-sm text-gray-500 max-w-md">{{ loja.description || 'Nenhuma descrição cadastrada para a vitrine.' }}</p>
          <div class="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
            <a :href="longUrl" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Ver Vitrine Pública
            </a>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION: TEMAS E CUSTOMIZAÇÃO VISUAL      -->
      <!-- ========================================== -->
      <section class="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <i class="fa-solid fa-palette text-indigo-600"></i> Tema Visual da Vitrine
            </h3>
            <p class="text-xs text-gray-500">Escolha um estilo visual exclusivo (incluindo temas 👑 Premium VIP com layouts profissionais)</p>
          </div>
          
          <div v-if="activeThemeObj?.isPremium" class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800">
            <i class="fa-solid fa-crown"></i> Tema Premium Ativo
          </div>
        </div>

        <!-- Filtros por Categoria -->
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="tab in filterTabs" 
            :key="tab.id"
            @click="selectedCategoryTab = tab.id"
            :class="[
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5',
              selectedCategoryTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <!-- Dropdown de Seleção de Temas -->
        <div class="space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-600">Selecione o Tema Desejado:</label>
          <select 
            v-model="selectedTheme" 
            @change="handleThemeChange" 
            class="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
          >
            <option value="" disabled>Escolha um tema visual...</option>
            
            <optgroup v-if="filteredThemes.some(t => t.isPremium)" label="👑 TEMAS PREMIUM VIP (Layouts Especiais)">
              <option v-for="t in filteredThemes.filter(t => t.isPremium)" :key="t.id" :value="t.id">
                👑 {{ t.label }}
              </option>
            </optgroup>

            <optgroup v-if="filteredThemes.some(t => !t.isPremium && (t.category === 'gradient' || t.colors?.background?.includes('gradient')))" label="🎨 TEMAS GRADIENTE">
              <option v-for="t in filteredThemes.filter(t => !t.isPremium && (t.category === 'gradient' || t.colors?.background?.includes('gradient')))" :key="t.id" :value="t.id">
                🎨 {{ t.label }}
              </option>
            </optgroup>

            <optgroup v-if="filteredThemes.some(t => !t.isPremium && t.category !== 'gradient')" label="⚡ TEMAS PADRÃO DO SISTEMA">
              <option v-for="t in filteredThemes.filter(t => !t.isPremium && t.category !== 'gradient')" :key="t.id" :value="t.id">
                ⚡ {{ t.label }}
              </option>
            </optgroup>
          </select>
        </div>

        <!-- Botoes de Acao de Tema -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button 
            @click="aplicarTema" 
            :disabled="salvandoTema"
            class="flex-1 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <i v-if="salvandoTema" class="fa-solid fa-circle-notch fa-spin"></i>
            <i v-else class="fa-solid fa-check"></i>
            <span>{{ salvandoTema ? 'Aplicando Tema...' : 'Aplicar este Tema à Vitrine' }}</span>
          </button>
          
          <button 
            v-if="isPreview"
            @click="cancelarPreview" 
            class="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            Restaurar Original
          </button>
        </div>

        <!-- Previsualizacao Responsiva em Smartphone Mockup -->
        <div class="pt-4 border-t">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-bold text-gray-700 flex items-center gap-2">
              <i class="fa-solid fa-mobile-screen text-indigo-500"></i> Pré-visualização em Tempo Real (Mockup Celular)
            </h4>
            <span class="text-xs text-gray-500">Tema em exibição: <strong class="text-indigo-600">{{ activeThemeObj?.label }}</strong></span>
          </div>

          <!-- Smartphone Frame Container -->
          <div class="relative mx-auto w-full max-w-[340px] bg-slate-900 rounded-[40px] p-3.5 shadow-2xl ring-1 ring-slate-800 border-4 border-slate-800">
            <!-- Camera Notch -->
            <div class="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
              <div class="w-3 h-3 bg-slate-800 rounded-full mr-2"></div>
              <div class="w-2 h-2 bg-slate-800 rounded-full"></div>
            </div>

            <!-- Screen Area with Active Theme Class -->
            <div 
              :class="['theme-' + (previewTheme || selectedTheme)]" 
              class="w-full min-h-[500px] max-h-[520px] overflow-y-auto rounded-[30px] p-5 pt-8 text-center transition-all duration-300 relative select-none"
              style="background: var(--color-background); color: var(--color-text); font-family: inherit;"
            >
              <!-- Hero Header Mockup -->
              <div class="flex flex-col items-center mb-6">
                <img 
                  :src="loja.logo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'" 
                  alt="Logo" 
                  class="w-20 h-20 rounded-2xl object-cover shadow-lg ring-2 ring-[var(--color-accent)] mb-2" 
                />
                <h3 class="text-lg font-bold leading-tight" style="color: var(--color-text);">{{ loja.name }}</h3>
                <p class="text-[11px] opacity-80 max-w-[220px] mt-1 leading-snug" style="color: var(--color-text);">
                  {{ loja.description || 'Sua vitrine digital com links e atendimento personalizado.' }}
                </p>
              </div>

              <!-- Links Mockup Cards -->
              <div class="space-y-2 mb-4">
                <div 
                  v-for="(link, lIdx) in (loja.links && loja.links.length ? loja.links : [{ texto: 'Nosso Site Oficial', icone: 'fa-solid fa-globe' }, { texto: 'Atendimento WhatsApp', icone: 'fa-brands fa-whatsapp' }])" 
                  :key="lIdx"
                  class="flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs font-semibold shadow-sm transition-all"
                  style="background: var(--color-foreground); border-color: var(--color-accent); color: var(--color-text);"
                >
                  <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style="background: var(--color-background);">
                    <i :class="link.icone || 'fa-solid fa-link'" style="color: var(--color-accent);"></i>
                  </div>
                  <span class="flex-1 truncate">{{ link.texto }}</span>
                  <i class="fa-solid fa-chevron-right text-[10px] opacity-60" style="color: var(--color-accent);"></i>
                </div>
              </div>

              <!-- Premium Landing Page Features Preview -->
              <div v-if="activeThemeObj?.isPremium || ['portrait-hero', 'landing-page'].includes(activeThemeObj?.layoutStyle)" class="space-y-3 pt-2 text-left">
                <!-- Sobre Mim Block -->
                <div class="p-3 rounded-xl border text-[11px] space-y-1" style="background: var(--color-foreground); border-color: var(--color-accent);">
                  <div class="font-bold flex items-center gap-1" style="color: var(--color-text);">
                    <i class="fa-solid fa-user-check text-[10px]" style="color: var(--color-accent);"></i> Sobre mim
                  </div>
                  <p class="opacity-80 text-[10px] leading-tight" style="color: var(--color-text);">
                    Atendimento estratégico com compromisso e excelência.
                  </p>
                </div>

                <!-- Stats Counter Row -->
                <div class="grid grid-cols-3 gap-1.5 p-2 rounded-xl text-center border" style="background: var(--color-foreground); border-color: var(--color-accent);">
                  <div>
                    <div class="font-black text-xs" style="color: var(--color-primary);">+500</div>
                    <div class="text-[8px] uppercase opacity-70">Clientes</div>
                  </div>
                  <div class="border-x px-1" style="border-color: var(--color-accent);">
                    <div class="font-black text-xs" style="color: var(--color-primary);">8 Anos</div>
                    <div class="text-[8px] uppercase opacity-70">Exp.</div>
                  </div>
                  <div>
                    <div class="font-black text-xs" style="color: var(--color-primary);">95%</div>
                    <div class="text-[8px] uppercase opacity-70">Satisf.</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

      <!-- ========================================== -->
      <!-- SECTION: COMPARTILHAMENTO & QR CODE        -->
      <!-- ========================================== -->
      <section class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <i class="fa-solid fa-share-nodes text-indigo-600"></i> Compartilhar esta Vitrine
        </h3>
        
        <div class="flex flex-col sm:flex-row gap-3">
          <input :value="shortUrl || longUrl" readonly class="flex-1 border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-mono text-gray-700" />
          <button @click="copyLink" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm">
            <i class="fa-solid fa-copy"></i> Copiar Link
          </button>
        </div>

        <div class="pt-4 border-t flex flex-col sm:flex-row items-center gap-6">
          <div class="p-3 bg-gray-50 border border-gray-200 rounded-xl shadow-inner">
            <img :src="qrCodeUrl" alt="QR Code da loja" class="w-36 h-36 mx-auto" />
          </div>
          <div class="space-y-2 text-center sm:text-left">
            <h4 class="font-bold text-gray-800 text-sm">QR Code para Divulgação</h4>
            <p class="text-xs text-gray-500 max-w-sm">Imprima ou compartilhe este QR Code em seus cartões de visita e redes sociais para direcionar clientes à sua vitrine.</p>
            <a :href="qrCodeUrl" :download="`qr-loja-${slug}.png`" class="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline pt-1">
              <i class="fa-solid fa-download"></i> Baixar Imagem do QR Code
            </a>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION: LINKS DA LOJA                    -->
      <!-- ========================================== -->
      <section class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <i class="fa-solid fa-link text-indigo-600"></i> Links Cadastrados
        </h3>
        
        <div v-if="loja.links && loja.links.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div v-for="(link, i) in loja.links" :key="i" class="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <div class="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <i :class="link.icone"></i>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold text-gray-800 truncate">{{ link.texto }}</p>
              <a :href="link.url" target="_blank" class="text-[11px] text-indigo-600 hover:underline truncate block">
                {{ link.url }}
              </a>
            </div>
          </div>
        </div>
        <p v-else class="text-xs text-gray-500 italic">Nenhum link cadastrado nesta loja.</p>
      </section>

      <!-- ========================================== -->
      <!-- SECTION: CONTATOS VINCULADOS               -->
      <!-- ========================================== -->
      <section class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <i class="fa-solid fa-headset text-indigo-600"></i> Contatos Vinculados
        </h3>
        
        <div v-if="contatosDaLoja.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div v-for="contato in contatosDaLoja" :key="contato.id" class="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
            <img :src="contato.photo || 'https://via.placeholder.com/40'" alt="Foto do contato" class="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200" />
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold text-gray-800 truncate">{{ contato.name }}</p>
              <p class="text-[11px] text-gray-500 truncate"><i class="fa-brands fa-whatsapp text-emerald-600 mr-1"></i>{{ contato.whatsapp }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-xs text-gray-500 italic">Nenhum contato atribuído a esta loja.</p>
      </section>

    </div>
    <p v-else class="text-center text-red-600 mt-10">Vitrine não encontrada.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import { useContactStore } from '../../stores/contactStore'
import { useThemeStore } from '../../stores/themeStore'
import { useFeedbackStore } from '../../stores/feedbackStore'
import Loading from '../ui/Loading.vue'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug

const themeStore = useThemeStore()
const lojaStore = useLojaStore()
const contactStore = useContactStore()
const feedbackStore = useFeedbackStore()

const selectedTheme = ref('')
const previewTheme = ref('')
const isPreview = ref(false)
const salvandoTema = ref(false)
const selectedCategoryTab = ref('all') // 'all' | 'premium' | 'gradient' | 'standard'

const filterTabs = [
  { id: 'all', label: 'Todos os Temas' },
  { id: 'premium', label: '👑 Premium VIP' },
  { id: 'gradient', label: '🎨 Gradientes' },
  { id: 'standard', label: '⚡ Padrão' }
]

const loja = ref(null)

const longUrl = computed(() => `${window.location.origin}/${slug}`)
const shortUrl = ref('')
const qrCodeUrl = computed(() => {
  const target = shortUrl.value || longUrl.value
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(target)}&size=200x200`
})

const filteredThemes = computed(() => {
  const all = themeStore.allThemes
  if (selectedCategoryTab.value === 'premium') return all.filter(t => t.isPremium)
  if (selectedCategoryTab.value === 'gradient') return all.filter(t => t.category === 'gradient' || t.colors?.background?.includes('gradient'))
  if (selectedCategoryTab.value === 'standard') return all.filter(t => !t.isPremium && t.category !== 'gradient')
  return all
})

const activeThemeObj = computed(() => {
  const targetId = previewTheme.value || selectedTheme.value
  return themeStore.allThemes.find(t => t.id === targetId) || themeStore.allThemes[0]
})

function handleThemeChange() {
  if (!selectedTheme.value) return
  previewTheme.value = selectedTheme.value
  isPreview.value = true
  themeStore.initDynamicCss()
}

async function aplicarTema() {
  if (!loja.value?.id) return
  const themeToApply = previewTheme.value || selectedTheme.value

  salvandoTema.value = true
  try {
    await lojaStore.atualizarTemaLoja(loja.value.id, themeToApply)
    loja.value.theme = themeToApply
    themeStore.applyTheme(themeToApply, loja.value.id)
    selectedTheme.value = themeToApply
    previewTheme.value = themeToApply
    isPreview.value = false
    
    feedbackStore.showSuccess(`Tema "${activeThemeObj.value?.label || themeToApply}" aplicado com sucesso!`)
  } catch (error) {
    console.error('Erro ao aplicar tema:', error)
    const msg = error.response?.data?.error || error.message || 'Falha ao atualizar o tema.'
    feedbackStore.showError('Erro ao aplicar tema: ' + msg)
  } finally {
    salvandoTema.value = false
  }
}

function cancelarPreview() {
  const savedTheme = loja.value?.theme || 'default'
  selectedTheme.value = savedTheme
  previewTheme.value = savedTheme
  isPreview.value = false
  themeStore.applyTheme(savedTheme, loja.value?.id)
}

async function buscarLoja() {
  if (lojaStore.lojas.length === 0) {
    await lojaStore.listarLojas()
  }
  loja.value = lojaStore.lojas.find(l => l.slug === slug)
}

onMounted(async () => {
  themeStore.initDynamicCss()
  await buscarLoja()

  if (loja.value) {
    selectedTheme.value = loja.value.theme || 'default'
    previewTheme.value = selectedTheme.value
    themeStore.applyTheme(selectedTheme.value, loja.value.id)
  }

  // Gera link encurtado
  try {
    const resp = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl.value)}`
    )
    if (resp.ok) shortUrl.value = await resp.text()
    else shortUrl.value = longUrl.value
  } catch {
    shortUrl.value = longUrl.value
  }

  await contactStore.listarContatos()
})

function copyLink() {
  const text = shortUrl.value || longUrl.value
  navigator.clipboard.writeText(text)
    .then(() => feedbackStore.showSuccess('Link copiado para a área de transferência!'))
    .catch(() => feedbackStore.showError('Falha ao copiar link.'))
}

const back = () => {
  router.push('/stores')
}

const contatosDaLoja = computed(() => contactStore.contatos.filter(contato => 
  contato.stores?.some(store => 
    store.id === loja.value?.id && 
    store.pivot.ativo === 1
  )
))
</script>

<style scoped>
/* Scrollbar para o mockup de tela do celular */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>

