<script setup>
import { ref, onMounted, computed } from 'vue'
import { useIconStore } from '@/stores/iconStore'
import { useFeedbackStore } from '@/stores/feedbackStore'
import Button from '@/components/ui/Button.vue'
import Loading from '@/components/ui/Loading.vue'

const iconStore = useIconStore()
const feedbackStore = useFeedbackStore()

const importUrl = ref('')
const familyName = ref('')
const displayName = ref('')
const prefix = ref('fa-solid')
const category = ref('general')
const sampleIconsInput = ref('fa-heart, fa-star, fa-user, fa-store, fa-envelope, fa-link')
const searchFilter = ref('')
const selectedCategoryFilter = ref('all')

const popularIconPresets = [
  {
    name: 'Font Awesome 6',
    display: 'Font Awesome 6 (Solid & Brands)',
    prefix: 'fa-solid',
    category: 'general',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    samples: 'fa-heart, fa-star, fa-user, fa-store, fa-envelope, fa-link'
  },
  {
    name: 'Bootstrap Icons',
    display: 'Bootstrap Icons (Clean & Modern)',
    prefix: 'bi',
    category: 'minimal',
    url: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    samples: 'bi-heart-fill, bi-star-fill, bi-person-fill, bi-shop, bi-envelope-fill, bi-link-45deg'
  },
  {
    name: 'Remix Icon',
    display: 'Remix Icon (Neutral & Smooth)',
    prefix: 'ri',
    category: 'general',
    url: 'https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css',
    samples: 'ri-heart-3-fill, ri-star-fill, ri-user-3-fill, ri-store-2-fill, ri-mail-fill, ri-link'
  },
  {
    name: 'Boxicons',
    display: 'Boxicons (Vector & High Quality)',
    prefix: 'bx',
    category: 'outlined',
    url: 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
    samples: 'bxs-heart, bxs-star, bxs-user, bxs-store, bxs-envelope, bx-link'
  },
  {
    name: 'Line Awesome',
    display: 'Line Awesome (Minimal Line Icons)',
    prefix: 'las',
    category: 'minimal',
    url: 'https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css',
    samples: 'la-heart, la-star, la-user, la-store, la-envelope, la-link'
  },
  {
    name: 'Material Symbols',
    display: 'Material Symbols (Google Outlined)',
    prefix: 'material-symbols-outlined',
    category: 'general',
    url: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0',
    samples: 'favorite, grade, person, storefront, mail, link'
  }
]

onMounted(async () => {
  await iconStore.carregarFamilias()
})

function applyPreset(preset) {
  importUrl.value = preset.url
  familyName.value = preset.name
  displayName.value = preset.display
  prefix.value = preset.prefix
  category.value = preset.category
  sampleIconsInput.value = preset.samples
  iconStore.injetarFamiliaEspecifica(preset.url, 'preview')
}

function onUrlInput() {
  if (!importUrl.value) return
  let cleanUrl = importUrl.value
  if (importUrl.value.includes('href=')) {
    const match = importUrl.value.match(/href=["\']([^"\']+)["\']/)
    if (match) cleanUrl = match[1]
  }
  iconStore.injetarFamiliaEspecifica(cleanUrl, 'preview')
}

const parsedSampleIcons = computed(() => {
  if (!sampleIconsInput.value.trim()) return ['heart', 'star', 'user', 'store', 'envelope', 'link']
  return sampleIconsInput.value.split(',').map(s => s.trim()).filter(Boolean)
})

async function handleSaveIconFamily() {
  if (!importUrl.value.trim() || !familyName.value.trim()) {
    feedbackStore.showError('Por favor, informe o nome da família e a URL do CSS.')
    return
  }

  try {
    await iconStore.addIconFamily({
      import_url: importUrl.value.trim(),
      family_name: familyName.value.trim(),
      display_name: displayName.value.trim() || familyName.value.trim(),
      prefix: prefix.value.trim() || 'fa-solid',
      category: category.value,
      provider: importUrl.value.includes('cdnjs') ? 'cdnjs' : (importUrl.value.includes('jsdelivr') ? 'jsdelivr' : 'custom'),
      sample_icons: parsedSampleIcons.value
    })

    feedbackStore.showSuccess(`Família de Ícones "${familyName.value}" importada com sucesso!`)

    importUrl.value = ''
    familyName.value = ''
    displayName.value = ''
    prefix.value = 'fa-solid'
    category.value = 'general'
    sampleIconsInput.value = 'fa-heart, fa-star, fa-user, fa-store, fa-envelope, fa-link'
  } catch (error) {
    console.error('Erro ao salvar família de ícones:', error)
    feedbackStore.showError(error.response?.data?.error || 'Erro ao importar família de ícones.')
  }
}

async function handleDeleteIconFamily(family) {
  if (confirm(`Deseja realmente remover a família de ícones "${family.display_name || family.family_name}"?`)) {
    try {
      await iconStore.removeIconFamily(family.id)
      feedbackStore.showSuccess('Família de ícones removida com sucesso.')
    } catch (error) {
      console.error('Erro ao excluir família de ícones:', error)
      feedbackStore.showError('Erro ao excluir família de ícones.')
    }
  }
}

const filteredFamilies = computed(() => {
  return iconStore.iconFamilies.filter(f => {
    const matchesSearch = !searchFilter.value.trim() || 
      (f.family_name || '').toLowerCase().includes(searchFilter.value.toLowerCase()) ||
      (f.display_name || '').toLowerCase().includes(searchFilter.value.toLowerCase())
    const matchesCat = selectedCategoryFilter.value === 'all' || f.category === selectedCategoryFilter.value
    return matchesSearch && matchesCat
  })
})

function copyLinkTag(family) {
  const code = `<link rel="stylesheet" href="${family.import_url}">`
  navigator.clipboard.writeText(code)
  feedbackStore.showSuccess(`Tag HTML de importação copiada: ${code}`)
}
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Cabeçalho da Página -->
    <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
            <i class="fa-solid fa-icons"></i>
          </span>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Gerenciador & Importador de Ícones</h1>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          Importe conjuntos e famílias de ícones CSS (Font Awesome, Bootstrap Icons, Remix Icon, Material Symbols) para uso nos temas e vitrines.
        </p>
      </div>

      <span class="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
        {{ iconStore.iconFamilies.length }} Famílias Cadastradas
      </span>
    </div>

    <!-- FORMULÁRIO DE IMPORTAÇÃO -->
    <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
          <i class="fa-solid fa-plus-circle text-indigo-600"></i>
          Importar Nova Família de Ícones (CDN Webfont / CSS)
        </h2>
        <span class="text-[11px] text-gray-400">Cole a URL do CSS ou escolha um preset</span>
      </div>

      <!-- Presets Populares -->
      <div class="space-y-1.5">
        <label class="block text-xs font-bold text-gray-700">Presets Populares de Ícones:</label>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="(preset, idx) in popularIconPresets"
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
        <!-- URL do CSS CDN -->
        <div class="md:col-span-12">
          <label class="block text-xs font-semibold text-gray-700 mb-1">
            URL do CSS CDN ou Tag HTML &lt;link&gt; <span class="text-red-500">*</span>
          </label>
          <input
            v-model="importUrl"
            @input="onUrlInput"
            type="text"
            placeholder="Ex: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css ou <link href=...>"
            class="w-full text-xs font-mono bg-white border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <!-- Nome da Família -->
        <div class="md:col-span-4">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Nome da Família <span class="text-red-500">*</span></label>
          <input
            v-model="familyName"
            type="text"
            placeholder="Ex: Remix Icon, Bootstrap Icons"
            class="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 outline-none"
          />
        </div>

        <!-- Nome de Exibição -->
        <div class="md:col-span-4">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Nome de Exibição (Painel Admin)</label>
          <input
            v-model="displayName"
            type="text"
            placeholder="Ex: Bootstrap Icons (Modern & Clean)"
            class="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 outline-none"
          />
        </div>

        <!-- Prefixo de Classe CSS -->
        <div class="md:col-span-4">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Prefixo / Classe Base CSS</label>
          <input
            v-model="prefix"
            type="text"
            placeholder="Ex: fa-solid, bi, ri, bx, material-symbols-outlined"
            class="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 outline-none font-mono"
          />
        </div>

        <!-- Amostras de Ícones -->
        <div class="md:col-span-8">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Amostras de Ícones (separadas por vírgula)</label>
          <input
            v-model="sampleIconsInput"
            type="text"
            placeholder="Ex: bi-heart-fill, bi-star-fill, bi-person-fill, bi-shop"
            class="w-full text-xs font-mono bg-white border border-gray-300 rounded-xl px-3 py-2.5 outline-none"
          />
        </div>

        <!-- Categoria -->
        <div class="md:col-span-4">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Categoria</label>
          <select v-model="category" class="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 outline-none font-medium">
            <option value="general">Geral / Multiuso</option>
            <option value="minimal">Minimalista / Clean</option>
            <option value="outlined">Outlined (Linhas Finas)</option>
            <option value="duotone">Duotone / Colorido</option>
            <option value="social">Redes Sociais & Contato</option>
          </select>
        </div>
      </div>

      <!-- Preview de Teste ao Vivo -->
      <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
        <div class="flex items-center justify-between text-xs font-bold text-gray-600">
          <span>Pré-visualização da Família de Ícones em Tempo Real:</span>
          <span class="font-mono text-[10px] text-indigo-600">Prefixo: "{{ prefix }}"</span>
        </div>

        <div class="flex flex-wrap items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
          <div
            v-for="(iconItem, idx) in parsedSampleIcons"
            :key="idx"
            class="flex flex-col items-center justify-center p-3 bg-indigo-50/50 hover:bg-indigo-100/70 border border-indigo-100 rounded-xl min-w-[70px] transition-all"
          >
            <template v-if="prefix === 'material-symbols-outlined'">
              <span class="material-symbols-outlined text-2xl text-indigo-700">{{ iconItem }}</span>
            </template>
            <template v-else>
              <i :class="[prefix, iconItem, 'text-2xl text-indigo-700']"></i>
            </template>
            <span class="text-[10px] font-mono text-gray-500 mt-1 truncate max-w-[80px] text-center" :title="iconItem">
              {{ iconItem }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <Button @click="handleSaveIconFamily" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 text-xs font-bold rounded-xl shadow-md">
          <i class="fa-solid fa-cloud-arrow-down mr-1.5"></i> Salvar & Disponibilizar Ícones
        </Button>
      </div>
    </div>

    <!-- LISTA E CATÁLOGO DE ÍCONES -->
    <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
          <i class="fa-solid fa-icons text-indigo-600"></i>
          Catálogo de Famílias de Ícones Cadastradas
        </h2>

        <!-- Filtros de Busca e Categoria -->
        <div class="flex items-center gap-2 flex-wrap">
          <input
            v-model="searchFilter"
            type="text"
            placeholder="Buscar por nome..."
            class="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-48 outline-none focus:bg-white focus:border-indigo-400"
          />
          <select v-model="selectedCategoryFilter" class="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 outline-none font-medium">
            <option value="all">Todas as Categorias</option>
            <option value="general">Geral</option>
            <option value="minimal">Minimalista</option>
            <option value="outlined">Outlined</option>
            <option value="duotone">Duotone</option>
            <option value="social">Redes Sociais</option>
          </select>
        </div>
      </div>

      <Loading v-if="iconStore.carregando" text="Carregando famílias de ícones..." class="py-10" />

      <!-- Grid de Cards de Famílias -->
      <div v-else-if="filteredFamilies.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="family in filteredFamilies"
          :key="family.id"
          class="bg-gray-50/70 hover:bg-white p-4 rounded-2xl border border-gray-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all space-y-3 relative group"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-sm text-gray-900">{{ family.display_name || family.family_name }}</h3>
                <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full uppercase', family.is_system ? 'bg-gray-200 text-gray-700' : 'bg-emerald-100 text-emerald-800']">
                  {{ family.is_system ? 'Sistema' : 'Custom' }}
                </span>
              </div>
              <p class="text-[11px] font-mono text-gray-400 mt-0.5">Prefix: "{{ family.prefix }}"</p>
            </div>

            <div class="flex items-center gap-1">
              <button
                @click="copyLinkTag(family)"
                class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs"
                title="Copiar Tag HTML <link>"
              >
                <i class="fa-solid fa-code"></i>
              </button>
              <button
                v-if="!family.is_system"
                @click="handleDeleteIconFamily(family)"
                class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs"
                title="Excluir família de ícones"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>

          <!-- Amostras Visuais dos Ícones -->
          <div class="p-3 bg-white rounded-xl border border-gray-200/80 flex items-center justify-around gap-2">
            <div
              v-for="(ic, idx) in (family.sample_icons || ['heart', 'star', 'user', 'store', 'envelope', 'link']).slice(0, 6)"
              :key="idx"
              class="flex flex-col items-center"
            >
              <template v-if="family.prefix === 'material-symbols-outlined'">
                <span class="material-symbols-outlined text-xl text-gray-800">{{ ic }}</span>
              </template>
              <template v-else>
                <i :class="[family.prefix, ic, 'text-xl text-gray-800']"></i>
              </template>
            </div>
          </div>

          <div class="flex items-center justify-between text-[10px] text-gray-400 font-semibold pt-1">
            <span>Categoria: {{ family.category || 'general' }}</span>
            <span>Provedor: {{ family.provider || 'CDN' }}</span>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-10 text-gray-500 text-xs">
        Nenhuma família de ícones encontrada com o filtro aplicado.
      </div>
    </div>
  </div>
</template>
