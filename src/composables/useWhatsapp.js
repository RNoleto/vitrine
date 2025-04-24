export function useWhatsapp() {
    function abrirWhatsapp(contato, nomeLoja = 'sua loja') {
      const numeroFormatado = '55' + contato.whatsapp.replace(/\D/g, '')
      const mensagem = `Olá ${contato.name}, vi a vitrine da sua loja ${nomeLoja} e gostaria de um atendimento`
      const url = `https://wa.me/${numeroFormatado}?text=${encodeURIComponent(mensagem)}`
      window.open(url, '_blank')
    }
  
    return { abrirWhatsapp }
  }