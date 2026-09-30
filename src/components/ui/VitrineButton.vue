<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

const props = defineProps({
  text: String,
  subtitle: String,
  icon: String,
  photo: String,
  link: String,
  internal: Boolean,
  showArrow: {
    type: Boolean,
    default: true
  },
  cardStyle: {
    type: String,
    default: null
  },
  theme: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['click'])

const themeStore = useThemeStore()

// Resolve o tema ativo (prop customizada ou themeStore)
const activeTheme = computed(() => {
  return props.theme || themeStore.currentThemeObject || {}
})

// Estilo do Card (flat, gradient, glass, etc)
const resolvedCardStyle = computed(() => {
  if (props.cardStyle) return props.cardStyle
  const theme = activeTheme.value
  const blur = theme?.backdropBlur !== undefined ? Number(theme.backdropBlur) : (theme?.backdrop_blur !== undefined ? Number(theme.backdrop_blur) : 0)
  const style = theme?.cardStyle || theme?.card_style || 'flat'
  if (style === 'glass' || blur > 0) return 'glass'
  return style
})

// Blur de backdrop
const resolvedBlur = computed(() => {
  const theme = activeTheme.value
  const blur = theme?.backdropBlur !== undefined ? Number(theme.backdropBlur) : (theme?.backdrop_blur !== undefined ? Number(theme.backdrop_blur) : 0)
  return blur > 0 ? blur : 12
})

// Formato do botão (pill, rounded, square, wavy, outline)
const btnShape = computed(() => {
  const theme = activeTheme.value
  return theme?.btnShape || theme?.btn_shape || 'pill'
})

const btnShapeClass = computed(() => `btn-shape-${btnShape.value}`)

// Sombra do botão (none, soft, medium, hard, glow)
const btnShadowClass = computed(() => {
  const theme = activeTheme.value
  const shadow = theme?.btnShadow || theme?.btn_shadow || 'soft'
  return `btn-shadow-${shadow}`
})

// Objeto de estilos dinâmicos para o botão container
const buttonStyleObj = computed(() => {
  const isOutline = btnShape.value === 'outline'
  const isGlass = resolvedCardStyle.value === 'glass'
  const isGradient = resolvedCardStyle.value === 'gold-bordered' || resolvedCardStyle.value === 'gradient'

  let bg = 'var(--color-foreground)'
  if (isOutline) {
    bg = 'transparent'
  } else if (isGlass) {
    bg = 'color-mix(in srgb, var(--color-foreground) 45%, transparent)'
  } else if (isGradient) {
    bg = 'linear-gradient(135deg, var(--color-foreground), var(--color-background))'
  }

  let border = 'var(--color-accent)'
  if (isOutline) {
    border = 'var(--color-primary)'
  }

  let filter = 'none'
  if (isGlass) {
    filter = `blur(${resolvedBlur.value}px)`
  }

  return {
    background: bg,
    borderColor: border,
    color: 'var(--color-text)',
    backdropFilter: filter,
    WebkitBackdropFilter: filter
  }
})

// Objeto de estilos dinâmicos para a bolinha do ícone
const iconWrapperStyleObj = computed(() => {
  const isGlass = resolvedCardStyle.value === 'glass'

  let bg = 'var(--color-background-solid, var(--color-background))'
  if (isGlass) {
    bg = 'color-mix(in srgb, var(--color-foreground) 65%, transparent)'
  }

  let filter = 'none'
  if (isGlass) {
    filter = 'blur(8px)'
  }

  return {
    background: bg,
    border: '1px solid var(--color-accent)',
    backdropFilter: filter,
    WebkitBackdropFilter: filter
  }
})

function handleClick(e) {
  emit('click', e)
}
</script>

<template>
  <!-- Link Interno (RouterLink) -->
  <RouterLink
    v-if="link && internal"
    :to="link"
    :class="['vitrine-button', `card-style-${resolvedCardStyle}`, btnShapeClass, btnShadowClass]"
    :style="buttonStyleObj"
    @click="handleClick"
  >
    <div class="icon-wrapper" :style="iconWrapperStyleObj">
      <img v-if="photo" :src="photo" alt="Foto" class="photo" />
      <i v-else-if="icon" :class="icon" class="icon" style="color: var(--color-accent);" />
      <i v-else class="fa-solid fa-link icon opacity-50" style="color: var(--color-accent);" />
    </div>

    <div class="button-content flex-1 min-w-0">
      <p class="button-title" style="color: var(--color-text);">{{ text }}</p>
      <span v-if="subtitle" class="button-subtitle" style="color: var(--color-text);">{{ subtitle }}</span>
    </div>

    <div v-if="showArrow" class="arrow-wrapper">
      <i class="fa-solid fa-chevron-right arrow-icon" style="color: var(--color-accent);" />
    </div>
  </RouterLink>

  <!-- Link Externo (a) -->
  <a
    v-else-if="link && !internal"
    :href="link"
    target="_blank"
    rel="noopener noreferrer"
    :class="['vitrine-button', `card-style-${resolvedCardStyle}`, btnShapeClass, btnShadowClass]"
    :style="buttonStyleObj"
    @click="handleClick"
  >
    <div class="icon-wrapper" :style="iconWrapperStyleObj">
      <img v-if="photo" :src="photo" alt="Foto" class="photo" />
      <i v-else-if="icon" :class="icon" class="icon" style="color: var(--color-accent);" />
      <i v-else class="fa-solid fa-link icon opacity-50" style="color: var(--color-accent);" />
    </div>

    <div class="button-content flex-1 min-w-0">
      <p class="button-title" style="color: var(--color-text);">{{ text }}</p>
      <span v-if="subtitle" class="button-subtitle" style="color: var(--color-text);">{{ subtitle }}</span>
    </div>

    <div v-if="showArrow" class="arrow-wrapper">
      <i class="fa-solid fa-chevron-right arrow-icon" style="color: var(--color-accent);" />
    </div>
  </a>

  <!-- Botão Interativo / Div (Click Handler) -->
  <div
    v-else
    role="button"
    tabindex="0"
    :class="['vitrine-button', `card-style-${resolvedCardStyle}`, btnShapeClass, btnShadowClass]"
    :style="buttonStyleObj"
    @click="handleClick"
    @keydown.enter="handleClick"
  >
    <div class="icon-wrapper" :style="iconWrapperStyleObj">
      <img v-if="photo" :src="photo" alt="Foto" class="photo" />
      <i v-else-if="icon" :class="icon" class="icon" style="color: var(--color-accent);" />
      <i v-else class="fa-solid fa-link icon opacity-50" style="color: var(--color-accent);" />
    </div>

    <div class="button-content flex-1 min-w-0">
      <p class="button-title" style="color: var(--color-text);">{{ text }}</p>
      <span v-if="subtitle" class="button-subtitle" style="color: var(--color-text);">{{ subtitle }}</span>
    </div>

    <div v-if="showArrow" class="arrow-wrapper">
      <i class="fa-solid fa-chevron-right arrow-icon" style="color: var(--color-accent);" />
    </div>
  </div>
</template>

<style scoped>
.vitrine-button {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  text-align: left;
  padding: 0.65rem 1rem;
  border-width: 1.5px;
  border-style: solid;
  margin-bottom: 0.85rem;
  text-decoration: none;
  transition: all 0.25s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

/* Button Shapes */
.btn-shape-pill {
  border-radius: 9999px;
}

.btn-shape-rounded {
  border-radius: 1rem;
}

.btn-shape-square {
  border-radius: 0px;
}

.btn-shape-wavy {
  border-radius: 1.25rem;
  clip-path: polygon(
    0% 4px, 4% 0px, 8% 4px, 12% 0px, 16% 4px, 20% 0px, 24% 4px, 28% 0px, 32% 4px, 36% 0px, 40% 4px, 44% 0px, 48% 4px, 52% 0px, 56% 4px, 60% 0px, 64% 4px, 68% 0px, 72% 4px, 76% 0px, 80% 4px, 84% 0px, 88% 4px, 92% 0px, 96% 4px, 100% 0px,
    100% calc(100% - 4px), 96% 100%, 92% calc(100% - 4px), 88% 100%, 84% calc(100% - 4px), 80% 100%, 76% calc(100% - 4px), 72% 100%, 68% calc(100% - 4px), 64% 100%, 60% calc(100% - 4px), 56% 100%, 52% calc(100% - 4px), 48% 100%, 44% calc(100% - 4px), 40% 100%, 36% calc(100% - 4px), 32% 100%, 28% calc(100% - 4px), 24% 100%, 20% calc(100% - 4px), 16% 100%, 12% calc(100% - 4px), 8% 100%, 4% calc(100% - 4px), 0% 100%
  );
}

.btn-shape-outline {
  background: transparent !important;
}

/* Button Shadows */
.btn-shadow-none {
  box-shadow: none;
}

.btn-shadow-soft {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.btn-shadow-medium {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.btn-shadow-hard {
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.9);
}

.btn-shadow-glow {
  box-shadow: 0 0 18px rgba(99, 102, 241, 0.45);
}

/* Efeitos Especiais de Camada */
.card-style-gold-bordered,
.card-style-gradient {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.card-style-glass {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.vitrine-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.vitrine-button:hover .arrow-icon {
  transform: translateX(3px);
}

.icon-wrapper {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.icon-wrapper .icon {
  font-size: 18px;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.button-content {
  display: flex;
  flex-direction: column;
}

.button-title {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.3;
}

.button-subtitle {
  opacity: 0.75;
  font-size: 0.75rem;
  margin-top: 1px;
}

.arrow-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  font-size: 16px;
  opacity: 0.8;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
</style>
