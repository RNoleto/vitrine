<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/themeStore'
import { useFeedbackStore } from '@/stores/feedbackStore'
import { useFontStore } from '@/stores/fontStore'
import { useIconStore } from '@/stores/iconStore'
import VitrineButton from '@/components/ui/VitrineButton.vue'

const themeStore = useThemeStore()
const feedbackStore = useFeedbackStore()
const fontStore = useFontStore()
const iconStore = useIconStore()

onMounted(async () => {
  await fontStore.carregarFontes()
  await iconStore.carregarFamilias()
})

const editorFormRef = ref(null)

// Filtro da Galeria por Categoria
const selectedGalleryTab = ref('all') // 'all' | 'premium' | 'standard' | 'gradient'

// State do Formulário do Criador/Editor de Tema
const editingThemeId = ref(null)
const newThemeLabel = ref('')
const isPremium = ref(true)
const category = ref('premium')
const fontFamily = ref('serif')
const iconFamily = ref('fontawesome-6')
const layoutStyle = ref('portrait-hero')
const cardStyle = ref('gold-bordered')

// Linktree Style Controls
const btnShape = ref('pill') // 'pill' | 'rounded' | 'square' | 'wavy' | 'outline'
const btnShadow = ref('soft') // 'none' | 'soft' | 'medium' | 'hard' | 'glow'
const avatarShape = ref('circle') // 'circle' | 'rounded-square' | 'square'
const showSocialFooter = ref(true)
const socialStyle = ref('minimal') // 'minimal' | 'circle-filled' | 'outline' | 'pills'
const themeSubtitle = ref('')
const themeBannerImage = ref('')

// Fundo: solid | gradient | image | animation
const bgType = ref('solid')
const bgColorSolid = ref('#F5EFEB')
const bgGradientColor1 = ref('#4F46E5')
const bgGradientColor2 = ref('#7C3AED')
const bgGradientAngle = ref('135deg')

// Configurações de Imagem de Fundo
const bgImageUrl = ref('')
const bgAttachment = ref('parallax') // 'scroll' | 'fixed' | 'parallax'
const bgSize = ref('cover') // 'cover' | 'contain' | 'auto' | 'custom'
const bgPosition = ref('center')
const bgPositionX = ref(50) // 0% - 100%
const bgPositionY = ref(50) // 0% - 100%
const bgSizeOption = ref('cover') // 'cover' | 'contain' | 'auto' | 'custom'
const bgCustomScale = ref(100) // % scale se bgSizeOption === 'custom'

const computedBgPosition = computed(() => {
  return `${bgPositionX.value}% ${bgPositionY.value}%`
})

const computedBgSize = computed(() => {
  if (bgSizeOption.value === 'custom') {
    return `${bgCustomScale.value}%`
  }
  return bgSizeOption.value
})

function setGridFocalPoint(x, y) {
  bgPositionX.value = x
  bgPositionY.value = y
}

function parsePositionToCoordinates(posStr) {
  if (!posStr) {
    bgPositionX.value = 50
    bgPositionY.value = 50
    return
  }

  const str = posStr.toString().toLowerCase().trim()
  const percentMatch = str.match(/(\d+)%\s+(\d+)%/)
  if (percentMatch) {
    bgPositionX.value = Math.min(100, Math.max(0, parseInt(percentMatch[1], 10)))
    bgPositionY.value = Math.min(100, Math.max(0, parseInt(percentMatch[2], 10)))
    return
  }

  let x = 50
  let y = 50

  if (str.includes('left')) x = 0
  else if (str.includes('right')) x = 100
  else if (str.includes('center')) x = 50

  if (str.includes('top')) y = 0
  else if (str.includes('bottom')) y = 100
  else if (str.includes('center')) y = 50

  bgPositionX.value = x
  bgPositionY.value = y
}

// Configurações de Animação de Fundo
const bgAnimationType = ref('gradient-flow') // 'gradient-flow' | 'floating-orbs'
const bgAnimationDuration = ref(12) // 4s - 30s
const bgAnimColor3 = ref('#23a6d5')
const bgAnimColor4 = ref('#23d5ab')
const bgOrbColor1 = ref('#6366F1')
const bgOrbColor2 = ref('#EC4899')

function hexToRgba(hex, alpha = 0.45) {
  if (!hex || typeof hex !== 'string') return `rgba(99, 102, 241, ${alpha})`
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex
  let c = hex.replace('#', '')
  if (c.length === 3) c = c.split('').map(x => x + x).join('')
  if (c.length !== 6) return `rgba(99, 102, 241, ${alpha})`
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Configurações de Overlay (Camada de Contraste)
const bgOverlayEnabled = ref(false)
const bgOverlayColor = ref('#000000')
const bgOverlayOpacity = ref(0.4)
const bgOverlayBlur = ref(0)

const fgColor = ref('#E6DCD5')
const primaryColor = ref('#6E4D3B')
const accentColor = ref('#A6826D')
const textColor = ref('#3D2A20')
const backdropBlur = ref(0)

const sampleImages = [
  { label: 'Marble Luxe', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Royal Gold', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Botanic Emerald', url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Cyberpunk Neon', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop' }
]

const computedBackground = computed(() => {
  if (bgType.value === 'solid') {
    return bgColorSolid.value
  }
  if (bgType.value === 'gradient') {
    return `linear-gradient(${bgGradientAngle.value}, ${bgGradientColor1.value}, ${bgGradientColor2.value})`
  }
  if (bgType.value === 'image') {
    return bgImageUrl.value ? `url("${bgImageUrl.value}")` : bgColorSolid.value
  }
  if (bgType.value === 'animation') {
    if (bgAnimationType.value === 'gradient-flow') {
      return `linear-gradient(${bgGradientAngle.value || '-45deg'}, ${bgGradientColor1.value}, ${bgGradientColor2.value}, ${bgAnimColor3.value}, ${bgAnimColor4.value})`
    }
    if (bgAnimationType.value === 'floating-orbs') {
      const orb1 = hexToRgba(bgOrbColor1.value, 0.45)
      const orb2 = hexToRgba(bgOrbColor2.value, 0.45)
      return `radial-gradient(circle at 20% 20%, ${orb1} 0%, transparent 40%), radial-gradient(circle at 80% 80%, ${orb2} 0%, transparent 40%), ${bgColorSolid.value}`
    }
  }
  return bgColorSolid.value
})

const mockupContainerStyle = computed(() => {
  const style = {
    color: textColor.value,
    fontFamily: fontFamily.value === 'serif' ? "'Playfair Display', serif" : fontFamily.value === 'cinzel' ? "'Cinzel', serif" : "'Inter', sans-serif"
  }

  if (bgType.value === 'image' && bgImageUrl.value) {
    style.backgroundImage = `url("${bgImageUrl.value}")`
    style.backgroundSize = computedBgSize.value
    style.backgroundPosition = computedBgPosition.value
    style.backgroundAttachment = bgAttachment.value === 'parallax' || bgAttachment.value === 'fixed' ? 'fixed' : 'scroll'
  } else if (bgType.value === 'animation') {
    if (bgAnimationType.value === 'gradient-flow') {
      style.backgroundImage = computedBackground.value
      style.backgroundSize = '400% 400%'
      style.animation = `bgGradientFlow ${bgAnimationDuration.value}s ease infinite`
    } else {
      style.backgroundImage = computedBackground.value
      style.backgroundSize = '180% 180%, 180% 180%, 100% 100%'
      style.animation = `bgOrbPulse ${bgAnimationDuration.value}s ease-in-out infinite`
    }
  } else if (bgType.value === 'gradient') {
    style.backgroundImage = computedBackground.value
  } else {
    style.backgroundColor = bgColorSolid.value
  }

  return style
})

const computedAvatarShapeClass = computed(() => {
  if (avatarShape.value === 'square') return 'rounded-none'
  if (avatarShape.value === 'rounded-square' || avatarShape.value === 'rounded') return 'rounded-2xl'
  return 'rounded-full'
})

const computedBtnShapeClass = computed(() => {
  if (btnShape.value === 'pill') return 'rounded-full'
  if (btnShape.value === 'rounded') return 'rounded-xl'
  if (btnShape.value === 'square') return 'rounded-none'
  if (btnShape.value === 'wavy') return 'rounded-3xl border-dashed'
  if (btnShape.value === 'outline') return 'rounded-xl !bg-transparent border-2'
  return 'rounded-xl'
})

const computedBtnShadowClass = computed(() => {
  if (btnShadow.value === 'none') return 'shadow-none'
  if (btnShadow.value === 'soft') return 'shadow-sm'
  if (btnShadow.value === 'medium') return 'shadow-md'
  if (btnShadow.value === 'hard') return 'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]'
  if (btnShadow.value === 'glow') return 'shadow-[0_0_15px_rgba(99,102,241,0.6)]'
  return 'shadow-sm'
})

const generatedId = computed(() => {
  if (editingThemeId.value) return editingThemeId.value
  if (!newThemeLabel.value.trim()) return 'custom-premium-theme'
  return (isPremium.value ? 'premium-' : '') + newThemeLabel.value
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
})

const filteredGalleryThemes = computed(() => {
  const all = themeStore.allThemes
  if (selectedGalleryTab.value === 'premium') {
    return all.filter(t => t.isPremium)
  }
  if (selectedGalleryTab.value === 'standard') {
    return all.filter(t => !t.isPremium && t.category !== 'gradient')
  }
  if (selectedGalleryTab.value === 'gradient') {
    return all.filter(t => t.category === 'gradient' || t.bgType === 'gradient' || (t.colors.background && t.colors.background.includes('gradient')))
  }
  return all
})

const customThemePreviewObj = computed(() => ({
  cardStyle: cardStyle.value,
  btnShape: btnShape.value,
  btnShadow: btnShadow.value,
  backdropBlur: backdropBlur.value,
  colors: {
    background: computedBackground.value,
    foreground: fgColor.value,
    primary: primaryColor.value,
    accent: accentColor.value,
    text: textColor.value
  }
}))

function handleBgImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  if (!allowed.includes(file.type)) {
    feedbackStore.showError('Por favor, envie um formato de imagem válido.')
    return
  }
  if (file.size > 3 * 1024 * 1024) {
    feedbackStore.showError('A imagem excede 3MB. Escolha uma imagem menor.')
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    bgImageUrl.value = reader.result
  }
  reader.readAsDataURL(file)
}

async function saveTheme() {
  if (!newThemeLabel.value.trim()) {
    feedbackStore.showError('Por favor, informe o nome do tema.')
    return
  }

  const isEditing = !!editingThemeId.value

  const themeObj = {
    id: generatedId.value,
    label: newThemeLabel.value.trim(),
    isPremium: isPremium.value,
    category: category.value,
    fontFamily: fontFamily.value,
    iconFamily: iconFamily.value,
    layoutStyle: layoutStyle.value,
    cardStyle: cardStyle.value,
    btnShape: btnShape.value,
    btnShadow: btnShadow.value,
    avatarShape: avatarShape.value,
    showSocialFooter: showSocialFooter.value,
    socialStyle: socialStyle.value,
    elements: {
      subtitle: themeSubtitle.value.trim() || undefined,
      banner_image: themeBannerImage.value.trim() || undefined,
    },
    bgType: bgType.value,
    bgImageUrl: bgImageUrl.value,
    bgAttachment: bgAttachment.value,
    bgSize: computedBgSize.value,
    bgPosition: computedBgPosition.value,
    bgAnimationType: bgAnimationType.value,
    bgAnimationDuration: `${bgAnimationDuration.value}s`,
    bgOverlay: {
      enabled: bgOverlayEnabled.value,
      color: bgOverlayColor.value,
      opacity: bgOverlayEnabled.value ? bgOverlayOpacity.value : 0,
      blur: bgOverlayEnabled.value ? bgOverlayBlur.value : 0
    },
    colors: {
      background: computedBackground.value,
      foreground: fgColor.value,
      primary: primaryColor.value,
      accent: accentColor.value,
      text: textColor.value,
    },
    backdropBlur: backdropBlur.value > 0 ? backdropBlur.value : 0,
  }

  try {
    await themeStore.addCustomTheme(themeObj)

    if (isEditing) {
      feedbackStore.showSuccess(`Tema "${themeObj.label}" atualizado com sucesso!`)
    } else {
      feedbackStore.showSuccess(`Tema "${themeObj.label}" criado e disponibilizado com sucesso!`)
    }

    cancelEditing()
  } catch (error) {
    console.error('Erro ao salvar tema:', error)
    feedbackStore.showError('Erro ao salvar tema no banco de dados.')
  }
}

function editCustomTheme(theme) {
  editingThemeId.value = theme.id
  newThemeLabel.value = theme.label
  isPremium.value = theme.isPremium !== undefined ? theme.isPremium : true
  category.value = theme.category || 'premium'
  fontFamily.value = theme.fontFamily || 'serif'
  iconFamily.value = theme.iconFamily || theme.icon_family || 'fontawesome-6'
  layoutStyle.value = theme.layoutStyle || 'portrait-hero'
  cardStyle.value = theme.cardStyle || 'gold-bordered'

  btnShape.value = theme.btnShape || theme.btn_shape || 'pill'
  btnShadow.value = theme.btnShadow || theme.btn_shadow || 'soft'
  avatarShape.value = theme.avatarShape || theme.avatar_shape || 'circle'
  showSocialFooter.value = theme.showSocialFooter !== undefined ? theme.showSocialFooter : true
  socialStyle.value = theme.socialStyle || theme.social_style || 'minimal'
  themeSubtitle.value = theme.elements?.subtitle || ''
  themeBannerImage.value = theme.elements?.banner_image || ''

  bgType.value = theme.bgType || (theme.colors?.background?.includes('gradient') ? 'gradient' : 'solid')
  bgImageUrl.value = theme.bgImageUrl || ''
  bgAttachment.value = theme.bgAttachment || 'parallax'
  bgSize.value = theme.bgSize || 'cover'
  if (theme.bgSize && theme.bgSize.endsWith('%')) {
    bgSizeOption.value = 'custom'
    bgCustomScale.value = parseInt(theme.bgSize, 10) || 100
  } else {
    bgSizeOption.value = theme.bgSize || 'cover'
    bgCustomScale.value = 100
  }

  bgPosition.value = theme.bgPosition || 'center'
  parsePositionToCoordinates(theme.bgPosition)
  bgAnimationType.value = theme.bgAnimationType || 'gradient-flow'
  if (theme.bgAnimationDuration) {
    bgAnimationDuration.value = parseInt(theme.bgAnimationDuration, 10) || (bgAnimationType.value === 'gradient-flow' ? 12 : 8)
  } else {
    bgAnimationDuration.value = bgAnimationType.value === 'gradient-flow' ? 12 : 8
  }

  if (theme.colors?.background && theme.colors.background.includes('linear-gradient')) {
    const matches = theme.colors.background.match(/#([a-fA-F0-9]{3,8})/g)
    if (matches && matches.length >= 4) {
      bgGradientColor1.value = matches[0]
      bgGradientColor2.value = matches[1]
      bgAnimColor3.value = matches[2]
      bgAnimColor4.value = matches[3]
    } else if (matches && matches.length >= 2) {
      bgGradientColor1.value = matches[0]
      bgGradientColor2.value = matches[1]
    }
  } else if (theme.colors?.background && theme.colors.background.includes('radial-gradient')) {
    const matches = theme.colors.background.match(/#([a-fA-F0-9]{3,8})/g)
    if (matches && matches.length >= 3) {
      bgOrbColor1.value = matches[0]
      bgOrbColor2.value = matches[1]
      bgColorSolid.value = matches[2]
    }
  }

  if (theme.bgOverlay) {
    bgOverlayEnabled.value = theme.bgOverlay.enabled || (theme.bgOverlay.opacity > 0)
    bgOverlayColor.value = theme.bgOverlay.color || '#000000'
    bgOverlayOpacity.value = theme.bgOverlay.opacity || 0.4
    bgOverlayBlur.value = theme.bgOverlay.blur || 0
  } else {
    bgOverlayEnabled.value = false
    bgOverlayColor.value = '#000000'
    bgOverlayOpacity.value = 0.4
    bgOverlayBlur.value = 0
  }

  fgColor.value = theme.colors.foreground.startsWith('rgba') ? '#ffffff' : theme.colors.foreground
  primaryColor.value = theme.colors.primary
  accentColor.value = theme.colors.accent
  textColor.value = theme.colors.text
  
  const themeBlur = theme.backdropBlur !== undefined ? Number(theme.backdropBlur) : (theme.backdrop_blur !== undefined ? Number(theme.backdrop_blur) : 0)
  cardStyle.value = theme.cardStyle || theme.card_style || (themeBlur > 0 ? 'glass' : 'gold-bordered')
  backdropBlur.value = themeBlur > 0 ? themeBlur : (cardStyle.value === 'glass' ? 12 : 0)

  if (theme.colors.background && theme.colors.background.includes('gradient')) {
    const matches = theme.colors.background.match(/#([a-fA-F0-9]{3,8})/g)
    if (matches && matches.length >= 2) {
      bgGradientColor1.value = matches[0]
      bgGradientColor2.value = matches[1]
    }
  } else if (bgType.value === 'solid') {
    bgColorSolid.value = theme.colors.background || '#F5EFEB'
  }

  if (editorFormRef.value) {
    editorFormRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}

function cancelEditing() {
  editingThemeId.value = null
  newThemeLabel.value = ''
  isPremium.value = true
  category.value = 'premium'
  fontFamily.value = 'serif'
  iconFamily.value = 'fontawesome-6'
  layoutStyle.value = 'portrait-hero'
  cardStyle.value = 'gold-bordered'

  btnShape.value = 'pill'
  btnShadow.value = 'soft'
  avatarShape.value = 'circle'
  showSocialFooter.value = true
  socialStyle.value = 'minimal'
  themeSubtitle.value = ''
  themeBannerImage.value = ''

  bgType.value = 'solid'
  bgColorSolid.value = '#F5EFEB'
  bgGradientColor1.value = '#4F46E5'
  bgGradientColor2.value = '#7C3AED'
  bgGradientAngle.value = '135deg'

  bgImageUrl.value = ''
  bgAttachment.value = 'parallax'
  bgSize.value = 'cover'
  bgPosition.value = 'center'
  bgPositionX.value = 50
  bgPositionY.value = 50
  bgSizeOption.value = 'cover'
  bgCustomScale.value = 100
  bgAnimationType.value = 'gradient-flow'
  bgAnimationDuration.value = 12
  bgAnimColor3.value = '#23a6d5'
  bgAnimColor4.value = '#23d5ab'
  bgOrbColor1.value = '#6366F1'
  bgOrbColor2.value = '#EC4899'

  bgOverlayEnabled.value = false
  bgOverlayColor.value = '#000000'
  bgOverlayOpacity.value = 0.4
  bgOverlayBlur.value = 0

  fgColor.value = '#E6DCD5'
  primaryColor.value = '#6E4D3B'
  accentColor.value = '#A6826D'
  textColor.value = '#3D2A20'
  backdropBlur.value = 0
}

async function deleteCustomTheme(theme) {
  if (confirm(`Deseja realmente excluir o tema "${theme.label}"?`)) {
    if (editingThemeId.value === theme.id) {
      cancelEditing()
    }
    try {
      await themeStore.removeCustomTheme(theme.id)
      feedbackStore.showSuccess(`Tema "${theme.label}" excluído com sucesso!`)
    } catch (error) {
      console.error('Erro ao excluir tema:', error)
      feedbackStore.showError('Erro ao excluir tema do banco de dados.')
    }
  }
}

function applyPresetToEditor(theme) {
  editCustomTheme(theme)
  editingThemeId.value = null
  newThemeLabel.value = `${theme.label} (Cópia)`
}

onMounted(async () => {
  await themeStore.carregarTemasDoBanco()
})
</script>

<template>
  <section class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gerenciador & Criador de Temas</h1>
        <p class="text-sm text-gray-600 mt-1">
          Crie temas com <span class="font-bold text-indigo-600">imagens de fundo, parallax, animações CSS e máscaras overlay</span> para suas vitrines digitais.
        </p>
      </div>
    </div>

    <!-- Layout Principal: Criador/Editor + Live Preview Mockup Celular -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" ref="editorFormRef">
      <!-- Formulário de Criação/Edição (7 Colunas) -->
      <div class="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="fa-solid fa-crown text-amber-500" v-if="isPremium"></i>
            <i class="fa-solid fa-palette text-indigo-600" v-else></i>
            {{ editingThemeId ? 'Editar Tema Visual' : 'Criar Novo Tema Visual' }}
          </h2>

          <span 
            v-if="editingThemeId"
            class="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1"
          >
            <i class="fa-solid fa-pen-to-square text-[10px]"></i>
            Modo Edição (#{{ editingThemeId }})
          </span>
        </div>

        <!-- Nome do Tema e Categoria -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Nome do Tema *</label>
            <input 
              v-model="newThemeLabel" 
              type="text" 
              placeholder="Ex: Dra. Marina Royal, Marble Parallax, Neon Mesh..."
              class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold"
            />
            <p class="text-[11px] text-gray-400 mt-1 font-mono">ID: theme-{{ generatedId }}</p>
          </div>

          <!-- Seletor Gratuito / Premium VIP -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Categoria de Acesso</label>
            <select 
              v-model="isPremium"
              class="w-full px-3 py-2 text-xs font-bold rounded-xl border outline-none cursor-pointer transition-all"
              :class="isPremium ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-gray-50 border-gray-300 text-gray-700'"
            >
              <option :value="false">⚡ Padrão / Gratuito</option>
              <option :value="true">👑 Premium VIP</option>
            </select>
          </div>
        </div>

        <!-- Tipografia, Ícones & Estilo de Layout -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Tipografia (Fonte)</label>
            <select v-model="fontFamily" class="w-full text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium">
              <optgroup label="Fontes Cadastradas no Sistema">
                <option v-for="f in fontStore.fonts" :key="f.id" :value="f.id || f.family_name">
                  {{ f.display_name || f.family_name }}
                </option>
              </optgroup>
              <optgroup label="Aliases de Compatibilidade">
                <option value="sans">Moderna Clean (Inter)</option>
                <option value="serif">Serifada Elegante (Playfair)</option>
                <option value="cinzel">Nobre / Jurídica (Cinzel)</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Família de Ícones</label>
            <select v-model="iconFamily" class="w-full text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium">
              <option v-for="ic in iconStore.iconFamilies" :key="ic.id" :value="ic.id">
                {{ ic.display_name || ic.family_name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Estilo de Layout</label>
            <select v-model="layoutStyle" class="w-full text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium">
              <option value="portrait-hero">Hero Retrato Profissional</option>
              <option value="landing-page">Landing Page Completa (FAQ + Prova Social)</option>
              <option value="standard">Padrão Empilhado</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Estilo dos Cartões / Botões</label>
            <select v-model="cardStyle" class="w-full text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium">
              <option value="flat">🎨 Cor Sólida (Foreground)</option>
              <option value="gold-bordered">🌈 Gradiente Nobre (Foreground → Background)</option>
              <option value="glass">🧊 Vidro Translúcido (Glassmorphism)</option>
            </select>
          </div>
        </div>

        <!-- ESTILOS DE BOTÕES E PERFIL (ESTILO LINKTREE) -->
        <div class="space-y-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
          <label class="block text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-wand-magic-sparkles text-indigo-600"></i>
            Personalização de Estilo Linktree (Botões, Avatar & Redes)
          </label>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <!-- Formato dos Botões -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Formato dos Botões</label>
              <select v-model="btnShape" class="w-full text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium">
                <option value="pill">💊 Pílula (Rounded Full)</option>
                <option value="rounded">🟩 Cantos Arredondados (Rounded)</option>
                <option value="square">⏹️ Retângulo Reto (Square)</option>
                <option value="wavy">〰️ Ondulado (Wavy Edge)</option>
                <option value="outline">🔲 Contorno Transparente (Outline)</option>
              </select>
            </div>

            <!-- Sombra dos Botões -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Sombra dos Botões</label>
              <select v-model="btnShadow" class="w-full text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium">
                <option value="none">Sem Sombra (Flat)</option>
                <option value="soft">Sombra Suave</option>
                <option value="medium">Sombra Marcada</option>
                <option value="hard">Sombra Rígida (Retro 3D)</option>
                <option value="glow">Brilho Neon (Glow)</option>
              </select>
            </div>

            <!-- Formato do Avatar -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Formato do Avatar</label>
              <select v-model="avatarShape" class="w-full text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium">
                <option value="circle">⚪ Círculo Perfeito</option>
                <option value="rounded-square">▢ Quadrado Arredondado</option>
                <option value="square">⏹️ Quadrado Reto</option>
              </select>
            </div>

            <!-- Rodapé de Redes Sociais -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Estilo de Redes</label>
              <select v-model="socialStyle" class="w-full text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium">
                <option value="minimal">Minimalista White/Black</option>
                <option value="circle-filled">Círculos Preenchidos</option>
                <option value="outline">Anéis com Borda</option>
                <option value="pills">Em Pílulas Badges</option>
              </select>
            </div>

            <!-- Exibir Rodapé Checkbox -->
            <div class="flex items-center sm:pt-5">
              <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                <input type="checkbox" v-model="showSocialFooter" class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                Exibir Ícones de Redes
              </label>
            </div>
          </div>

          <!-- Bio / Banner do Tema -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-indigo-100/60">
            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">Subtítulo / Descrição Padrão do Tema</label>
              <input
                v-model="themeSubtitle"
                type="text"
                placeholder="Ex: Your daily dose of vitamin C | Makeup & Beauty"
                class="w-full text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none"
              />
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">Banner de Imagem Destaque (URL de Imagem / Produto)</label>
              <input
                v-model="themeBannerImage"
                type="text"
                placeholder="Ex: https://images.unsplash.com/... (opcional)"
                class="w-full text-xs font-mono bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none"
              />
            </div>
          </div>
        </div>

        <!-- TIPO DE FUNDO (Solid, Gradient, Image, Animation) -->
        <div class="space-y-3">
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            <i class="fa-solid fa-photo-film text-indigo-500 mr-1"></i> Tipo de Fundo do Tema
          </label>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button 
              type="button"
              @click="bgType = 'solid'"
              class="py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5"
              :class="bgType === 'solid' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'"
            >
              <i class="fa-solid fa-square text-xs"></i> Sólido
            </button>

            <button 
              type="button"
              @click="bgType = 'gradient'"
              class="py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5"
              :class="bgType === 'gradient' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'"
            >
              <i class="fa-solid fa-circle-half-stroke text-xs"></i> Gradiente
            </button>

            <button 
              type="button"
              @click="bgType = 'image'"
              class="py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5"
              :class="bgType === 'image' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'"
            >
              <i class="fa-solid fa-image text-xs"></i> Imagem
            </button>

            <button 
              type="button"
              @click="bgType = 'animation'"
              class="py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5"
              :class="bgType === 'animation' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'"
            >
              <i class="fa-solid fa-wand-magic-sparkles text-xs"></i> Animação
            </button>
          </div>
        </div>

        <!-- PAINEL DE IMAGEM DE FUNDO (IMAGE CONFIGS) -->
        <div v-if="bgType === 'image'" class="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl space-y-4">
          <div class="space-y-2">
            <label class="block text-xs font-bold text-gray-800">URL da Imagem ou Upload de Arquivo</label>
            <div class="flex flex-col sm:flex-row gap-2">
              <input
                v-model="bgImageUrl"
                type="text"
                placeholder="https://images.unsplash.com/..."
                class="flex-1 px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <div class="shrink-0">
                <input id="upload-bg-img" type="file" accept="image/*" @change="handleBgImageUpload" class="hidden" />
                <label for="upload-bg-img" class="cursor-pointer px-3 py-2 bg-white border border-gray-300 hover:border-indigo-400 text-gray-700 font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5">
                  <i class="fa-solid fa-upload text-indigo-600"></i> Enviar Foto
                </label>
              </div>
            </div>

            <!-- Imagens de Exemplo Rápidas -->
            <div class="pt-1 flex items-center gap-1.5 flex-wrap">
              <span class="text-[10px] font-bold text-gray-500">Preset rápido:</span>
              <button
                v-for="(img, idx) in sampleImages"
                :key="idx"
                @click="bgImageUrl = img.url"
                class="px-2 py-0.5 bg-white border border-gray-200 hover:border-indigo-400 rounded-lg text-[10px] font-semibold text-gray-700 cursor-pointer"
              >
                {{ img.label }}
              </button>
            </div>
          </div>

          <!-- Efeito Paralax, Ponto Focal e Ajustes Avançados da Imagem -->
          <div class="space-y-4 pt-2 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-gray-800">
                🎯 Posicionamento & Ponto Focal da Imagem
              </label>
              <span class="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                Posição: {{ bgPositionX }}% X, {{ bgPositionY }}% Y
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200">
              <!-- Grade 3x3 de Pontos Focais Rápidos -->
              <div class="md:col-span-5 space-y-1">
                <label class="block text-[11px] font-semibold text-gray-600 mb-1">Âncoras Focais Rápidas (3x3)</label>
                <div class="grid grid-cols-3 gap-1.5 w-full max-w-[200px] mx-auto md:mx-0">
                  <button 
                    type="button"
                    @click="setGridFocalPoint(0, 0)" 
                    :class="['p-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center', bgPositionX === 0 && bgPositionY === 0 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100']"
                    title="Topo Esquerda (0% 0%)"
                  >↖</button>
                  <button 
                    type="button"
                    @click="setGridFocalPoint(50, 0)" 
                    :class="['p-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center', bgPositionX === 50 && bgPositionY === 0 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100']"
                    title="Topo Centro (50% 0%)"
                  >⬆</button>
                  <button 
                    type="button"
                    @click="setGridFocalPoint(100, 0)" 
                    :class="['p-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center', bgPositionX === 100 && bgPositionY === 0 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100']"
                    title="Topo Direita (100% 0%)"
                  >↗</button>

                  <button 
                    type="button"
                    @click="setGridFocalPoint(0, 50)" 
                    :class="['p-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center', bgPositionX === 0 && bgPositionY === 50 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100']"
                    title="Centro Esquerda (0% 50%)"
                  >⬅</button>
                  <button 
                    type="button"
                    @click="setGridFocalPoint(50, 50)" 
                    :class="['p-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center', bgPositionX === 50 && bgPositionY === 50 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100']"
                    title="Centro Absoluto (50% 50%)"
                  >⏺</button>
                  <button 
                    type="button"
                    @click="setGridFocalPoint(100, 50)" 
                    :class="['p-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center', bgPositionX === 100 && bgPositionY === 50 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100']"
                    title="Centro Direita (100% 50%)"
                  >➡</button>

                  <button 
                    type="button"
                    @click="setGridFocalPoint(0, 100)" 
                    :class="['p-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center', bgPositionX === 0 && bgPositionY === 100 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100']"
                    title="Base Esquerda (0% 100%)"
                  >↙</button>
                  <button 
                    type="button"
                    @click="setGridFocalPoint(50, 100)" 
                    :class="['p-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center', bgPositionX === 50 && bgPositionY === 100 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100']"
                    title="Base Centro (50% 100%)"
                  >⬇</button>
                  <button 
                    type="button"
                    @click="setGridFocalPoint(100, 100)" 
                    :class="['p-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center', bgPositionX === 100 && bgPositionY === 100 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100']"
                    title="Base Direita (100% 100%)"
                  >↘</button>
                </div>
              </div>

              <!-- Sliders de Ajuste Fino Percentual X e Y -->
              <div class="md:col-span-7 space-y-3">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="text-[11px] font-semibold text-gray-700">Horizontal (Eixo X): {{ bgPositionX }}%</label>
                    <span class="text-[10px] text-gray-400">0% Esquerda | 100% Direita</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="range" min="0" max="100" v-model.number="bgPositionX" class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                    <input type="number" min="0" max="100" v-model.number="bgPositionX" class="w-14 text-xs font-mono text-center border border-gray-300 rounded px-1 py-0.5 bg-white" />
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="text-[11px] font-semibold text-gray-700">Vertical (Eixo Y): {{ bgPositionY }}%</label>
                    <span class="text-[10px] text-gray-400">0% Topo | 100% Base</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="range" min="0" max="100" v-model.number="bgPositionY" class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                    <input type="number" min="0" max="100" v-model.number="bgPositionY" class="w-14 text-xs font-mono text-center border border-gray-300 rounded px-1 py-0.5 bg-white" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Controles de Efeito, Tamanho e Escala Customizada -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Efeito / Fixação (Parallax)</label>
                <select v-model="bgAttachment" class="w-full text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-bold text-indigo-700">
                  <option value="parallax">✨ Paralax Suave (Fixo)</option>
                  <option value="fixed">📌 Imagem Fixa na Tela</option>
                  <option value="scroll">📜 Rolagem Normal</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Dimensionamento / Escala</label>
                <select v-model="bgSizeOption" class="w-full text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-medium">
                  <option value="cover">Preencher Tela (Cover - Padrão)</option>
                  <option value="contain">Conter Imagem Completa (Contain)</option>
                  <option value="auto">Tamanho Original (Auto)</option>
                  <option value="custom">🔍 Zoom / Escala Customizada (%)</option>
                </select>
              </div>
            </div>

            <div v-if="bgSizeOption === 'custom'" class="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
              <div class="flex items-center justify-between">
                <label class="text-xs font-semibold text-gray-800">Escala de Zoom da Imagem: {{ bgCustomScale }}%</label>
                <span class="text-[10px] text-indigo-600 font-bold">Resolução livre</span>
              </div>
              <div class="flex items-center gap-3">
                <input type="range" min="10" max="300" step="5" v-model.number="bgCustomScale" class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                <input type="number" min="10" max="300" v-model.number="bgCustomScale" class="w-16 text-xs font-mono text-center border border-gray-300 rounded px-1 py-0.5 bg-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- PAINEL DE ANIMAÇÃO DE FUNDO (ANIMATION CONFIGS) -->
        <div v-if="bgType === 'animation'" class="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl space-y-4">
          <label class="block text-xs font-bold text-gray-800">Selecione o Estilo de Animação CSS Dinâmica</label>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div 
              @click="bgAnimationType = 'gradient-flow'"
              :class="[
                'p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between',
                bgAnimationType === 'gradient-flow' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-water"></i>
                <span>Gradiente em Movimento</span>
              </div>
              <i class="fa-solid fa-check text-xs" v-if="bgAnimationType === 'gradient-flow'"></i>
            </div>

            <div 
              @click="bgAnimationType = 'floating-orbs'"
              :class="[
                'p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between',
                bgAnimationType === 'floating-orbs' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-circle-nodes"></i>
                <span>Orbes de Luz Flutuantes</span>
              </div>
              <i class="fa-solid fa-check text-xs" v-if="bgAnimationType === 'floating-orbs'"></i>
            </div>
          </div>

          <!-- CONFIGURAÇÕES DE CORES DO GRADIENTE EM MOVIMENTO -->
          <div v-if="bgAnimationType === 'gradient-flow'" class="p-3 bg-white rounded-xl border border-gray-200 space-y-3">
            <label class="block text-xs font-bold text-gray-800">Paleta de Cores do Gradiente Fluido (4 Cores)</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label class="block text-[10px] font-semibold text-gray-600 mb-1">Cor 1</label>
                <div class="flex items-center gap-1.5">
                  <input v-model="bgGradientColor1" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
                  <input v-model="bgGradientColor1" type="text" class="text-[10px] font-mono bg-gray-50 border border-gray-200 rounded px-1 py-1 w-full uppercase" />
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-gray-600 mb-1">Cor 2</label>
                <div class="flex items-center gap-1.5">
                  <input v-model="bgGradientColor2" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
                  <input v-model="bgGradientColor2" type="text" class="text-[10px] font-mono bg-gray-50 border border-gray-200 rounded px-1 py-1 w-full uppercase" />
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-gray-600 mb-1">Cor 3</label>
                <div class="flex items-center gap-1.5">
                  <input v-model="bgAnimColor3" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
                  <input v-model="bgAnimColor3" type="text" class="text-[10px] font-mono bg-gray-50 border border-gray-200 rounded px-1 py-1 w-full uppercase" />
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-gray-600 mb-1">Cor 4</label>
                <div class="flex items-center gap-1.5">
                  <input v-model="bgAnimColor4" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
                  <input v-model="bgAnimColor4" type="text" class="text-[10px] font-mono bg-gray-50 border border-gray-200 rounded px-1 py-1 w-full uppercase" />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Ângulo / Direção do Fluxo</label>
              <select v-model="bgGradientAngle" class="text-xs bg-white border border-gray-300 rounded-lg px-2 py-1.5 w-full font-medium">
                <option value="-45deg">Diagonal Inclinada (-45°)</option>
                <option value="135deg">Diagonal Descendente (135°)</option>
                <option value="90deg">Horizontal (90°)</option>
                <option value="180deg">Vertical (180°)</option>
              </select>
            </div>
          </div>

          <!-- CONFIGURAÇÕES DE CORES DAS ORBES DE LUZ -->
          <div v-if="bgAnimationType === 'floating-orbs'" class="p-3 bg-white rounded-xl border border-gray-200 space-y-3">
            <label class="block text-xs font-bold text-gray-800">Cores das Orbes & Fundo Base</label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label class="block text-[10px] font-semibold text-gray-600 mb-1">Cor do Fundo Base</label>
                <div class="flex items-center gap-1.5">
                  <input v-model="bgColorSolid" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
                  <input v-model="bgColorSolid" type="text" class="text-[10px] font-mono bg-gray-50 border border-gray-200 rounded px-1 py-1 w-full uppercase" />
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-gray-600 mb-1">Orbe de Luz 1 (Superior)</label>
                <div class="flex items-center gap-1.5">
                  <input v-model="bgOrbColor1" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
                  <input v-model="bgOrbColor1" type="text" class="text-[10px] font-mono bg-gray-50 border border-gray-200 rounded px-1 py-1 w-full uppercase" />
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-gray-600 mb-1">Orbe de Luz 2 (Inferior)</label>
                <div class="flex items-center gap-1.5">
                  <input v-model="bgOrbColor2" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
                  <input v-model="bgOrbColor2" type="text" class="text-[10px] font-mono bg-gray-50 border border-gray-200 rounded px-1 py-1 w-full uppercase" />
                </div>
              </div>
            </div>
          </div>

          <!-- VELOCIDADE DA ANIMAÇÃO -->
          <div class="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-gray-800">Velocidade da Animação: {{ bgAnimationDuration }}s por ciclo</label>
              <span class="text-[10px] font-bold text-indigo-600">
                {{ bgAnimationDuration <= 6 ? '⚡ Rápida' : bgAnimationDuration <= 15 ? '🌊 Suave' : '🧘 Muito Lenta' }}
              </span>
            </div>
            <div class="flex items-center gap-3">
              <input type="range" min="4" max="30" step="1" v-model.number="bgAnimationDuration" class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              <input type="number" min="4" max="30" v-model.number="bgAnimationDuration" class="w-16 text-xs font-mono text-center border border-gray-300 rounded px-1 py-0.5 bg-white" />
            </div>
          </div>
        </div>

        <!-- PAINEL DE COR SÓLIDA OU GRADIENTE -->
        <div v-if="bgType === 'solid'" class="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <label class="block text-xs font-medium text-gray-600 mb-1">Cor do Fundo</label>
          <div class="flex items-center gap-3">
            <input v-model="bgColorSolid" type="color" class="w-9 h-9 rounded cursor-pointer border border-gray-300" />
            <input v-model="bgColorSolid" type="text" class="text-xs font-mono bg-white border border-gray-300 rounded-lg px-2 py-1.5 w-28 uppercase" />
          </div>
        </div>

        <div v-if="bgType === 'gradient'" class="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
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
            <select v-model="bgGradientAngle" class="text-xs bg-white border border-gray-300 rounded-lg px-2 py-1.5 w-full">
              <option value="135deg">Diagonal (135°)</option>
              <option value="180deg">Vertical (180°)</option>
              <option value="90deg">Horizontal (90°)</option>
              <option value="45deg">Inclinado (45°)</option>
            </select>
          </div>
        </div>

        <!-- CAMADA DE OVERLAY (Máscara de Leitura / Contraste) -->
        <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-gray-800 flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" v-model="bgOverlayEnabled" class="w-4 h-4 text-indigo-600 rounded" />
              <span>Ativar Película Overlay (Máscara de Leitura)</span>
            </label>
            <span class="text-[10px] text-gray-400">Melhora a legibilidade sobre imagens</span>
          </div>

          <div v-if="bgOverlayEnabled" class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-gray-200">
            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">Cor da Película</label>
              <div class="flex items-center gap-2">
                <input v-model="bgOverlayColor" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
                <input v-model="bgOverlayColor" type="text" class="text-[11px] font-mono bg-white border border-gray-300 rounded px-1.5 py-1 w-full uppercase" />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-[11px] font-semibold text-gray-700">Opacidade</label>
                <span class="text-[10px] font-mono font-bold text-indigo-600">{{ Math.round(bgOverlayOpacity * 100) }}%</span>
              </div>
              <input v-model.number="bgOverlayOpacity" type="range" min="0" max="0.9" step="0.05" class="w-full accent-indigo-600 cursor-pointer" />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-[11px] font-semibold text-gray-700">Desfoque Fundo (Blur)</label>
                <span class="text-[10px] font-mono font-bold text-indigo-600">{{ bgOverlayBlur }}px</span>
              </div>
              <input v-model.number="bgOverlayBlur" type="range" min="0" max="15" step="1" class="w-full accent-indigo-600 cursor-pointer" />
            </div>
          </div>
        </div>

        <!-- Paleta de Cores dos Elementos -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div class="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
            <label class="block text-[11px] font-semibold text-gray-700 mb-1">Cartões (Card)</label>
            <div class="flex items-center gap-2">
              <input v-model="fgColor" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
              <input v-model="fgColor" type="text" class="text-[11px] font-mono bg-white border border-gray-300 rounded px-1.5 py-1 w-full uppercase" />
            </div>
          </div>

          <div class="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
            <label class="block text-[11px] font-semibold text-gray-700 mb-1">Cor Primária</label>
            <div class="flex items-center gap-2">
              <input v-model="primaryColor" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
              <input v-model="primaryColor" type="text" class="text-[11px] font-mono bg-white border border-gray-300 rounded px-1.5 py-1 w-full uppercase" />
            </div>
          </div>

          <div class="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
            <label class="block text-[11px] font-semibold text-gray-700 mb-1">Destaque (Accent)</label>
            <div class="flex items-center gap-2">
              <input v-model="accentColor" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
              <input v-model="accentColor" type="text" class="text-[11px] font-mono bg-white border border-gray-300 rounded px-1.5 py-1 w-full uppercase" />
            </div>
          </div>

          <div class="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
            <label class="block text-[11px] font-semibold text-gray-700 mb-1">Cor do Texto</label>
            <div class="flex items-center gap-2">
              <input v-model="textColor" type="color" class="w-7 h-7 rounded cursor-pointer border border-gray-300" />
              <input v-model="textColor" type="text" class="text-[11px] font-mono bg-white border border-gray-300 rounded px-1.5 py-1 w-full uppercase" />
            </div>
          </div>
        </div>

        <!-- Slider de Blur de Vidro -->
        <div class="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div class="flex items-center justify-between mb-1">
            <label class="text-xs font-semibold text-gray-700">Efeito Vidro nos Cartões (Glassmorphism)</label>
            <span class="text-xs font-mono font-bold text-indigo-600">{{ backdropBlur }}px</span>
          </div>
          <input v-model.number="backdropBlur" type="range" min="0" max="20" step="2" class="w-full accent-indigo-600 cursor-pointer" />
        </div>

        <!-- Botões de Ação do Formulário -->
        <div class="flex items-center gap-3 pt-2">
          <button 
            type="button" 
            @click="saveTheme"
            class="flex-1 py-3 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            :class="isPremium ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'"
          >
            <i class="fa-solid fa-crown text-sm" v-if="isPremium"></i>
            <i class="fa-solid fa-floppy-disk text-sm" v-else></i>
            {{ editingThemeId ? 'Salvar Alterações do Tema' : (isPremium ? 'Salvar Tema Premium VIP' : 'Salvar e Criar Tema') }}
          </button>

          <button 
            v-if="editingThemeId"
            type="button" 
            @click="cancelEditing"
            class="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
            Cancelar
          </button>
        </div>
      </div>

      <!-- Live Preview Smartphone Mockup Realista (5 Colunas) -->
      <div class="lg:col-span-5 lg:sticky lg:top-4 self-start bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col items-center justify-center">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <i class="fa-solid fa-mobile-screen-button text-indigo-600"></i>
          Pré-visualização do Celular (Tempo Real)
        </h3>

        <!-- Moldura Realista do Celular (iPhone 13 Proportions) -->
        <div class="relative w-full max-w-[340px] h-[680px] bg-slate-900 rounded-[48px] p-3.5 shadow-2xl border-[5px] border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden">
          <!-- Botões Laterais do Aparelho -->
          <div class="absolute -left-[8px] top-24 w-[3px] h-10 bg-slate-700 rounded-l"></div>
          <div class="absolute -left-[8px] top-38 w-[3px] h-12 bg-slate-700 rounded-l"></div>
          <div class="absolute -right-[8px] top-32 w-[3px] h-14 bg-slate-700 rounded-r"></div>

          <!-- Overlay Layer no Mockup -->
          <div 
            v-if="bgOverlayEnabled && bgOverlayOpacity > 0"
            class="absolute inset-3.5 rounded-[36px] pointer-events-none z-10 transition-all duration-300"
            :style="{
              backgroundColor: bgOverlayColor,
              opacity: bgOverlayOpacity,
              backdropFilter: bgOverlayBlur > 0 ? `blur(${bgOverlayBlur}px)` : 'none'
            }"
          ></div>

          <!-- Tela Interna do Celular -->
          <div 
            class="w-full h-[640px] rounded-[36px] overflow-y-auto flex flex-col relative transition-all duration-300 select-none shadow-inner z-0"
            :style="mockupContainerStyle"
          >
            
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

            <!-- Conteúdo Interno da Vitrine (Scrollable) -->
            <div class="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-center scrollbar-none relative z-20">
              
              <!-- Layout HERO PROFISSIONAL -->
              <div v-if="layoutStyle === 'portrait-hero' || layoutStyle === 'landing-page'" class="space-y-3 pt-1">
                <div class="relative w-full h-44 rounded-2xl overflow-hidden shadow-md border border-white/20">
                  <img :src="themeBannerImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop'" class="w-full h-full object-cover" alt="Hero Portrait" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3 text-left">
                    <div>
                      <span v-if="isPremium" class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-amber-950 inline-block mb-1">
                        👑 VIP Pro
                      </span>
                      <h4 class="font-bold text-sm text-white tracking-tight leading-none">
                        Dra. Marina Almeida
                      </h4>
                      <p class="text-[10px] text-amber-200 mt-0.5 font-medium">Advocacia Estratégica & Consultoria</p>
                    </div>
                  </div>
                </div>

                <p class="text-[10px] leading-tight opacity-80 italic" :style="{ color: textColor }">
                  "{{ themeSubtitle || 'Soluções jurídicas preventivas e atendimento estratégico personalizado.' }}"
                </p>
              </div>

              <!-- Layout PADRÃO -->
              <div v-else class="space-y-2 pt-2">
                <div 
                  class="relative w-16 h-16 mx-auto shadow-md border-2 border-white/80 flex items-center justify-center font-bold text-xl transition-all"
                  :class="computedAvatarShapeClass"
                  :style="{ background: primaryColor, color: '#ffffff' }"
                >
                  V
                </div>
                <div>
                  <h4 class="font-bold text-sm tracking-tight transition-all" :style="{ color: textColor }">
                    {{ newThemeLabel || 'Sua Vitrine Digital' }}
                  </h4>
                  <p class="text-[11px] font-mono opacity-80 mt-0.5" :style="{ color: textColor }">
                    vitrine.app/{{ generatedId }}
                  </p>
                </div>
              </div>

              <!-- Lista de Links Elegantes -->
              <div class="space-y-2 text-xs">
                <VitrineButton
                  text="Agende sua Consulta"
                  icon="fa-solid fa-calendar-check"
                  :show-arrow="true"
                  :theme="customThemePreviewObj"
                />

                <VitrineButton
                  text="Áreas de Atuação"
                  icon="fa-solid fa-scale-balanced"
                  :show-arrow="true"
                  :theme="customThemePreviewObj"
                />

                <VitrineButton
                  text="Fale Conosco"
                  subtitle="(96) 98140-3089"
                  icon="fa-brands fa-whatsapp"
                  :show-arrow="true"
                  :theme="customThemePreviewObj"
                />
              </div>

              <!-- Rodapé de Redes Sociais no Mockup em Tempo Real -->
              <div v-if="showSocialFooter" class="pt-3 border-t border-white/10 flex items-center justify-center gap-2 flex-wrap">
                <template v-if="socialStyle === 'minimal'">
                  <span v-for="ic in ['instagram', 'whatsapp', 'facebook', 'linkedin', 'globe']" :key="ic" class="p-1.5 opacity-80 hover:opacity-100 transition-opacity" :style="{ color: textColor }">
                    <i :class="['fa-brands', `fa-${ic}`, ic === 'globe' ? 'fa-solid' : '']" class="text-xs"></i>
                  </span>
                </template>
                <template v-else-if="socialStyle === 'circle-filled'">
                  <span v-for="ic in ['instagram', 'whatsapp', 'facebook', 'linkedin', 'globe']" :key="ic" class="w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-xs" :style="{ background: primaryColor, color: '#FFFFFF' }">
                    <i :class="['fa-brands', `fa-${ic}`, ic === 'globe' ? 'fa-solid' : '']" class="text-[10px]"></i>
                  </span>
                </template>
                <template v-else-if="socialStyle === 'outline'">
                  <span v-for="ic in ['instagram', 'whatsapp', 'facebook', 'linkedin', 'globe']" :key="ic" class="w-6 h-6 rounded-full border flex items-center justify-center text-xs" :style="{ borderColor: accentColor, color: textColor }">
                    <i :class="['fa-brands', `fa-${ic}`, ic === 'globe' ? 'fa-solid' : '']" class="text-[10px]"></i>
                  </span>
                </template>
                <template v-else-if="socialStyle === 'pills'">
                  <span v-for="ic in ['instagram', 'whatsapp', 'linkedin']" :key="ic" class="px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 border" :style="{ background: fgColor, borderColor: accentColor, color: textColor }">
                    <i :class="['fa-brands', `fa-${ic}`]" class="text-[9px]"></i>
                    <span class="capitalize">{{ ic }}</span>
                  </span>
                </template>
              </div>

              <!-- Rodapé da Tela do Celular -->
              <div class="pb-1 text-[9px] opacity-60 font-mono tracking-wider" :style="{ color: textColor }">
                Vitrines VIP Platform
              </div>
            </div>

            <!-- Home Bar Indicator -->
            <div class="pb-2 flex justify-center relative z-20">
              <div class="w-28 h-1 rounded-full opacity-60" :style="{ background: textColor }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Galeria de Temas Existentes com Abas de Categorização -->
    <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-3">
        <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <i class="fa-solid fa-swatchbook text-indigo-600"></i>
          Galeria de Temas Disponíveis ({{ themeStore.allThemes.length }})
        </h2>

        <!-- Abas de Categoria -->
        <div class="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
          <button 
            type="button" 
            @click="selectedGalleryTab = 'all'"
            class="px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer"
            :class="selectedGalleryTab === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'"
          >
            Todos
          </button>
          <button 
            type="button" 
            @click="selectedGalleryTab = 'premium'"
            class="px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 text-amber-800"
            :class="selectedGalleryTab === 'premium' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'hover:bg-amber-100/50'"
          >
            <i class="fa-solid fa-crown text-[10px]"></i>
            Premium VIP
          </button>
          <button 
            type="button" 
            @click="selectedGalleryTab = 'gradient'"
            class="px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer"
            :class="selectedGalleryTab === 'gradient' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'"
          >
            Gradientes / Animações
          </button>
          <button 
            type="button" 
            @click="selectedGalleryTab = 'standard'"
            class="px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer"
            :class="selectedGalleryTab === 'standard' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'"
          >
            Padrão
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div 
          v-for="theme in filteredGalleryThemes" 
          :key="theme.id"
          class="border rounded-2xl p-3.5 space-y-3 relative group hover:shadow-md transition-all bg-gray-50"
          :class="[
            theme.isPremium ? 'border-amber-300 ring-1 ring-amber-200' : (theme.isCustom ? 'border-purple-300' : 'border-gray-200'),
            editingThemeId === theme.id ? 'ring-2 ring-purple-500 bg-purple-50/30' : ''
          ]"
        >
          <!-- Fundo Miniatura -->
          <div 
            class="h-24 rounded-xl p-2.5 flex flex-col justify-between shadow-inner border border-black/10 relative overflow-hidden bg-cover bg-center"
            :style="themeStore.getThemePreviewStyle(theme)"
          >
            <div class="flex items-center justify-between relative z-10">
              <span 
                v-if="theme.isPremium" 
                class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 flex items-center gap-1 shadow-xs"
              >
                <i class="fa-solid fa-crown text-[8px]"></i> PREMIUM VIP
              </span>
              <span 
                v-else 
                class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/30 text-white backdrop-blur-xs"
              >
                {{ theme.isCustom ? 'Admin Custom' : 'Sistema' }}
              </span>
              <div class="w-3.5 h-3.5 rounded-full border border-white" :style="{ background: theme.colors.primary }"></div>
            </div>
            <div class="text-xs font-bold truncate relative z-10 drop-shadow-xs">
              {{ theme.label }}
            </div>
          </div>

          <!-- Informações e Ações -->
          <div class="flex items-center justify-between pt-1">
            <span class="text-[11px] font-mono text-gray-500">#{{ theme.id }}</span>

            <div class="flex items-center gap-1 flex-wrap justify-end">
              <button 
                type="button" 
                @click="applyPresetToEditor(theme)"
                title="Copiar este tema como base para um novo"
                class="px-2 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 cursor-pointer flex items-center gap-1"
              >
                <i class="fa-solid fa-copy"></i>
                Copiar
              </button>

              <button 
                type="button" 
                @click="editCustomTheme(theme)"
                title="Editar este tema diretamente"
                class="px-2 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 cursor-pointer flex items-center gap-1"
              >
                <i class="fa-solid fa-pen-to-square"></i>
                Editar
              </button>

              <button 
                type="button" 
                @click="deleteCustomTheme(theme)"
                title="Excluir este tema do sistema"
                class="px-2 py-1 text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 cursor-pointer flex items-center gap-1"
              >
                <i class="fa-solid fa-trash-can"></i>
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
button {
  cursor: pointer;
}
</style>
