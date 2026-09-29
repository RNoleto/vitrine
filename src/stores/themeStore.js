import { defineStore } from 'pinia'

export const PRESET_THEMES = [
  { id: 'default', label: 'Default Minimal', isCustom: false, colors: { background: '#FAFAFA', foreground: '#FFFFFF', primary: '#6366F1', accent: '#4F46E5', text: '#1E293B' } },
  { id: 'dark', label: 'Elegance Dark', isCustom: false, colors: { background: '#0F172A', foreground: '#1E293B', primary: '#A855F7', accent: '#38BDF8', text: '#F8FAFC' } },
  { id: 'light', label: 'Modern Light', isCustom: false, colors: { background: '#F8FAFC', foreground: '#FFFFFF', primary: '#3B82F6', accent: '#1D4ED8', text: '#334155' } },
  { id: 'pastel', label: 'Pastel Dreams', isCustom: false, colors: { background: '#FDF2F8', foreground: '#FCE7F3', primary: '#EC4899', accent: '#D946EF', text: '#701A75' } },
  { id: 'aqua', label: 'Cyan Aqua', isCustom: false, colors: { background: '#E0F2FE', foreground: '#F0F9FF', primary: '#06B6D4', accent: '#0891B2', text: '#164E63' } },
  { id: 'light-gradient', label: 'Aurora Gradient', isCustom: false, colors: { background: 'linear-gradient(135deg, #E0E7FF, #F3E8FF, #FCE7F3)', foreground: 'rgba(255, 255, 255, 0.75)', primary: '#4F46E5', accent: '#7C3AED', text: '#1E1B4B' } },
  { id: 'cyberpunk', label: '⚡ Cyberpunk Neon', isCustom: false, colors: { background: '#0B0F19', foreground: '#151D30', primary: '#00F0FF', accent: '#FF007F', text: '#F0F6FC' } },
  { id: 'emerald', label: '🌲 Emerald & Gold', isCustom: false, colors: { background: '#062C24', foreground: '#0E4337', primary: '#10B981', accent: '#F59E0B', text: '#ECFDF5' } },
  { id: 'sunset-gradient', label: '🌅 Sunset Gradient', isCustom: false, colors: { background: 'linear-gradient(135deg, #FF512F, #DD2476)', foreground: 'rgba(255, 255, 255, 0.2)', primary: '#FF512F', accent: '#FFE000', text: '#FFFFFF' } },
  { id: 'ocean-gradient', label: '🌌 Ocean Gradient', isCustom: false, colors: { background: 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)', foreground: 'rgba(255, 255, 255, 0.12)', primary: '#00D2FF', accent: '#38BDF8', text: '#FFFFFF' } },
  { id: 'midnight-purple', label: '👑 Royal Midnight', isCustom: false, colors: { background: '#130924', foreground: '#21103C', primary: '#8B5CF6', accent: '#D8B4FE', text: '#F5F3FF' } },
  { id: 'rose-gold', label: '🌸 Rose Gold', isCustom: false, colors: { background: '#FFF1F2', foreground: '#FFE4E6', primary: '#E11D48', accent: '#EA580C', text: '#881337' } }
]

export const useThemeStore = defineStore('theme', {
  state: () => ({
    themeName: 'default',
    hasGradient: false,
    customThemes: JSON.parse(localStorage.getItem('custom_vitrine_themes') || '[]'),
  }),

  getters: {
    allThemes(state) {
      return [...PRESET_THEMES, ...state.customThemes]
    }
  },

  actions: {
    initDynamicCss() {
      if (typeof document === 'undefined') return
      let styleTag = document.getElementById('dynamic-custom-themes')
      if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.id = 'dynamic-custom-themes'
        document.head.appendChild(styleTag)
      }

      let cssString = ''
      this.customThemes.forEach(theme => {
        const bg = theme.colors.background
        const fg = theme.colors.foreground
        const primary = theme.colors.primary
        const accent = theme.colors.accent
        const text = theme.colors.text
        const blur = theme.backdropBlur ? `blur(${theme.backdropBlur}px)` : 'none'

        cssString += `
        .theme-${theme.id}, [data-theme="${theme.id}"] {
          --color-background: ${bg};
          --color-foreground: ${fg};
          --color-primary: ${primary};
          --color-accent: ${accent};
          --color-text: ${text};
          --backdrop-blur: ${blur};
        }\n`
      })

      styleTag.textContent = cssString
    },

    addCustomTheme(themeObj) {
      // themeObj: { id, label, colors: { background, foreground, primary, accent, text }, backdropBlur }
      const existingIndex = this.customThemes.findIndex(t => t.id === themeObj.id)
      const formattedTheme = {
        ...themeObj,
        isCustom: true,
      }

      if (existingIndex !== -1) {
        this.customThemes[existingIndex] = formattedTheme
      } else {
        this.customThemes.push(formattedTheme)
      }

      localStorage.setItem('custom_vitrine_themes', JSON.stringify(this.customThemes))
      this.initDynamicCss()
    },

    removeCustomTheme(themeId) {
      this.customThemes = this.customThemes.filter(t => t.id !== themeId)
      localStorage.setItem('custom_vitrine_themes', JSON.stringify(this.customThemes))
      this.initDynamicCss()
    },

    applyTheme(themeName, lojaId) {
      this.initDynamicCss()
      this.themeName = themeName || 'default';
      this.hasGradient = themeName ? themeName.includes('gradient') : false;

      // Remove todos os temas anteriores
      document.body.classList.remove(...this.getThemeClasses());
      
      // Aplica novo tema
      document.body.classList.add(`theme-${this.themeName}`);
      if (lojaId) {
        localStorage.setItem(`theme_${lojaId}`, this.themeName);
      }
    },

    getThemeClasses() {
      return Array.from(document.body.classList).filter(className => 
        className.startsWith('theme-')
      );
    },

    initTheme(lojaId) {
      this.initDynamicCss()
      const savedTheme = localStorage.getItem(`theme_${lojaId}`) || 'default';
      this.applyTheme(savedTheme, lojaId);
    }
  }
});
