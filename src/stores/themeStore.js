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
  {
    id: 'artemis',
    label: 'Artemis (Sage & Quince)',
    isCustom: false,
    isPremium: true,
    category: 'premium',
    fontFamily: 'inter',
    iconFamily: 'fontawesome-6',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'pill',
    btnShadow: 'none',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'solid',
    colors: { background: '#4A5844', foreground: '#D5D4CD', primary: '#2D3929', accent: '#4A5844', text: '#2D3929' },
    elements: { subtitle: 'Your daily dose of vitamin C', banner_image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop' }
  },
  {
    id: 'balcombe',
    label: 'Balcombe (Solar & Pool)',
    isCustom: false,
    isPremium: true,
    category: 'premium',
    fontFamily: 'outfit',
    iconFamily: 'fontawesome-6',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'pill',
    btnShadow: 'medium',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'image',
    bgImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    bgAttachment: 'parallax',
    bgSize: 'cover',
    bgPosition: 'center',
    colors: { background: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop")', foreground: '#FFFFFF', primary: '#0F172A', accent: '#38BDF8', text: '#0F172A' },
    elements: { subtitle: 'an innovative solar design practice bringing energy to daily life.' }
  },
  {
    id: 'boulton',
    label: 'Boulton (Warm Terracotta)',
    isCustom: false,
    isPremium: true,
    category: 'premium',
    fontFamily: 'montserrat',
    iconFamily: 'fontawesome-6',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'rounded',
    btnShadow: 'none',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'image',
    bgImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    bgAttachment: 'parallax',
    bgSize: 'cover',
    bgPosition: 'center',
    colors: { background: 'url("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop")', foreground: '#EAA07A', primary: '#2D231E', accent: '#EAA07A', text: '#FFFFFF' },
    elements: { subtitle: 'Aspiring skater with a taste for cooking.' }
  },
  {
    id: 'bourke',
    label: 'Bourke (Electric Track Wavy)',
    isCustom: false,
    isPremium: true,
    category: 'premium',
    fontFamily: 'poppins',
    iconFamily: 'bootstrap-icons',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'wavy',
    btnShadow: 'hard',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'image',
    bgImageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop',
    bgAttachment: 'parallax',
    bgSize: 'cover',
    bgPosition: 'center',
    colors: { background: 'url("https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop")', foreground: '#FFFFFF', primary: '#1E3A8A', accent: '#2563EB', text: '#1E293B' },
    elements: { subtitle: 'Long Distance Runner & Athletic Fitness' }
  },
  {
    id: 'constance',
    label: 'Constance (Skate Urban)',
    isCustom: false,
    isPremium: false,
    category: 'standard',
    fontFamily: 'outfit',
    iconFamily: 'remixicon',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'rounded',
    btnShadow: 'soft',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'image',
    bgImageUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?q=80&w=1200&auto=format&fit=crop',
    bgAttachment: 'scroll',
    bgSize: 'cover',
    bgPosition: 'center',
    colors: { background: 'url("https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?q=80&w=1200&auto=format&fit=crop")', foreground: '#FFFFFF', primary: '#000000', accent: '#64748B', text: '#0F172A' },
    elements: { subtitle: 'Brand Ambassador for Helix, based in SoCal.' }
  },
  {
    id: 'coromandel',
    label: 'Coromandel (Macaron Wavy)',
    isCustom: false,
    isPremium: true,
    category: 'premium',
    fontFamily: 'playfair-display',
    iconFamily: 'fontawesome-6',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'wavy',
    btnShadow: 'soft',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'image',
    bgImageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=1200&auto=format&fit=crop',
    bgAttachment: 'parallax',
    bgSize: 'cover',
    bgPosition: 'center',
    colors: { background: 'url("https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=1200&auto=format&fit=crop")', foreground: '#FFF8F0', primary: '#8B1E0F', accent: '#C2410C', text: '#8B1E0F' },
    elements: { subtitle: 'Plant-based bakery & artisanal tea salon' }
  },
  {
    id: 'hanna',
    label: 'Hanna (Vinyl Beats)',
    isCustom: false,
    isPremium: false,
    category: 'standard',
    fontFamily: 'inter',
    iconFamily: 'fontawesome-6',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'pill',
    btnShadow: 'soft',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'image',
    bgImageUrl: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?q=80&w=1200&auto=format&fit=crop',
    bgAttachment: 'scroll',
    bgSize: 'cover',
    bgPosition: 'center',
    colors: { background: 'url("https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?q=80&w=1200&auto=format&fit=crop")', foreground: '#FFFFFF', primary: '#1E293B', accent: '#475569', text: '#0F172A' },
    elements: { subtitle: 'Soul beats and mech from Hackney' }
  },
  {
    id: 'hay',
    label: 'Hay (Court Blue Sectioned)',
    isCustom: false,
    isPremium: true,
    category: 'premium',
    fontFamily: 'outfit',
    iconFamily: 'boxicons',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'pill',
    btnShadow: 'soft',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'solid',
    colors: { background: '#0088CC', foreground: '#FFFFFF', primary: '#004466', accent: '#38BDF8', text: '#004466' },
    elements: { subtitle: "Augsburg University Men's Basketball Team" }
  },
  {
    id: 'healeys',
    label: 'Healeys (Neon Cyber Tokyo)',
    isCustom: false,
    isPremium: true,
    category: 'premium',
    fontFamily: 'space-grotesk',
    iconFamily: 'fontawesome-6',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'rounded',
    btnShadow: 'glow',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'image',
    bgImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    bgAttachment: 'parallax',
    bgSize: 'cover',
    bgPosition: 'center',
    colors: { background: 'url("https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop")', foreground: '#E07A5F', primary: '#3D405B', accent: '#F4F1DE', text: '#FFFFFF' },
    elements: { subtitle: 'Mixing the old with the new in Harajuku' }
  },
  {
    id: 'heape',
    label: 'Heape (Monstera Leaf)',
    isCustom: false,
    isPremium: false,
    category: 'standard',
    fontFamily: 'playfair-display',
    iconFamily: 'fontawesome-6',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'square',
    btnShadow: 'none',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'solid',
    colors: { background: '#2D6A4F', foreground: '#FFFFFF', primary: '#1B4332', accent: '#52B788', text: '#1B4332' },
    elements: { subtitle: 'Blending the science of horticulture with the art of design' }
  },
  {
    id: 'heffernan',
    label: 'Heffernan (Line Art Outline)',
    isCustom: false,
    isPremium: true,
    category: 'premium',
    fontFamily: 'outfit',
    iconFamily: 'line-awesome',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'outline',
    btnShadow: 'none',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'solid',
    colors: { background: '#F8FAFC', foreground: 'rgba(99, 102, 241, 0.05)', primary: '#4F46E5', accent: '#6366F1', text: '#4F46E5' },
    elements: { subtitle: 'Portfolio reviews, interview tips, and career advice' }
  },
  {
    id: 'iris',
    label: 'Iris (Soft Pastel Gradient)',
    isCustom: false,
    isPremium: false,
    category: 'standard',
    fontFamily: 'poppins',
    iconFamily: 'bootstrap-icons',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'rounded',
    btnShadow: 'medium',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'gradient',
    colors: { background: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)', foreground: '#FFFFFF', primary: '#3B82F6', accent: '#8B5CF6', text: '#1E293B' },
    elements: { subtitle: 'Solar design practice bringing solar energy into daily life.' }
  },
  {
    id: 'louden',
    label: 'Louden (Warm Nude & Beauty)',
    isCustom: false,
    isPremium: true,
    category: 'premium',
    fontFamily: 'outfit',
    iconFamily: 'fontawesome-6',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'pill',
    btnShadow: 'soft',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'image',
    bgImageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',
    bgAttachment: 'parallax',
    bgSize: 'cover',
    bgPosition: 'center',
    colors: { background: 'url("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop")', foreground: '#F3E8DE', primary: '#8C6D58', accent: '#D4A373', text: '#5C4033' },
    elements: { subtitle: 'Makeup | Skin | Entrepreneur', banner_image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop' }
  },
  {
    id: 'merlin',
    label: 'Merlin (Sunburst Mesh Gradient)',
    isCustom: false,
    isPremium: true,
    category: 'premium',
    fontFamily: 'inter',
    iconFamily: 'remixicon',
    layoutStyle: 'portrait-hero',
    cardStyle: 'flat',
    btnShape: 'rounded',
    btnShadow: 'medium',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'gradient',
    colors: { background: 'linear-gradient(180deg, #F87171 0%, #FBBF24 50%, #60A5FA 100%)', foreground: '#FFFFFF', primary: '#1E293B', accent: '#F59E0B', text: '#0F172A' },
    elements: { subtitle: 'Giving clothing a second life' }
  },
  {
    id: 'merlin-biz',
    label: 'Merlin Biz (Dark Espresso Glass)',
    isCustom: false,
    isPremium: true,
    category: 'premium',
    fontFamily: 'inter',
    iconFamily: 'fontawesome-6',
    layoutStyle: 'portrait-hero',
    cardStyle: 'glass',
    btnShape: 'pill',
    btnShadow: 'soft',
    avatarShape: 'circle',
    showSocialFooter: true,
    socialStyle: 'minimal',
    bgType: 'image',
    bgImageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
    bgAttachment: 'parallax',
    bgSize: 'cover',
    bgPosition: 'center',
    colors: { background: 'url("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop")', foreground: 'rgba(255, 255, 255, 0.85)', primary: '#1A0F0A', accent: '#D4AF37', text: '#1A0F0A' },
    elements: { subtitle: 'Coffee roasters, brewers and lovers' }
  }
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
            btnShape: t.btn_shape || 'pill',
            btnShadow: t.btn_shadow || 'soft',
            avatarShape: t.avatar_shape || 'circle',
            showSocialFooter: t.show_social_footer !== undefined ? Boolean(t.show_social_footer) : true,
            socialStyle: t.social_style || 'minimal',
            elements: t.elements || null,
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
          btn_shape: themeObj.btnShape || themeObj.btn_shape || 'pill',
          btn_shadow: themeObj.btnShadow || themeObj.btn_shadow || 'soft',
          avatar_shape: themeObj.avatarShape || themeObj.avatar_shape || 'circle',
          show_social_footer: themeObj.showSocialFooter !== undefined ? themeObj.showSocialFooter : true,
          social_style: themeObj.socialStyle || themeObj.social_style || 'minimal',
          elements: themeObj.elements || null,
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
