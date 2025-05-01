<script setup>
import { ref, onMounted, computed } from 'vue'
import { useWhatsapp } from '@/composables/useWhatsapp'
import { useRoute, useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import Loading from '../ui/Loading.vue'
import Card from '../ui/Card.vue'
import Footer from '../Footer.vue'

// teste manipulação de tema
import { useThemeStore } from '../../stores/themeStore'
const themeStore = useThemeStore()

// const gradientAtivo = computed(() => themeStore.hasGradient)

const themeClass = computed(() => ({
  [`theme-${themeStore.themeName}`]: true,
  'gradient': themeStore.hasGradient
}))



const { abrirWhatsapp } = useWhatsapp()
const route = useRoute()
const router = useRouter()
const lojaStore = useLojaStore()

// const lojaId = parseInt(route.params.id)
const loja = ref(null)
const contatos = ref([])

onMounted(async () => {
  lojaStore.carregando = true
  const slug = route.params.slug

  try {
    loja.value = await lojaStore.obterLojaPublica(slug)
    
    // Carrega os contatos através da própria loja
    if (loja.value) {
      themeStore.applyTheme(loja.value.theme || 'default', loja.value.id)
      contatos.value = loja.value.contacts || []
    }
  } catch (error) {
    console.error('Erro ao carregar dados públicos da loja:', error)
  } finally {
    lojaStore.carregando = false
  }
})

// Corrija a navegação para contatos
function irParaContatos() {
  router.push(`/${route.params.slug}/contacts`) // ← Use slug ao invés de ID
}

</script>

<template>
  <section :class="[{ ...themeClass }, 'flex flex-col min-h-[100vh] flex-1']">
    <main class="flex flex-col">
      <div class="max-w-[800px] mx-auto w-full">
        <Loading v-if="lojaStore.carregando" text="Carregando vitrine da loja" class="custom-loading" />
        <div v-else-if="loja" class="storePage text-center">
          <div class="mt-6">
            <img :src="loja.logo_url" alt="Logo da loja" class="w-32 h-32 mx-auto object-contain" v-if="loja.logo_url" />
            <h1 class="title font-bold">{{ loja.name }}</h1>
          </div>
          <div class="mt-10">
            <!-- Links da loja -->
            <div class="space-y-3">
              <div v-for="(link, index) in loja.links" :key="index">
                <Card :text="link.texto" :icon="link.icone" :link="link.url"  class="w-full"/>
              </div>
            </div>
            <!-- Lista de Contatos da Loja -->
            <div v-if="contatos.length === 1" class="space-y-3 mb-2">
              <Card :text="contatos[0].name" :photo="contatos[0].photo" @click="abrirWhatsapp(contatos[0], loja?.name)" />
            </div>
            <div v-else-if="contatos.length > 1">
              <Card text="Fale com um de nossos consultores" icon="fa-solid fa-headset icon" @click="irParaContatos" />
            </div>
          </div>
        </div>
        <div v-else class="flex flex-1 items-center justify-center min-h-screen">
          <div class="text-center text-red-600 p-6 rounded shadow">
            <p class="text-sm">Loja não encontrada.</p>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </section>
</template>

<style scoped>
.store-page {
  background-color: var(--color-background);
  color: var(--color-text);
}

section {
  background: var(--color-background);
  color: var(--color-primary);
}

section.gradient {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: var(--color-primary);
}

.title {
  color: var(--color-accent);
}

.custom-loading{
  min-height: calc(100vh - 200px);
}

.custom-loading ::v-deep(.loader) {
  border: 4px solid var(--color-text);
  border-top: 4px solid var(--color-accent);
}

.custom-loading ::v-deep(.textLoader) {
  color: var(--color-accent);
}

section.gradient ::v-deep(footer) {
  color: var(--color-text);
}

section ::v-deep(footer) {
  color: var(--color-text);
}

</style>