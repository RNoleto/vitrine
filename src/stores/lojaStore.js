import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLojaStore = defineStore('loja', () => {
  const lojas = ref([])

  function adicionarLoja(nome, logo, links = []) {
    lojas.value.push({ nome, logo, links })
  }

  function adicionarLinkParaLoja(indexLoja, novoLink){
    if(lojas.value[indexLoja]){
      lojas.value[indexLoja].links.push(novoLink)
    }
  }

  return {
    lojas,
    adicionarLoja,
    adicionarLinkParaLoja
  }
})
