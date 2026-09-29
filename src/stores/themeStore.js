import { defineStore } from 'pinia'

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
    customThemes: JSON.parse(localStorage.getItem('custom_vitrine_themes') || '[]'),
  }),

  getters: {
    allThemes(state) {
      return [...PRESET_THEMES, ...state.customThemes]
    },
    premiumThemes(state) {
      return [...PRESET_THEMES, ...state.customThemes].filter(t => t.isPremium)
    },
    standardThemes(state) {
      return [...PRESET_THEMES, ...state.customThemes].filter(t => !t.isPremium)
    },
    currentThemeObject(state) {
      return [...PRESET_THEMES, ...state.customThemes].find(t => t.id === state.themeName) || PRESET_THEMES[0]
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

      let cssString = `
        @keyframes bgGradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes bgOrbPulse {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.8; }
          50% { transform: scale(1.2) translateY(-20px); opacity: 1; }
        }
      `

      this.allThemes.forEach(theme => {
        const bgType = theme.bgType || (theme.colors?.background?.includes('gradient') ? 'gradient' : 'solid')
        let bgCss = theme.colors.background || '#ffffff'
        let bgAttachmentCss = theme.bgAttachment || 'scroll'
        let bgSizeCss = theme.bgSize || 'cover'
        let bgPositionCss = theme.bgPosition || 'center'
        let animCss = 'none'

        if (bgType === 'image' && theme.bgImageUrl) {
          bgCss = `url("${theme.bgImageUrl}")`
          if (theme.bgAttachment === 'parallax' || theme.bgAttachment === 'fixed') {
            bgAttachmentCss = 'fixed'
          }
        } else if (bgType === 'animation') {
          const animType = theme.bgAnimationType || 'gradient-flow'
          if (animType === 'gradient-flow') {
            bgCss = (theme.colors.background && theme.colors.background.includes('gradient')) 
              ? theme.colors.background 
              : 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)'
            animCss = 'bgGradientFlow 12s ease infinite'
          } else if (animType === 'floating-orbs') {
            bgCss = `radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.45) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.45) 0%, transparent 40%), ${theme.colors.background || '#0f172a'}`
            animCss = 'bgOrbPulse 8s ease-in-out infinite'
          }
        }

        const fg = theme.colors.foreground
        const primary = theme.colors.primary
        const accent = theme.colors.accent
        const text = theme.colors.text
        const blur = theme.backdropBlur ? `blur(${theme.backdropBlur}px)` : 'none'

        let fontCss = 'inherit'
        if (theme.fontFamily === 'serif') fontCss = "'Playfair Display', serif"
        else if (theme.fontFamily === 'cinzel') fontCss = "'Cinzel', serif"
        else if (theme.fontFamily === 'sans') fontCss = "'Inter', sans-serif"

        const overlayEnabled = theme.bgOverlay?.enabled || (theme.bgOverlayOpacity > 0)
        const overlayColor = theme.bgOverlay?.color || theme.bgOverlayColor || '#000000'
        const overlayOpacity = theme.bgOverlay?.opacity ?? theme.bgOverlayOpacity ?? 0
        const overlayBlur = theme.bgOverlay?.blur ?? theme.bgOverlayBlur ?? 0

        cssString += `
        .theme-${theme.id}, [data-theme="${theme.id}"] {
          --color-background: ${bgType === 'solid' ? theme.colors.background : 'transparent'};
          --color-foreground: ${fg};
          --color-primary: ${primary};
          --color-accent: ${accent};
          --color-text: ${text};
          --backdrop-blur: ${blur};
          font-family: ${fontCss};
        }

        body.theme-${theme.id} {
          background-image: ${bgType === 'image' ? bgCss : (bgType === 'animation' || bgType === 'gradient' ? bgCss : 'none')} !important;
          background-color: ${bgType === 'solid' ? theme.colors.background : 'transparent'} !important;
          background-attachment: ${bgAttachmentCss} !important;
          background-size: ${bgType === 'animation' && theme.bgAnimationType === 'gradient-flow' ? '400% 400%' : bgSizeCss} !important;
          background-position: ${bgPositionCss} !important;
          animation: ${animCss} !important;
        }\n`

        if (overlayEnabled && overlayOpacity > 0) {
          cssString += `
          body.theme-${theme.id}::before {
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

    addCustomTheme(themeObj) {
      const existingIndex = this.customThemes.findIndex(t => t.id === themeObj.id)
      const formattedTheme = {
        ...themeObj,
        isCustom: true,
        isPremium: themeObj.isPremium !== undefined ? themeObj.isPremium : true,
        category: themeObj.category || 'premium',
        fontFamily: themeObj.fontFamily || 'serif',
        layoutStyle: themeObj.layoutStyle || 'portrait-hero',
        cardStyle: themeObj.cardStyle || 'gold-bordered',
        bgType: themeObj.bgType || 'solid',
        bgImageUrl: themeObj.bgImageUrl || '',
        bgAttachment: themeObj.bgAttachment || 'scroll',
        bgSize: themeObj.bgSize || 'cover',
        bgPosition: themeObj.bgPosition || 'center',
        bgAnimationType: themeObj.bgAnimationType || 'gradient-flow',
        bgOverlay: themeObj.bgOverlay || { enabled: false, color: '#000000', opacity: 0, blur: 0 }
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
    },

    // Helper para gerar o objeto de estilo inline para o mockup de celular
    getThemePreviewStyle(theme) {
      if (!theme) return {}
      const bgType = theme.bgType || (theme.colors?.background?.includes('gradient') ? 'gradient' : 'solid')
      
      let styleObj = {
        color: theme.colors?.text || '#000000',
        fontFamily: theme.fontFamily === 'serif' ? "'Playfair Display', serif" : theme.fontFamily === 'cinzel' ? "'Cinzel', serif" : "'Inter', sans-serif"
      }

      if (bgType === 'image' && theme.bgImageUrl) {
        styleObj.backgroundImage = `url("${theme.bgImageUrl}")`
        styleObj.backgroundSize = theme.bgSize || 'cover'
        styleObj.backgroundPosition = theme.bgPosition || 'center'
        styleObj.backgroundAttachment = theme.bgAttachment === 'parallax' || theme.bgAttachment === 'fixed' ? 'fixed' : 'scroll'
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
