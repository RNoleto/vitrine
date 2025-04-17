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

  function removerLoja(id) {
    lojas.value = lojas.value.filter(loja => loja.id !== id)
  }

  function atualizarLoja(id, dadosAtualizados) {
    lojas.value[id] = { ...lojas.value[id], ...dadosAtualizados }
  }

  return {
    lojas,
    adicionarLoja,
    adicionarLinkParaLoja,
    removerLoja,
    atualizarLoja
  }
})
