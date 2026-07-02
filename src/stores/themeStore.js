import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    themeName: 'default',
    hasGradient: false,
    themes: { }
  }),
  actions: {
    applyTheme(themeName, lojaId) {
      this.themeName = themeName;
      this.hasGradient = themeName ? themeName.includes('gradient') : false;

      // Remove todos os temas anteriores
      document.body.classList.remove(...this.getThemeClasses());
      
      // Aplica novo tema
      document.body.classList.add(`theme-${themeName}`);
      localStorage.setItem(`theme_${lojaId}`, themeName);
    },

    getThemeClasses() {
      return Array.from(document.body.classList).filter(className => 
        className.startsWith('theme-')
      );
    },

    initTheme(lojaId) {
      const savedTheme = localStorage.getItem(`theme_${lojaId}`) || 'default';
      this.applyTheme(savedTheme, lojaId);
    }
  }
});
