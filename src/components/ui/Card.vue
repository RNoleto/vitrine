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
  }
});

const themeStore = useThemeStore()

const currentCardStyle = computed(() => {
  if (props.cardStyle) return props.cardStyle
  const theme = themeStore.currentThemeObject
  const blur = theme?.backdropBlur !== undefined ? Number(theme.backdropBlur) : (theme?.backdrop_blur !== undefined ? Number(theme.backdrop_blur) : 0)
  const style = theme?.cardStyle || theme?.card_style || 'flat'
  if (style === 'glass' || blur > 0) return 'glass'
  return style
})

const currentBlur = computed(() => {
  const theme = themeStore.currentThemeObject
  const blur = theme?.backdropBlur !== undefined ? Number(theme.backdropBlur) : (theme?.backdrop_blur !== undefined ? Number(theme.backdrop_blur) : 0)
  return blur > 0 ? blur : 12
})

const btnShapeClass = computed(() => {
  const shape = themeStore.currentThemeObject?.btnShape || themeStore.currentThemeObject?.btn_shape || 'pill'
  return `btn-shape-${shape}`
})

const btnShadowClass = computed(() => {
  const shadow = themeStore.currentThemeObject?.btnShadow || themeStore.currentThemeObject?.btn_shadow || 'soft'
  return `btn-shadow-${shadow}`
})

const cardStyleObj = computed(() => {
  const shape = themeStore.currentThemeObject?.btnShape || themeStore.currentThemeObject?.btn_shape || 'pill'
  const isOutline = shape === 'outline'
  const isGlass = currentCardStyle.value === 'glass'
  const isGradient = currentCardStyle.value === 'gold-bordered' || currentCardStyle.value === 'gradient'

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
    filter = `blur(${currentBlur.value}px)`
  }

  return {
    background: bg,
    borderColor: border,
    color: 'var(--color-text)',
    backdropFilter: filter,
    WebkitBackdropFilter: filter
  }
})

const iconWrapperStyleObj = computed(() => {
  const isGlass = currentCardStyle.value === 'glass'

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
</script>

<template>
  <component :is="internal ? 'RouterLink' : 'a'"
    v-bind="internal ? { to: link } : { href: link, target: '_blank', rel: 'noopener noreferrer' }" 
    :class="['card', `card-style-${currentCardStyle}`, btnShapeClass, btnShadowClass]"
    :style="cardStyleObj">
    <div class="icon-wrapper" :style="iconWrapperStyleObj">
      <img v-if="photo" :src="photo" alt="Foto" class="photo" />
      <i v-else-if="icon" :class="icon" class="icon" style="color: var(--color-accent);" />
      <i v-else class="fa-solid fa-link icon opacity-50" style="color: var(--color-accent);" />
    </div>
    <div class="card-content flex-1 min-w-0">
      <p class="card-title" style="color: var(--color-text);">{{ text }}</p>
      <span v-if="subtitle" class="card-subtitle" style="color: var(--color-text);">{{ subtitle }}</span>
    </div>
    <div v-if="showArrow" class="arrow-wrapper">
      <i class="fa-solid fa-chevron-right arrow-icon" style="color: var(--color-accent);"></i>
    </div>
  </component>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  text-align: left;
  padding: 0.65rem 1rem;
  border-width: 1.5px;
  border-style: solid;
  border-radius: 9999px;
  margin-bottom: 0.85rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.25s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* Button Shapes */
.card.btn-shape-pill {
  border-radius: 9999px !important;
}

.card.btn-shape-rounded {
  border-radius: 1rem !important;
}

.card.btn-shape-square {
  border-radius: 0px !important;
}

.card.btn-shape-wavy {
  border-radius: 1.25rem !important;
  clip-path: polygon(
    0% 4px, 4% 0px, 8% 4px, 12% 0px, 16% 4px, 20% 0px, 24% 4px, 28% 0px, 32% 4px, 36% 0px, 40% 4px, 44% 0px, 48% 4px, 52% 0px, 56% 4px, 60% 0px, 64% 4px, 68% 0px, 72% 4px, 76% 0px, 80% 4px, 84% 0px, 88% 4px, 92% 0px, 96% 4px, 100% 0px,
    100% calc(100% - 4px), 96% 100%, 92% calc(100% - 4px), 88% 100%, 84% calc(100% - 4px), 80% 100%, 76% calc(100% - 4px), 72% 100%, 68% calc(100% - 4px), 64% 100%, 60% calc(100% - 4px), 56% 100%, 52% calc(100% - 4px), 48% 100%, 44% calc(100% - 4px), 40% 100%, 36% calc(100% - 4px), 32% 100%, 28% calc(100% - 4px), 24% 100%, 20% calc(100% - 4px), 16% 100%, 12% calc(100% - 4px), 8% 100%, 4% calc(100% - 4px), 0% 100%
  ) !important;
}

.card.btn-shape-outline {
  background: transparent !important;
  border: 2px solid var(--color-primary) !important;
}

/* Button Shadows */
.card.btn-shadow-none {
  box-shadow: none !important;
}

.card.btn-shadow-soft {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08) !important;
}

.card.btn-shadow-medium {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
}

.card.btn-shadow-hard {
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.9) !important;
}

.card.btn-shadow-glow {
  box-shadow: 0 0 18px rgba(99, 102, 241, 0.45) !important;
}

/* Card Style Variations */
/* 1. Cor Sólida (Flat / Solid) */
.card.card-style-flat, .card.card-style-solid {
  background: var(--color-foreground) !important;
  border: 1.5px solid var(--color-accent) !important;
}

/* 2. Gradiente Nobre (Gold Bordered / Gradient) */
.card.card-style-gold-bordered, .card.card-style-gradient {
  border: 1.5px solid var(--color-accent) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
  background: linear-gradient(135deg, var(--color-foreground), var(--color-background)) !important;
}

/* 3. Vidro Translúcido (Glassmorphism) */
.card.card-style-glass {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.card.card-style-gold-bordered .icon-wrapper,
.card.card-style-gradient .icon-wrapper,
.card.card-style-flat .icon-wrapper,
.card.card-style-solid .icon-wrapper {
  background: var(--color-background-solid, var(--color-background)) !important;
  border: 1px solid var(--color-accent) !important;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary);
}

.card:hover .icon-wrapper {
  background: var(--color-accent);
  color: var(--color-accent-text);
  transition: background 0.3s ease;
}

.card:hover .icon {
  color: var(--color-accent-text);
}

.card:hover .arrow-icon {
  color: var(--color-accent);
  transform: translateX(3px);
}

.icon-wrapper {
  width: 42px;
  height: 42px;
  min-width: 42px;
  background: var(--color-background-solid, var(--color-background));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.icon-wrapper .icon {
  font-size: 18px;
  color: var(--color-accent);
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-title {
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.3;
}

.card-subtitle {
  color: var(--color-text);
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
  color: var(--color-accent);
  opacity: 0.8;
  transition: transform 0.2s ease, color 0.2s ease;
}
</style>

