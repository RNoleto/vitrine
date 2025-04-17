import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLojaStore = defineStore('loja', () => {
  const lojas = ref([])
  let proximoId = 0

  function adicionarLoja(nome, logo, links = [], contatos = []) {
    lojas.value.push({
      id: proximoId++,
      nome,
      logo,
      links,
      contatos
    })
  }

  function adicionarLinkParaLoja(id, novoLink) {
    const loja = lojas.value.find(l => l.id === id)
    if (loja) {
      loja.links.push(novoLink)
    }
  }

  function removerLoja(id) {
    lojas.value = lojas.value.filter(loja => loja.id !== id)
  }

  function editarLoja(index, dadosAtualizados) {
    if (lojas.value[index]) {
      lojas.value[index] = {
        ...lojas.value[index],
        ...dadosAtualizados
      }
    }
  }
  

  return {
    lojas,
    adicionarLoja,
    adicionarLinkParaLoja,
    removerLoja,
    editarLoja
  }
})
