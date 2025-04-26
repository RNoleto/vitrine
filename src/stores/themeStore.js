import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'light',
  }),
  getters: {
    themeName: (state) => state.theme.replace('.gradient', ''),
    hasGradient: (state) => state.theme.includes('gradient'),
  },
  actions: {
    setTheme(newTheme) {
      this.theme = newTheme
      localStorage.setItem('theme', newTheme)
      document.body.setAttribute('data-theme', newTheme)
    },
    toggleGradient() {
      if (this.theme.includes('gradient')) {
        this.theme = this.theme.replace('.gradient', '')
      } else {
        this.theme = `${this.theme}.gradient`
      }
      localStorage.setItem('theme', this.theme)
      document.body.setAttribute('data-theme', this.theme)
    },
  },
})
