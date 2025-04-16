import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLojaStore = defineStore('loja', () => {
  const lojas = ref([])

  function adicionarLoja(novaLoja) {
    if (novaLoja) {
      lojas.value.push(novaLoja)
    }
  }

  return {
    lojas,
    adicionarLoja,
  }
})
