export function useSeo() {
  function updateMetaTag(property, content, attr = 'property') {
    if (!content) return
    let element = document.querySelector(`meta[${attr}="${property}"]`)
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(attr, property)
      document.head.appendChild(element)
    }
    element.setAttribute('content', content)
  }

  function setStoreSeo(store) {
    if (!store) return

    const title = `${store.name} | Vitrine Digital`
    const description = store.description || store.subtitle || store.bio || `Confira a vitrine digital de ${store.name} com links e contatos de atendimento.`
    const image = store.logo_url || store.banner_image || `${window.location.origin}/vitrine.png`
    const url = window.location.href

    // Document Title
    document.title = title

    // Standard Meta Description
    updateMetaTag('description', description, 'name')

    // OpenGraph Meta Tags
    updateMetaTag('og:title', store.name)
    updateMetaTag('og:description', description)
    updateMetaTag('og:image', image)
    updateMetaTag('og:url', url)
    updateMetaTag('og:type', 'website')
    updateMetaTag('og:site_name', 'Vitrines Digitais')

    // Twitter Card Meta Tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name')
    updateMetaTag('twitter:title', store.name, 'name')
    updateMetaTag('twitter:description', description, 'name')
    updateMetaTag('twitter:image', image, 'name')
  }

  function resetSeo() {
    document.title = 'Vitrines Digitais'
    updateMetaTag('description', 'Vitrines Digitais - Crie sua página de links e contatos de atendimento em tempo real.', 'name')
    updateMetaTag('og:title', 'Vitrines Digitais')
    updateMetaTag('og:description', 'Crie sua página de links e contatos de atendimento em tempo real.')
    updateMetaTag('og:image', `${window.location.origin}/vitrine.png`)
    updateMetaTag('og:url', window.location.origin)
    updateMetaTag('twitter:title', 'Vitrines Digitais', 'name')
    updateMetaTag('twitter:description', 'Crie sua página de links e contatos de atendimento em tempo real.', 'name')
  }

  return {
    setStoreSeo,
    resetSeo,
    updateMetaTag
  }
}
