import { defineStore } from 'pinia'
import api from '../services/api'

export const DEFAULT_ICON_FAMILIES = [
  {
    id: 'fontawesome-6',
    family_name: 'Font Awesome 6',
    display_name: 'Font Awesome 6 (Solid & Brands)',
    provider: 'cdnjs',
    import_url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    prefix: 'fa-solid',
    category: 'general',
    is_system: true,
    sample_icons: ['fa-heart', 'fa-star', 'fa-user', 'fa-store', 'fa-envelope', 'fa-link']
  },
  {
    id: 'bootstrap-icons',
    family_name: 'Bootstrap Icons',
    display_name: 'Bootstrap Icons (Clean & Modern)',
    provider: 'jsdelivr',
    import_url: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    prefix: 'bi',
    category: 'minimal',
    is_system: true,
    sample_icons: ['bi-heart-fill', 'bi-star-fill', 'bi-person-fill', 'bi-shop', 'bi-envelope-fill', 'bi-link-45deg']
  },
  {
    id: 'remixicon',
    family_name: 'Remix Icon',
    display_name: 'Remix Icon (Neutral & Smooth)',
    provider: 'jsdelivr',
    import_url: 'https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css',
    prefix: 'ri',
    category: 'general',
    is_system: true,
    sample_icons: ['ri-heart-3-fill', 'ri-star-fill', 'ri-user-3-fill', 'ri-store-2-fill', 'ri-mail-fill', 'ri-link']
  },
  {
    id: 'boxicons',
    family_name: 'Boxicons',
    display_name: 'Boxicons (Vector & High Quality)',
    provider: 'unpkg',
    import_url: 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
    prefix: 'bx',
    category: 'outlined',
    is_system: true,
    sample_icons: ['bxs-heart', 'bxs-star', 'bxs-user', 'bxs-store', 'bxs-envelope', 'bx-link']
  },
  {
    id: 'line-awesome',
    family_name: 'Line Awesome',
    display_name: 'Line Awesome (Minimal Line Icons)',
    provider: 'maxst',
    import_url: 'https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css',
    prefix: 'las',
    category: 'minimal',
    is_system: true,
    sample_icons: ['la-heart', 'la-star', 'la-user', 'la-store', 'la-envelope', 'la-link']
  },
  {
    id: 'material-symbols',
    family_name: 'Material Symbols',
    display_name: 'Material Symbols (Google Outlined)',
    provider: 'google',
    import_url: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0',
    prefix: 'material-symbols-outlined',
    category: 'general',
    is_system: true,
    sample_icons: ['favorite', 'grade', 'person', 'storefront', 'mail', 'link']
  }
]

export const useIconStore = defineStore('icon', {
  state: () => ({
    iconFamilies: DEFAULT_ICON_FAMILIES,
    carregando: false,
    erro: null
  }),

  actions: {
    async carregarFamilias() {
      this.carregando = true
      try {
        const { data } = await api.get('/icon-families')
        if (Array.isArray(data) && data.length > 0) {
          this.iconFamilies = data
        } else {
          this.iconFamilies = DEFAULT_ICON_FAMILIES
        }
        this.injetarFamiliasNoHead()
      } catch (err) {
        console.error('Erro ao carregar famílias de ícones:', err)
        this.iconFamilies = DEFAULT_ICON_FAMILIES
        this.injetarFamiliasNoHead()
      } finally {
        this.carregando = false
      }
    },

    injetarFamiliasNoHead() {
      if (typeof document === 'undefined') return

      this.iconFamilies.forEach(family => {
        if (!family.import_url) return
        const tagId = `icon-family-link-${family.id || family.family_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
        if (!document.getElementById(tagId)) {
          const link = document.createElement('link')
          link.id = tagId
          link.rel = 'stylesheet'
          link.href = family.import_url
          document.head.appendChild(link)
        }
      })
    },

    injetarFamiliaEspecifica(importUrl, familyId = 'temp') {
      if (!importUrl || typeof document === 'undefined') return
      let cleanUrl = importUrl
      if (importUrl.includes('href=')) {
        const match = importUrl.match(/href=["\']([^"\']+)["\']/)
        if (match) cleanUrl = match[1]
      }
      const tagId = `icon-family-link-${familyId}`
      let existing = document.getElementById(tagId)
      if (!existing) {
        const link = document.createElement('link')
        link.id = tagId
        link.rel = 'stylesheet'
        link.href = cleanUrl
        document.head.appendChild(link)
      }
    },

    async addIconFamily(payload) {
      this.carregando = true
      try {
        await api.post('/icon-families', payload)
        await this.carregarFamilias()
      } catch (err) {
        console.error('Erro ao cadastrar nova família de ícones:', err)
        throw err
      } finally {
        this.carregando = false
      }
    },

    async removeIconFamily(familyId) {
      this.carregando = true
      try {
        await api.delete(`/icon-families/${familyId}`)
        const tagId = `icon-family-link-${familyId}`
        const tag = document.getElementById(tagId)
        if (tag) tag.remove()
        await this.carregarFamilias()
      } catch (err) {
        console.error('Erro ao excluir família de ícones:', err)
        throw err
      } finally {
        this.carregando = false
      }
    }
  }
})
