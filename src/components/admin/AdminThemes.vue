<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/themeStore'
import { useFeedbackStore } from '@/stores/feedbackStore'

const themeStore = useThemeStore()
const feedbackStore = useFeedbackStore()

// State do Formulário do Criador de Tema
const newThemeLabel = ref('')
const bgType = ref('solid') // 'solid' | 'gradient'
const bgColorSolid = ref('#1E1B4B')
const bgGradientColor1 = ref('#4F46E5')
const bgGradientColor2 = ref('#7C3AED')
const bgGradientAngle = ref('135deg')

const fgColor = ref('#2E2A72')
const primaryColor = ref('#818CF8')
const accentColor = ref('#F43F5E')
const textColor = ref('#F8FAFC')
const backdropBlur = ref(0) // 0px a 20px

const computedBackground = computed(() => {
  if (bgType.value === 'solid') {
    return bgColorSolid.value
  }
  return `linear-gradient(${bgGradientAngle.value}, ${bgGradientColor1.value}, ${bgGradientColor2.value})`
})

const generatedId = computed(() => {
  if (!newThemeLabel.value.trim()) return 'custom-theme'
  return newThemeLabel.value
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
})

function saveTheme() {
  if (!newThemeLabel.value.trim()) {
    feedbackStore.showError('Por favor, informe o nome do tema.')
    return
  }

  const themeObj = {
    id: generatedId.value,
    label: newThemeLabel.value.trim(),
    colors: {
      background: computedBackground.value,
      foreground: fgColor.value,
      primary: primaryColor.value,
      accent: accentColor.value,
      text: textColor.value,
    },
    backdropBlur: backdropBlur.value > 0 ? backdropBlur.value : 0,
  }

  themeStore.addCustomTheme(themeObj)
  feedbackStore.showSuccess(`Tema "${themeObj.label}" criado e disponibilizado com sucesso!`)

  // Reset do formulário
  newThemeLabel.value = ''
}

function deleteCustomTheme(theme) {
  if (confirm(`Deseja realmente excluir o tema "${theme.label}"?`)) {
    themeStore.removeCustomTheme(theme.id)
    feedbackStore.showSuccess(`Tema "${theme.label}" excluído.`)
  }
}

function applyPresetToEditor(theme) {
  newThemeLabel.value = `${theme.label} (Cópia)`
  fgColor.value = theme.colors.foreground.startsWith('rgba') ? '#ffffff' : theme.colors.foreground
  primaryColor.value = theme.colors.primary
  accentColor.value = theme.colors.accent
  textColor.value = theme.colors.text

  if (theme.colors.background.includes('gradient')) {
    bgType.value = 'gradient'
  } else {
    bgType.value = 'solid'
    bgColorSolid.value = theme.colors.background
  }
}

onMounted(() => {
  themeStore.initDynamicCss()
})
</script>

<template>
  <section class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gerenciador & Criador de Temas</h1>
        <p class="text-sm text-gray-600 mt-1">
          Crie novos temas de visualização personalizados. Todos os temas criados aqui ficam disponíveis para as vitrines dos usuários.
        </p>
      </div>
    </div>

    <!-- Layout Principal: Criador + Live Preview Mockup Celular -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Formulário de Criação (7 Colunas) -->
      <div class="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-5">
        <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <i class="fa-solid fa-palette text-indigo-600"></i>
          Criar Novo Tema Visual
        </h2>

        <!-- Nome do Tema -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Nome do Tema</label>
          <input 
            v-model="newThemeLabel" 
            type="text" 
            placeholder="Ex: Neon Wave, Golden Sunset, Minimal Mint..."
            class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
          />
          <p class="text-[11px] text-gray-400 mt-1 font-mono">ID gerado: theme-{{ generatedId }}</p>
        </div>

        <!-- Tipo de Fundo -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Estilo de Fundo</label>
          <div class="grid grid-cols-2 gap-3">
            <button 
              type="button"
              @click="bgType = 'solid'"
              class="py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-2"
              :class="bgType === 'solid' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'"
            >
              <i class="fa-solid fa-square text-sm"></i>
              Cor Sólida
            </button>
            <button 
              type="button"
              @click="bgType = 'gradient'"
              class="py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-2"
              :class="bgType === 'gradient' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'"
            >
              <i class="fa-solid fa-circle-half-stroke text-sm"></i>
              Gradiente
            </button>
          </div>
        </div>

        <!-- Controles de Fundo Sólido ou Gradiente -->
        <div v-if="bgType === 'solid'" class="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <label class="block text-xs font-medium text-gray-600 mb-1">Cor do Fundo</label>
          <div class="flex items-center gap-3">
            <input v-model="bgColorSolid" type="color" class="w-9 h-9 rounded cursor-pointer border border-gray-300" />
            <input v-model="bgColorSolid" type="text" class="text-xs font-mono bg-white border border-gray-300 rounded px-2 py-1.5 w-28 uppercase" />
          </div>
        </div>

        <div v-else class="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Cor Inicial</label>
              <div class="flex items-center gap-2">
                <input v-model="bgGradientColor1" type="color" class="w-8 h-8 rounded cursor-pointer border border-gray-300" />
                <input v-model="bgGradientColor1" type="text" class="text-xs font-mono bg-white border border-gray-300 rounded px-2 py-1 w-full uppercase" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Cor Final</label>
              <div class="flex items-center gap-2">
                <input v-model="bgGradientColor2" type="color" class="w-8 h-8 rounded cursor-pointer border border-gray-300" />
                <input v-model="bgGradientColor2" type="text" class="text-xs font-mono bg-white border border-gray-300 rounded px-2 py-1 w-full uppercase" />
              </div>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Direção da Angulação</label>
            <select v-model="bgGradientAngle" class="text-xs bg-white border border-gray-300 rounded px-2 py-1.5 w-full">
              <option value="135deg">Diagonal (135°)</option>
              <option value="180deg">Vertical (180°)</option>
              <option value="90deg">Horizontal (90°)</option>
              <option value="45deg">Inclinado (45°)</option>
            </select>
          </div>
        </div>

        <!-- Paleta de Cores dos Elementos -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div class="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <label class="block text-[11px] font-semibold text-gray-700 mb-1">Cartões (Card)</label>
            <div class="flex items-center gap-2">
              <input v-model="fgColor" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
              <input v-model="fgColor" type="text" class="text-[11px] font-mono bg-white border border-gray-300 rounded px-1.5 py-1 w-full uppercase" />
            </div>
          </div>

          <div class="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <label class="block text-[11px] font-semibold text-gray-700 mb-1">Cor Primária</label>
            <div class="flex items-center gap-2">
              <input v-model="primaryColor" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
              <input v-model="primaryColor" type="text" class="text-[11px] font-mono bg-white border border-gray-300 rounded px-1.5 py-1 w-full uppercase" />
            </div>
          </div>

          <div class="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <label class="block text-[11px] font-semibold text-gray-700 mb-1">Destaque (Accent)</label>
            <div class="flex items-center gap-2">
              <input v-model="accentColor" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
              <input v-model="accentColor" type="text" class="text-[11px] font-mono bg-white border border-gray-300 rounded px-1.5 py-1 w-full uppercase" />
            </div>
          </div>

          <div class="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <label class="block text-[11px] font-semibold text-gray-700 mb-1">Cor do Texto</label>
            <div class="flex items-center gap-2">
              <input v-model="textColor" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
              <input v-model="textColor" type="text" class="text-[11px] font-mono bg-white border border-gray-300 rounded px-1.5 py-1 w-full uppercase" />
            </div>
          </div>
        </div>

        <!-- Slider de Blur -->
        <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between mb-1">
            <label class="text-xs font-semibold text-gray-700">Efeito Vidro (Desfoque / Glassmorphism)</label>
            <span class="text-xs font-mono font-bold text-indigo-600">{{ backdropBlur }}px</span>
          </div>
          <input v-model.number="backdropBlur" type="range" min="0" max="20" step="2" class="w-full accent-indigo-600 cursor-pointer" />
        </div>

        <button 
          type="button" 
          @click="saveTheme"
          class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <i class="fa-solid fa-floppy-disk text-sm"></i>
          Salvar e Criar Tema
        </button>
      </div>

      <!-- Live Preview Smartphone Mockup Realista (5 Colunas) -->
      <div class="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col items-center justify-center">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <i class="fa-solid fa-mobile-screen-button text-indigo-600"></i>
          Pré-visualização do Celular (Tempo Real)
        </h3>

        <!-- Moldura Realista do Celular (iPhone Style Chassis) -->
        <div class="relative w-[300px] h-[580px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-[4px] border-slate-800 ring-1 ring-slate-700/50 flex flex-col">
          <!-- Botões Laterais do Aparelho -->
          <div class="absolute -left-[10px] top-24 w-[3px] h-10 bg-slate-700 rounded-l"></div>
          <div class="absolute -left-[10px] top-38 w-[3px] h-12 bg-slate-700 rounded-l"></div>
          <div class="absolute -right-[10px] top-32 w-[3px] h-14 bg-slate-700 rounded-r"></div>

          <!-- Tela Interna do Celular -->
          <div class="w-full h-full rounded-[38px] overflow-hidden flex flex-col relative transition-all duration-300 select-none shadow-inner"
               :style="{
                 background: computedBackground,
                 color: textColor
               }">
            
            <!-- Barra de Status (Clock & Icons) -->
            <div class="pt-2 px-6 flex items-center justify-between text-[10px] font-semibold opacity-90 z-20" :style="{ color: textColor }">
              <span>9:41</span>
              
              <!-- Dynamic Island / Notch -->
              <div class="w-24 h-4 bg-black rounded-full flex items-center justify-end px-2 gap-1 shadow-xs">
                <div class="w-2 h-2 rounded-full bg-slate-800 border border-slate-700"></div>
              </div>

              <div class="flex items-center gap-1">
                <i class="fa-solid fa-signal text-[9px]"></i>
                <i class="fa-solid fa-wifi text-[9px]"></i>
                <i class="fa-solid fa-battery-full text-[10px]"></i>
              </div>
            </div>

            <!-- Conteúdo Interno da Vitrine -->
            <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4 flex flex-col justify-between text-center">
              
              <!-- Profile Header -->
              <div class="space-y-2 pt-2">
                <div class="relative w-16 h-16 rounded-full mx-auto shadow-md border-2 border-white/80 flex items-center justify-center font-bold text-xl transition-all"
                     :style="{ background: primaryColor, color: '#ffffff' }">
                  V
                  <span class="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[9px] shadow-xs">
                    <i class="fa-solid fa-check"></i>
                  </span>
                </div>

                <div>
                  <h4 class="font-bold text-sm tracking-tight transition-all" :style="{ color: textColor }">
                    {{ newThemeLabel || 'Sua Vitrine Digital' }}
                  </h4>
                  <p class="text-[11px] font-mono opacity-80 mt-0.5" :style="{ color: textColor }">
                    vitrine.app/{{ generatedId }}
                  </p>
                  <p class="text-[10px] opacity-70 mt-1 max-w-[200px] mx-auto leading-tight">
                    Links oficiais, catálogo de produtos e atendimento direto via WhatsApp.
                  </p>
                </div>
              </div>

              <!-- Lista de Links de Exemplo -->
              <div class="space-y-2 text-xs">
                <div class="p-2.5 rounded-xl shadow-xs flex items-center justify-between border transition-all"
                     :style="{
                       background: fgColor,
                       borderColor: primaryColor,
                       color: textColor,
                       backdropFilter: backdropBlur > 0 ? `blur(${backdropBlur}px)` : 'none'
                     }">
                  <div class="flex items-center gap-2.5">
                    <div class="w-6 h-6 rounded-lg flex items-center justify-center bg-black/10" :style="{ color: accentColor }">
                      <i class="fa-solid fa-globe text-xs"></i>
                    </div>
                    <span class="font-semibold text-xs">Nosso Site Oficial</span>
                  </div>
                  <i class="fa-solid fa-chevron-right text-[10px] opacity-60" :style="{ color: accentColor }"></i>
                </div>

                <div class="p-2.5 rounded-xl shadow-xs flex items-center justify-between border transition-all"
                     :style="{
                       background: fgColor,
                       borderColor: primaryColor,
                       color: textColor,
                       backdropFilter: backdropBlur > 0 ? `blur(${backdropBlur}px)` : 'none'
                     }">
                  <div class="flex items-center gap-2.5">
                    <div class="w-6 h-6 rounded-lg flex items-center justify-center bg-black/10" :style="{ color: accentColor }">
                      <i class="fa-brands fa-instagram text-xs"></i>
                    </div>
                    <span class="font-semibold text-xs">Siga no Instagram</span>
                  </div>
                  <i class="fa-solid fa-chevron-right text-[10px] opacity-60" :style="{ color: accentColor }"></i>
                </div>

                <!-- Cartão de Contato WhatsApp -->
                <div class="p-2.5 rounded-xl border flex items-center justify-between transition-all"
                     :style="{
                       background: fgColor,
                       borderColor: accentColor,
                       color: textColor,
                       backdropFilter: backdropBlur > 0 ? `blur(${backdropBlur}px)` : 'none'
                     }">
                  <div class="flex items-center gap-2.5 text-left">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs"
                         :style="{ background: primaryColor }">
                      <i class="fa-brands fa-whatsapp"></i>
                    </div>
                    <div>
                      <p class="font-bold text-xs leading-none">Atendimento Comercial</p>
                      <p class="text-[10px] opacity-75 mt-0.5">(96) 98140-3089</p>
                    </div>
                  </div>
                  <span class="text-[9px] font-bold px-2 py-0.5 rounded-full text-white" :style="{ background: accentColor }">
                    WhatsApp
                  </span>
                </div>
              </div>

              <!-- Rodapé da Tela do Celular -->
              <div class="pb-1 text-[9px] opacity-50 font-mono tracking-wider">
                Vitrines © Digital Platform
              </div>
            </div>

            <!-- Home Bar Indicator -->
            <div class="pb-2 flex justify-center">
              <div class="w-28 h-1 rounded-full opacity-60" :style="{ background: textColor }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Galeria de Temas Existentes (Presets + Criados no Admin) -->
    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <i class="fa-solid fa-swatchbook text-indigo-600"></i>
          Galeria de Temas Disponíveis ({{ themeStore.allThemes.length }})
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div 
          v-for="theme in themeStore.allThemes" 
          :key="theme.id"
          class="border rounded-xl p-3.5 space-y-3 relative group hover:shadow-md transition-all bg-gray-50"
          :class="theme.isCustom ? 'border-purple-300' : 'border-gray-200'"
        >
          <!-- Fundo Miniatura -->
          <div class="h-20 rounded-lg p-2.5 flex flex-col justify-between shadow-inner border border-black/10"
               :style="{ background: theme.colors.background, color: theme.colors.text }">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/20 backdrop-blur-xs">
                {{ theme.isCustom ? 'Admin Custom' : 'Sistema' }}
              </span>
              <div class="w-3.5 h-3.5 rounded-full border border-white" :style="{ background: theme.colors.primary }"></div>
            </div>
            <div class="text-xs font-bold truncate">
              {{ theme.label }}
            </div>
          </div>

          <!-- Informações e Ações -->
          <div class="flex items-center justify-between pt-1">
            <span class="text-[11px] font-mono text-gray-500">#{{ theme.id }}</span>

            <div class="flex items-center gap-1.5">
              <button 
                type="button" 
                @click="applyPresetToEditor(theme)"
                title="Copiar cores para o criador"
                class="px-2 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 cursor-pointer"
              >
                Copiar
              </button>

              <button 
                v-if="theme.isCustom"
                type="button" 
                @click="deleteCustomTheme(theme)"
                title="Excluir este tema personalizado"
                class="px-2 py-1 text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200 cursor-pointer"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
