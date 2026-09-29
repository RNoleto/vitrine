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
  return themeStore.currentThemeObject?.cardStyle || 'flat'
})
</script>

<template>
  <component :is="internal ? 'RouterLink' : 'a'"
    v-bind="internal ? { to: link } : { href: link, target: '_blank', rel: 'noopener noreferrer' }" 
    :class="['card', `card-style-${currentCardStyle}`]">
    <div class="icon-wrapper">
      <img v-if="photo" :src="photo" alt="Foto" class="photo" />
      <i v-else-if="icon" :class="icon" class="icon" />
      <i v-else class="fa-solid fa-link icon opacity-50" />
    </div>
    <div class="card-content flex-1 min-w-0">
      <p class="card-title">{{ text }}</p>
      <span v-if="subtitle" class="card-subtitle">{{ subtitle }}</span>
    </div>
    <div v-if="showArrow" class="arrow-wrapper">
      <i class="fa-solid fa-circle-chevron-right arrow-icon"></i>
    </div>
  </component>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: var(--color-foreground);
  text-align: left;
  padding: 0.6rem 0.85rem;
  border: 1px solid var(--color-accent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  margin-bottom: 0.85rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.25s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* Card Style Variations */
.card.card-style-gold-bordered {
  border: 1.5px solid var(--color-accent);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, var(--color-foreground), var(--color-background));
}

.card.card-style-glass {
  background: var(--color-foreground);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary);
}

.card:hover .icon-wrapper {
  background: var(--color-accent);
  color: var(--color-foreground);
  transition: background 0.3s ease;
}

.card:hover .icon {
  color: var(--color-foreground);
}

.card:hover .arrow-icon {
  color: var(--color-accent);
  transform: translateX(3px);
}

.icon-wrapper {
  width: 42px;
  height: 42px;
  min-width: 42px;
  background: var(--color-background);
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

