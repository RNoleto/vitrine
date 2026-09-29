import { defineStore } from 'pinia'
import api from '../services/api'

export const DEFAULT_FONTS = [
  { id: 'sans', family_name: 'Inter', display_name: 'Inter (Sans-serif)', provider: 'google', import_url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap', category: 'sans-serif', is_system: true },
  { id: 'serif', family_name: 'Playfair Display', display_name: 'Playfair Display (Serif)', provider: 'google', import_url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap', category: 'serif', is_system: true },
  { id: 'cinzel', family_name: 'Cinzel', display_name: 'Cinzel (Elegante)', provider: 'google', import_url: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&display=swap', category: 'serif', is_system: true },
  { id: 'outfit', family_name: 'Outfit', display_name: 'Outfit (Modern Sans)', provider: 'google', import_url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap', category: 'sans-serif', is_system: true },
  { id: 'poppins', family_name: 'Poppins', display_name: 'Poppins (Geométrica)', provider: 'google', import_url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap', category: 'sans-serif', is_system: true },
  { id: 'montserrat', family_name: 'Montserrat', display_name: 'Montserrat (Urban Sans)', provider: 'google', import_url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap', category: 'sans-serif', is_system: true },
  { id: 'roboto', family_name: 'Roboto', display_name: 'Roboto (Standard)', provider: 'google', import_url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap', category: 'sans-serif', is_system: true },
  { id: 'cormorant-garamond', family_name: 'Cormorant Garamond', display_name: 'Cormorant Garamond (Serif Fina)', provider: 'google', import_url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap', category: 'serif', is_system: true },
  { id: 'dancing-script', family_name: 'Dancing Script', display_name: 'Dancing Script (Cursiva)', provider: 'google', import_url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&display=swap', category: 'handwriting', is_system: true },
  { id: 'space-grotesk', family_name: 'Space Grotesk', display_name: 'Space Grotesk (Tech Display)', provider: 'google', import_url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap', category: 'display', is_system: true }
]

export const useFontStore = defineStore('font', {
  state: () => ({
    fonts: DEFAULT_FONTS,
    carregando: false,
    erro: null
  }),

  actions: {
    async carregarFontes() {
      this.carregando = true;
      try {
        const { data } = await api.get('/fonts');
        if (Array.isArray(data) && data.length > 0) {
          this.fonts = data;
        } else {
          this.fonts = DEFAULT_FONTS;
        }
        this.injetarFontesNoHead();
      } catch (err) {
        console.error('Erro ao carregar fontes do servidor:', err);
        this.fonts = DEFAULT_FONTS;
        this.injetarFontesNoHead();
      } finally {
        this.carregando = false;
      }
    },

    injetarFontesNoHead() {
      if (typeof document === 'undefined') return;

      this.fonts.forEach(font => {
        if (!font.import_url) return;
        const tagId = `font-link-${font.id || font.family_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        if (!document.getElementById(tagId)) {
          const link = document.createElement('link');
          link.id = tagId;
          link.rel = 'stylesheet';
          link.href = font.import_url;
          document.head.appendChild(link);
        }
      });
    },

    async addFont(fontPayload) {
      this.carregando = true;
      try {
        await api.post('/fonts', fontPayload);
        await this.carregarFontes();
      } catch (err) {
        console.error('Erro ao cadastrar nova fonte:', err);
        throw err;
      } finally {
        this.carregando = false;
      }
    },

    async removeFont(fontId) {
      this.carregando = true;
      try {
        await api.delete(`/fonts/${fontId}`);
        const tagId = `font-link-${fontId}`;
        const tag = document.getElementById(tagId);
        if (tag) tag.remove();
        await this.carregarFontes();
      } catch (err) {
        console.error('Erro ao excluir fonte:', err);
        throw err;
      } finally {
        this.carregando = false;
      }
    }
  }
});
