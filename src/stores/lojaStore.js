import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLojaStore = defineStore('loja', () => {
  const lojas = ref([])

  function adicionarLoja(nome, logo) {
    lojas.value.push({ nome, logo })
  }

  return {
    lojas,
    adicionarLoja,
  }
})
