import { defineStore } from 'pinia'
import api from '../services/api'
import { useFontStore } from './fontStore'
import { useIconStore } from './iconStore'

export function getContrastColor(hexColor) {
  if (!hexColor || typeof hexColor !== 'string') return '#FFFFFF';
  let color = hexColor.trim();
  
  if (color.startsWith('rgb')) {
    const rgbValues = color.match(/\d+/g);
    if (rgbValues && rgbValues.length >= 3) {
      const r = parseInt(rgbValues[0], 10);
      const g = parseInt(rgbValues[1], 10);
      const b = parseInt(rgbValues[2], 10);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? '#1F2937' : '#FFFFFF';
    }
  }

  if (color.includes('gradient')) {
    return '#FFFFFF';
  }

  color = color.replace('#', '');
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }

  if (color.length !== 6) return '#FFFFFF';

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#1F2937' : '#FFFFFF';
}

export const PRESET_THEMES = [
  // --- TEMAS PREMIUM VIP ---
  { 
    id: 'premium-marina-editorial', 
    label: '👑 Premium Editorial (Marble Luxe)', 
    isCustom: false, 
    isPremium: true,
    category: 'premium',
    fontFamily: 'serif',
    layoutStyle: 'landing-page',
    cardStyle: 'gold-bordered',
    bgType: 'image',
    bgImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    bgAttachment: 'parallax',
    bgSize: 'cover',
    bgPosition: 'center',
    bgOverlay: { enabled: true, color: '#1f1510', opacity: 0.45, blur: 2 },
    colors: { background: '#F5EFEB', foreground: 'rgba(255, 255, 255, 0.9)', primary: '#6E4D3B', accent: '#D4AF37', text: '#2A1D16' } 
  },
  { 
    id: 'premium-advocacy-royal', 
    label: '👑 Premium Advocacy Royal Parallax', 
    isCustom: false, 
    isPremium: true,
    category: 'premium',
    fontFamily: 'cinzel',
    layoutStyle: 'portrait-hero',
    cardStyle: 'gold-bordered',
    bgType: 'image',
    bgImageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
    bgAttachment: 'fixed',
    bgSize: 'cover',
    bgPosition: 'center',
    bgOverlay: { enabled: true, color: '#091322', opacity: 0.65, blur: 3 },
    colors: { background: '#0D1B2D', foreground: 'rgba(17, 34, 57, 0.85)', primary: '#D4AF37', accent: '#F59E0B', text: '#FFFFFF' } 
  },
  { 
    id: 'premium-neon-mesh', 
    label: '👑 Premium Mesh Animated VIP', 
    isCustom: false, 
    isPremium: true,
    category: 'premium',
    fontFamily: 'sans',
    layoutStyle: 'landing-page',
    cardStyle: 'glass',
    bgType: 'animation',
    bgAnimationType: 'gradient-flow',
    colors: { background: 'linear-gradient(-45deg, #0F172A, #312E81, #581C87, #4c1d95)', foreground: 'rgba(255, 255, 255, 0.12)', primary: '#38BDF8', accent: '#F43F5E', text: '#FFFFFF' },
    backdropBlur: 14
  },
  { 
    id: 'premium-medical-pearl', 
    label: '👑 Premium Medical Pearl VIP', 
    isCustom: false, 
    isPremium: true,
    category: 'premium',
    fontFamily: 'sans',
    layoutStyle: 'portrait-hero',
    cardStyle: 'glass',
    bgType: 'solid',
    colors: { background: '#F0F9FF', foreground: '#FFFFFF', primary: '#0284C7', accent: '#0D9488', text: '#0F172A' } 
  },

  // --- TEMAS PADRÃO / SISTEMA ---
  { id: 'default', label: 'Default Minimal', isCustom: false, isPremium: false, category: 'standard', fontFamily: 'sans', layoutStyle: 'standard', cardStyle: 'flat', bgType: 'solid', colors: { background: '#FAFAFA', foreground: '#FFFFFF', primary: '#6366F1', accent: '#4F46E5', text: '#1E293B' } },
  { id: 'dark', label: 'Elegance Dark', isCustom: false, isPremium: false, category: 'dark', fontFamily: 'sans', layoutStyle: 'standard', cardStyle: 'flat', bgType: 'solid', colors: { background: '#0F172A', foreground: '#1E293B', primary: '#A855F7', accent: '#38BDF8', text: '#F8FAFC' } },
  { id: 'light', label: 'Modern Light', isCustom: false, isPremium: false, category: 'standard', fontFamily: 'sans', layoutStyle: 'standard', cardStyle: 'flat', bgType: 'solid', colors: { background: '#F8FAFC', foreground: '#FFFFFF', primary: '#3B82F6', accent: '#1D4ED8', text: '#334155' } },
  { id: 'light-gradient', label: 'Aurora Gradient', isCustom: false, isPremium: false, category: 'gradient', fontFamily: 'sans', layoutStyle: 'standard', cardStyle: 'glass', bgType: 'gradient', colors: { background: 'linear-gradient(135deg, #E0E7FF, #F3E8FF, #FCE7F3)', foreground: 'rgba(255, 255, 255, 0.75)', primary: '#4F46E5', accent: '#7C3AED', text: '#1E1B4B' } },
  { id: 'cyberpunk', label: '⚡ Cyberpunk Neon', isCustom: false, isPremium: false, category: 'dark', fontFamily: 'sans', layoutStyle: 'standard', cardStyle: 'flat', bgType: 'animation', bgAnimationType: 'floating-orbs', colors: { background: '#0B0F19', foreground: '#151D30', primary: '#00F0FF', accent: '#FF007F', text: '#F0F6FC' } },
  { id: 'emerald', label: '🌲 Emerald & Gold', isCustom: false, isPremium: false, category: 'dark', fontFamily: 'serif', layoutStyle: 'standard', cardStyle: 'gold-bordered', bgType: 'solid', colors: { background: '#062C24', foreground: '#0E4337', primary: '#10B981', accent: '#F59E0B', text: '#ECFDF5' } },
  { id: 'sunset-gradient', label: '🌅 Sunset Gradient', isCustom: false, isPremium: false, category: 'gradient', fontFamily: 'sans', layoutStyle: 'standard', cardStyle: 'glass', bgType: 'gradient', colors: { background: 'linear-gradient(135deg, #FF512F, #DD2476)', foreground: 'rgba(255, 255, 255, 0.2)', primary: '#FF512F', accent: '#FFE000', text: '#FFFFFF' } },
  { id: 'ocean-gradient', label: '🌌 Ocean Gradient', isCustom: false, isPremium: false, category: 'gradient', fontFamily: 'sans', layoutStyle: 'standard', cardStyle: 'glass', bgType: 'gradient', colors: { background: 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)', foreground: 'rgba(255, 255, 255, 0.12)', primary: '#00D2FF', accent: '#38BDF8', text: '#FFFFFF' } }
]

export const useThemeStore = defineStore('theme', {
  state: () => ({
    themeName: 'default',
    hasGradient: false,
    dbThemes: [],
    carregando: false,
    erro: null
  }),

  getters: {
    allThemes(state) {
      return state.dbThemes.length > 0 ? state.dbThemes : PRESET_THEMES
    },
    premiumThemes(state) {
      const themes = state.dbThemes.length > 0 ? state.dbThemes : PRESET_THEMES
      return themes.filter(t => t.isPremium)
    },
    standardThemes(state) {
      const themes = state.dbThemes.length > 0 ? state.dbThemes : PRESET_THEMES
      return themes.filter(t => !t.isPremium)
    },
    currentThemeObject(state) {
      const themes = state.dbThemes.length > 0 ? state.dbThemes : PRESET_THEMES
      return themes.find(t => t.id === state.themeName) || themes[0]
    }
  },

  actions: {
    async carregarTemasDoBanco() {
      this.carregando = true
      try {
        const { data } = await api.get('/themes')
        if (Array.isArray(data) && data.length > 0) {
          this.dbThemes = data.map(t => ({
            id: t.id,
            label: t.label,
            isCustom: t.is_custom !== undefined ? Boolean(t.is_custom) : false,
            isPremium: Boolean(t.is_premium),
            category: t.category || 'standard',
            fontFamily: t.font_family || 'sans',
            iconFamily: t.icon_family || 'fontawesome-6',
            layoutStyle: t.layout_style || 'standard',
            cardStyle: t.card_style || 'flat',
            bgType: t.bg_type || 'solid',
            bgImageUrl: t.bg_image_url || '',
            bgAttachment: t.bg_attachment || 'scroll',
            bgSize: t.bg_size || 'cover',
            bgPosition: t.bg_position || 'center',
            bgAnimationType: t.bg_animation_type || 'gradient-flow',
            bgOverlay: t.bg_overlay || { enabled: false, color: '#000000', opacity: 0, blur: 0 },
            colors: t.colors || { background: '#FFFFFF', foreground: '#F8FAFC', primary: '#6366F1', accent: '#4F46E5', text: '#1E293B' },
            backdropBlur: t.backdrop_blur || 0
          }))
        }
        const fontStore = useFontStore()
        const iconStore = useIconStore()
        await fontStore.carregarFontes()
        await iconStore.carregarFamilias()
        this.initDynamicCss()
      } catch (err) {
        console.error('Erro ao carregar temas do banco de dados:', err)
        this.dbThemes = PRESET_THEMES
        this.initDynamicCss()
      } finally {
        this.carregando = false
      }
    },

    initDynamicCss() {
      if (typeof document === 'undefined') return
      let styleTag = document.getElementById('dynamic-custom-themes')
      if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.id = 'dynamic-custom-themes'
        document.head.appendChild(styleTag)
      }

      let cssString = `
        @keyframes bgGradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes bgOrbPulse {
          0%, 100% { background-position: 0% 0%, 100% 100%, 0 0; }
          50% { background-position: 60% 40%, 40% 60%, 0 0; }
        }
      `

      this.allThemes.forEach(theme => {
        const bgType = theme.bgType || (theme.colors?.background?.includes('gradient') ? 'gradient' : 'solid')
        let bgCss = theme.colors?.background || '#ffffff'
        let bgAttachmentCss = theme.bgAttachment || 'scroll'
        let bgSizeCss = theme.bgSize || 'cover'
        let bgPositionCss = theme.bgPosition || 'center'
        let animCss = 'none'
        const animType = theme.bgAnimationType || 'gradient-flow'
        const duration = theme.bgAnimationDuration || (animType === 'gradient-flow' ? '12s' : '8s')

        if (bgType === 'image' && theme.bgImageUrl) {
          bgCss = `url("${theme.bgImageUrl}")`
          if (theme.bgAttachment === 'parallax' || theme.bgAttachment === 'fixed') {
            bgAttachmentCss = 'fixed'
          }
        } else if (bgType === 'animation') {
          if (animType === 'gradient-flow') {
            bgCss = (theme.colors.background && theme.colors.background.includes('gradient')) 
              ? theme.colors.background 
              : 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)'
            animCss = `bgGradientFlow ${duration} ease infinite`
          } else if (animType === 'floating-orbs') {
            bgCss = (theme.colors.background && theme.colors.background.includes('radial-gradient'))
              ? theme.colors.background
              : `radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.45) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.45) 0%, transparent 40%), ${theme.colors.background || '#0f172a'}`
            animCss = `bgOrbPulse ${duration} ease-in-out infinite`
          }
        }

        const fg = theme.colors.foreground
        const primary = theme.colors.primary
        const accent = theme.colors.accent
        const text = theme.colors.text
        const primaryText = getContrastColor(primary)
        const accentText = getContrastColor(accent)
        const solidBg = (theme.colors?.background && !theme.colors.background.includes('gradient')) 
          ? theme.colors.background 
          : '#FAFAFA'
        const blur = theme.backdropBlur ? `blur(${theme.backdropBlur}px)` : 'none'

        let fontCss = 'inherit'
        const fontStore = useFontStore()
        if (theme.fontFamily === 'serif') fontCss = "'Playfair Display', serif"
        else if (theme.fontFamily === 'cinzel') fontCss = "'Cinzel', serif"
        else if (theme.fontFamily === 'sans') fontCss = "'Inter', sans-serif"
        else if (theme.fontFamily) {
          const fontObj = fontStore.fonts.find(f => f.id === theme.fontFamily || f.family_name.toLowerCase() === theme.fontFamily.toLowerCase())
          if (fontObj) {
            fontCss = `'${fontObj.family_name}', ${fontObj.category || 'sans-serif'}`
          } else {
            fontCss = `'${theme.fontFamily}', sans-serif`
          }
        }

        const overlayEnabled = theme.bgOverlay?.enabled || (theme.bgOverlayOpacity > 0)
        const overlayColor = theme.bgOverlay?.color || theme.bgOverlayColor || '#000000'
        const overlayOpacity = theme.bgOverlay?.opacity ?? theme.bgOverlayOpacity ?? 0
        const overlayBlur = theme.bgOverlay?.blur ?? theme.bgOverlayBlur ?? 0

        // Injeção de variáveis isoladas
        cssString += `
        .theme-${theme.id}, [data-theme="${theme.id}"] {
          --color-background: ${bgType === 'solid' ? theme.colors.background : 'transparent'};
          --color-background-solid: ${solidBg};
          --color-foreground: ${fg};
          --color-primary: ${primary};
          --color-primary-text: ${primaryText};
          --color-accent: ${accent};
          --color-accent-text: ${accentText};
          --color-text: ${text};
          --backdrop-blur: ${blur};
          font-family: ${fontCss};
        }

        /* Estilos de fundo aplicados EXCLUSIVAMENTE nas paginas publicas de vitrine */
        .public-store-page.theme-${theme.id}, body.public-store-body.theme-${theme.id} {
          background-image: ${bgType === 'image' ? bgCss : (bgType === 'animation' || bgType === 'gradient' ? bgCss : 'none')} !important;
          background-color: ${bgType === 'solid' ? theme.colors.background : '#FAFAFA'} !important;
          background-attachment: ${bgAttachmentCss} !important;
          background-size: ${bgType === 'animation' && animType === 'gradient-flow' ? '400% 400%' : (bgType === 'animation' && animType === 'floating-orbs' ? '180% 180%, 180% 180%, 100% 100%' : bgSizeCss)} !important;
          ${bgType === 'animation' ? '' : `background-position: ${bgPositionCss} !important;`}
          animation: ${animCss} !important;
          position: relative;
        }\n`

        if (overlayEnabled && overlayOpacity > 0) {
          cssString += `
          .public-store-page.theme-${theme.id}::before, body.public-store-body.theme-${theme.id}::before {
            content: '';
            position: fixed;
            inset: 0;
            background-color: ${overlayColor};
            opacity: ${overlayOpacity};
            backdrop-filter: ${overlayBlur > 0 ? `blur(${overlayBlur}px)` : 'none'};
            pointer-events: none;
            z-index: 0;
          }\n`
        }
      })

      styleTag.textContent = cssString
    },

    async addCustomTheme(themeObj) {
      this.carregando = true
      try {
        const payload = {
          id: themeObj.id,
          label: themeObj.label,
          is_premium: themeObj.isPremium !== undefined ? themeObj.isPremium : true,
          category: themeObj.category || 'premium',
          font_family: themeObj.fontFamily || 'serif',
          icon_family: themeObj.iconFamily || themeObj.icon_family || 'fontawesome-6',
          layout_style: themeObj.layoutStyle || 'portrait-hero',
          card_style: themeObj.cardStyle || 'gold-bordered',
          bg_type: themeObj.bgType || 'solid',
          bg_image_url: themeObj.bgImageUrl || null,
          bg_attachment: themeObj.bgAttachment || 'scroll',
          bg_size: themeObj.bgSize || 'cover',
          bg_position: themeObj.bgPosition || 'center',
          bg_animation_type: themeObj.bgAnimationType || null,
          bg_overlay: themeObj.bgOverlay || { enabled: false, color: '#000000', opacity: 0, blur: 0 },
          colors: themeObj.colors,
          backdrop_blur: themeObj.backdropBlur || 0
        }

        const existingTheme = this.allThemes.find(t => t.id === themeObj.id)
        if (existingTheme) {
          await api.put(`/themes/${themeObj.id}`, payload)
        } else {
          await api.post('/themes', payload)
        }

        await this.carregarTemasDoBanco()
      } catch (err) {
        console.error('Erro ao salvar tema no banco de dados:', err)
        throw err
      } finally {
        this.carregando = false
      }
    },

    async removeCustomTheme(themeId) {
      return this.removeTheme(themeId)
    },

    async removeTheme(themeId) {
      this.carregando = true
      try {
        await api.delete(`/themes/${themeId}`)
        await this.carregarTemasDoBanco()
      } catch (err) {
        console.error('Erro ao excluir tema do banco de dados:', err)
        throw err
      } finally {
        this.carregando = false
      }
    },

    clearBodyTheme() {
      if (typeof document === 'undefined') return
      document.body.classList.remove('public-store-body', ...this.getThemeClasses())
    },

    applyTheme(themeName, lojaId, applyToBody = false) {
      this.initDynamicCss()
      this.themeName = themeName || 'default';
      this.hasGradient = themeName ? themeName.includes('gradient') : false;

      // Limpa temas do body por padrão para isolar a Dashboard
      this.clearBodyTheme()
      
      // Aplica no document.body SOMENTE se for uma página pública externa (StorePage)
      if (applyToBody && typeof document !== 'undefined') {
        document.body.classList.add('public-store-body', `theme-${this.themeName}`);
      }

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
      this.applyTheme(savedTheme, lojaId, false);
    },

    // Helper para gerar o objeto de estilo inline para o mockup de celular no Admin/Dashboard
    getThemePreviewStyle(theme) {
      if (!theme) return {}
      const bgType = theme.bgType || (theme.colors?.background?.includes('gradient') ? 'gradient' : 'solid')
      
      const fontStore = useFontStore()
      let fontFamilyCss = "'Inter', sans-serif"
      if (theme.fontFamily === 'serif') fontFamilyCss = "'Playfair Display', serif"
      else if (theme.fontFamily === 'cinzel') fontFamilyCss = "'Cinzel', serif"
      else if (theme.fontFamily === 'sans') fontFamilyCss = "'Inter', sans-serif"
      else if (theme.fontFamily) {
        const fontObj = fontStore.fonts.find(f => f.id === theme.fontFamily || f.family_name.toLowerCase() === theme.fontFamily.toLowerCase())
        if (fontObj) fontFamilyCss = `'${fontObj.family_name}', ${fontObj.category || 'sans-serif'}`
        else fontFamilyCss = `'${theme.fontFamily}', sans-serif`
      }

      let styleObj = {
        color: theme.colors?.text || '#000000',
        fontFamily: fontFamilyCss
      }

      if (bgType === 'image' && theme.bgImageUrl) {
        styleObj.backgroundImage = `url("${theme.bgImageUrl}")`
        styleObj.backgroundSize = theme.bgSize || 'cover'
        styleObj.backgroundPosition = theme.bgPosition || 'center'
        styleObj.backgroundAttachment = 'scroll'
      } else if (bgType === 'animation') {
        const animType = theme.bgAnimationType || 'gradient-flow'
        if (animType === 'gradient-flow') {
          styleObj.backgroundImage = theme.colors?.background || 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)'
          styleObj.backgroundSize = '400% 400%'
          styleObj.animation = 'bgGradientFlow 12s ease infinite'
        } else if (animType === 'floating-orbs') {
          styleObj.backgroundImage = `radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.45) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.45) 0%, transparent 40%), ${theme.colors?.background || '#0f172a'}`
          styleObj.animation = 'bgOrbPulse 8s ease-in-out infinite'
        }
      } else {
        styleObj.background = theme.colors?.background || '#FAFAFA'
      }

      return styleObj
    }
  }
});
