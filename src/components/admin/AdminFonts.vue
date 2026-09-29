<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFontStore } from '@/stores/fontStore'
import { useFeedbackStore } from '@/stores/feedbackStore'
import Button from '@/components/ui/Button.vue'
import Loading from '@/components/ui/Loading.vue'

const fontStore = useFontStore()
const feedbackStore = useFeedbackStore()

const importUrl = ref('')
const familyName = ref('')
const displayName = ref('')
const category = ref('sans-serif')
const searchFilter = ref('')
const selectedCategoryFilter = ref('all')

const popularGooglePresets = [
  { name: 'Outfit', category: 'sans-serif', url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap' },
  { name: 'Poppins', category: 'sans-serif', url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap' },
  { name: 'Montserrat', category: 'sans-serif', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap' },
  { name: 'Lora', category: 'serif', url: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap' },
  { name: 'Oswald', category: 'display', url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap' },
  { name: 'Bebas Neue', category: 'display', url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap' },
  { name: 'Caveat', category: 'handwriting', url: 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap' },
  { name: 'Cinzel Decorative', category: 'serif', url: 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&display=swap' },
  { name: 'Syne', category: 'display', url: 'https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&display=swap' },
  { name: 'Fira Code', category: 'monospace', url: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap' }
]

onMounted(async () => {
  await fontStore.carregarFontes()
})

const livePreviewFontFamily = computed(() => {
  if (familyName.value.trim()) {
    return `'${familyName.value.trim()}', ${category.value}`
  }
  if (importUrl.value.includes('family=')) {
    const match = importUrl.value.match(/family=([^:&]+)/i)
    if (match) {
      const extracted = decodeURIComponent(match[1].replace(/\+/g, ' '))
      return `'${extracted}', ${category.value}`
    }
  }
  return `'Inter', sans-serif`
})

function applyPreset(preset) {
  importUrl.value = preset.url
  familyName.value = preset.name
  category.value = preset.category
  displayName.value = `${preset.name} (${preset.category})`
  injectTempFontLink(preset.url, preset.name)
}

function injectTempFontLink(url, name) {
  if (!url || typeof document === 'undefined') return
  let cleanUrl = url
  if (url.includes('href=')) {
    const match = url.match(/href=["\']([^"\']+)["\']/)
    if (match) cleanUrl = match[1]
  }
  const tempId = 'temp-font-preview-link'
  let existing = document.getElementById(tempId)
  if (existing) existing.remove()

  const link = document.createElement('link')
  link.id = tempId
  link.rel = 'stylesheet'
  link.href = cleanUrl
  document.head.appendChild(link)
}

function onUrlInput() {
  if (!importUrl.value) return
  let cleanUrl = importUrl.value
  if (importUrl.value.includes('href=')) {
    const match = importUrl.value.match(/href=["\']([^"\']+)["\']/)
    if (match) cleanUrl = match[1]
  }

  if (!familyName.value && cleanUrl.includes('family=')) {
    const match = cleanUrl.match(/family=([^:&]+)/i)
    if (match) {
      const extracted = decodeURIComponent(match[1].replace(/\+/g, ' '))
      familyName.value = extracted
      displayName.value = `${extracted} (${category.value})`
    }
  }
  injectTempFontLink(cleanUrl, familyName.value)
}

async function handleSaveFont() {
  if (!importUrl.value.trim()) {
    feedbackStore.showError('Por favor, informe a URL ou tag de importação da fonte.')
    return
  }

  try {
    await fontStore.addFont({
      import_url: importUrl.value.trim(),
      family_name: familyName.value.trim(),
      display_name: displayName.value.trim(),
      category: category.value,
      provider: 'google'
    })

    feedbackStore.showSuccess(`Fonte "${familyName.value || 'Personalizada'}" importada com sucesso!`)

    importUrl.value = ''
    familyName.value = ''
    displayName.value = ''
    category.value = 'sans-serif'
  } catch (error) {
    console.error('Erro ao salvar fonte:', error)
    feedbackStore.showError(error.response?.data?.error || 'Erro ao importar fonte.')
  }
}

async function handleDeleteFont(font) {
  if (confirm(`Deseja realmente remover a fonte "${font.display_name || font.family_name}"?`)) {
    try {
      await fontStore.removeFont(font.id)
      feedbackStore.showSuccess('Fonte removida com sucesso.')
    } catch (error) {
      console.error('Erro ao excluir fonte:', error)
      feedbackStore.showError('Erro ao excluir fonte.')
    }
  }
}

const filteredFonts = computed(() => {
  return fontStore.fonts.filter(f => {
    const matchesSearch = !searchFilter.value.trim() || 
      (f.family_name || '').toLowerCase().includes(searchFilter.value.toLowerCase()) ||
      (f.display_name || '').toLowerCase().includes(searchFilter.value.toLowerCase())
    const matchesCat = selectedCategoryFilter.value === 'all' || f.category === selectedCategoryFilter.value
    return matchesSearch && matchesCat
  })
})

function copyCssSnippet(font) {
  const code = `font-family: '${font.family_name}', ${font.category || 'sans-serif'};`
  navigator.clipboard.writeText(code)
  feedbackStore.showSuccess(`Snippet de CSS copiado: ${code}`)
}
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Cabeçalho da Página -->
    <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
            Aa
          </span>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Gerenciador & Importador de Fontes</h1>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          Importe fontes do Google Fonts ou Web Fonts CSS para disponibilizá-las na criação de temas das vitrines.
        </p>
      </div>

      <span class="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
        {{ fontStore.fonts.length }} Fontes Cadastradas
      </span>
    </div>

    <!-- FORMULÁRIO DE IMPORTAÇÃO -->
    <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
          <i class="fa-solid fa-plus-circle text-indigo-600"></i>
          Importar Nova Fonte (Google Fonts / Web Font)
        </h2>
        <span class="text-[11px] text-gray-400">Cole a URL ou selecione um preset</span>
      </div>

      <!-- Presets Rápidos do Google Fonts -->
      <div class="space-y-1.5">
        <label class="block text-xs font-bold text-gray-700">Presets Populares do Google Fonts:</label>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="(preset, idx) in popularGooglePresets"
            :key="idx"
            type="button"
            @click="applyPreset(preset)"
            class="px-2.5 py-1 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 text-xs font-semibold rounded-lg transition-all"
          >
            + {{ preset.name }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <!-- Input URL do Google Fonts -->
        <div class="md:col-span-12">
          <label class="block text-xs font-semibold text-gray-700 mb-1">
            URL do CSS ou Tag HTML de Importação (Google Fonts) <span class="text-red-500">*</span>
          </label>
          <input
            v-model="importUrl"
            @input="onUrlInput"
            type="text"
            placeholder="Ex: https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap ou <link href=...>"
            class="w-full text-xs font-mono bg-white border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <!-- Nome da Família -->
        <div class="md:col-span-5">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Nome da Família da Fonte</label>
          <input
            v-model="familyName"
            type="text"
            placeholder="Ex: Outfit, Poppins, Playfair Display"
            class="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 outline-none"
          />
        </div>

        <!-- Nome de Exibição -->
        <div class="md:col-span-4">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Nome de Exibição (Painel Admin)</label>
          <input
            v-model="displayName"
            type="text"
            placeholder="Ex: Outfit (Modern Sans)"
            class="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 outline-none"
          />
        </div>

        <!-- Categoria -->
        <div class="md:col-span-3">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Categoria da Fonte</label>
          <select v-model="category" class="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 outline-none font-medium">
            <option value="sans-serif">Sans-Serif (Sem serifa)</option>
            <option value="serif">Serif (Com serifa)</option>
            <option value="display">Display (Título / Impacto)</option>
            <option value="handwriting">Handwriting (Cursiva / Manuscrita)</option>
            <option value="monospace">Monospace (Código)</option>
          </select>
        </div>
      </div>

      <!-- Preview de Teste ao Vivo -->
      <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
        <div class="flex items-center justify-between text-xs font-bold text-gray-600">
          <span>Pré-visualização da Fonte em Tempo Real:</span>
          <span class="font-mono text-[10px] text-indigo-600">{{ livePreviewFontFamily }}</span>
        </div>
        <div 
          class="p-4 bg-white border border-gray-200 rounded-xl text-lg sm:text-2xl text-gray-900 transition-all duration-300 leading-snug"
          :style="{ fontFamily: livePreviewFontFamily }"
        >
          O rápido corvo negro saltou sobre o cão preguiçoso. 0123456789
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <Button @click="handleSaveFont" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 text-xs font-bold rounded-xl shadow-md">
          <i class="fa-solid fa-cloud-arrow-down mr-1.5"></i> Salvar & Disponibilizar Fonte
        </Button>
      </div>
    </div>

    <!-- LISTA E CATÁLOGO DE FONTES -->
    <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
          <i class="fa-solid fa-font text-indigo-600"></i>
          Catálogo de Fontes Cadastradas
        </h2>

        <!-- Filtros de Busca e Categoria -->
        <div class="flex items-center gap-2 flex-wrap">
          <input
            v-model="searchFilter"
            type="text"
            placeholder="Buscar por nome da fonte..."
            class="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-48 outline-none focus:bg-white focus:border-indigo-400"
          />
          <select v-model="selectedCategoryFilter" class="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 outline-none font-medium">
            <option value="all">Todas as Categorias</option>
            <option value="sans-serif">Sans-Serif</option>
            <option value="serif">Serif</option>
            <option value="display">Display</option>
            <option value="handwriting">Handwriting</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>
      </div>

      <Loading v-if="fontStore.carregando" text="Carregando catálogo de fontes..." class="py-10" />

      <!-- Grid de Cards de Fontes -->
      <div v-else-if="filteredFonts.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="font in filteredFonts"
          :key="font.id"
          class="bg-gray-50/70 hover:bg-white p-4 rounded-2xl border border-gray-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all space-y-3 relative group"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-sm text-gray-900">{{ font.display_name || font.family_name }}</h3>
                <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full uppercase', font.is_system ? 'bg-gray-200 text-gray-700' : 'bg-emerald-100 text-emerald-800']">
                  {{ font.is_system ? 'Sistema' : 'Custom' }}
                </span>
              </div>
              <p class="text-[11px] font-mono text-gray-400 mt-0.5">Family: "{{ font.family_name }}"</p>
            </div>

            <div class="flex items-center gap-1">
              <button
                @click="copyCssSnippet(font)"
                class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs"
                title="Copiar código CSS"
              >
                <i class="fa-solid fa-code"></i>
              </button>
              <button
                v-if="!font.is_system"
                @click="handleDeleteFont(font)"
                class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs"
                title="Excluir fonte"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>

          <!-- Amostra Tipográfica da Fonte no Card -->
          <div 
            class="p-3 bg-white rounded-xl border border-gray-200/80 text-base text-gray-800 leading-snug truncate"
            :style="{ fontFamily: `'${font.family_name}', ${font.category || 'sans-serif'}` }"
          >
            Vitrines Digitais & Layouts Exclusivos VIP
          </div>

          <div class="flex items-center justify-between text-[10px] text-gray-400 font-semibold pt-1">
            <span>Categoria: {{ font.category || 'sans-serif' }}</span>
            <span>Provedor: {{ font.provider || 'Google Fonts' }}</span>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-10 text-gray-500 text-xs">
        Nenhuma fonte encontrada com o filtro aplicado.
      </div>
    </div>
  </div>
</template>
