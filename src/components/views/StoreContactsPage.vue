<script setup>
import { ref, onMounted, computed } from 'vue'
import { useWhatsapp } from '@/composables/useWhatsapp'
import { useRoute, useRouter } from 'vue-router'
import { useContactStore } from '../../stores/contactStore'
import { useLojaStore } from '../../stores/lojaStore'
import { useThemeStore } from '../../stores/themeStore'
import Loading from '../ui/Loading.vue'
import Card from '../ui/Card.vue'
import Footer from '../Footer.vue'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug

const contactStore = useContactStore()
const lojaStore = useLojaStore()
const themeStore = useThemeStore()

const loja = ref(null)

const contatos = computed(() => {
  if (!loja.value) return []
  return loja.value.contacts || []
})

const currentTheme = computed(() => {
  return themeStore.currentThemeObject
})

const avatarShapeClass = computed(() => {
  const shape = currentTheme.value?.avatarShape || currentTheme.value?.avatar_shape || 'circle'
  if (shape === 'square') return 'rounded-none'
  if (shape === 'rounded-square' || shape === 'rounded') return 'rounded-3xl'
  return 'rounded-full'
})

const { abrirWhatsapp } = useWhatsapp()

onMounted(async () => {
  try {
    await lojaStore.obterLojaPublica(slug)
    loja.value = lojaStore.lojaSelecionada
    
    if (loja.value) {
      themeStore.applyTheme(loja.value.theme || 'default', loja.value.id, true)
    }
  } catch (error) {
    console.error('Erro ao carregar contatos:', error)
    router.push('/404')
  }
})
</script>

<template>
  <section :class="[`theme-${themeStore.themeName}`, 'public-store-page flex flex-col min-h-[100vh] flex-1 relative overflow-hidden']">
    <main class="flex-col w-full relative z-10">
      <div class="max-w-[720px] mx-auto w-full px-4 pt-6 pb-10">
        <Loading v-if="lojaStore.carregando" text="Carregando dados da loja" class="custom-loading" />
        <div v-else class="storePage text-center space-y-6">
          <div v-if="loja" class="pt-4 flex flex-col items-center">
            <div class="relative mb-3">
              <img 
                v-if="loja.logo_url"
                :src="loja.logo_url" 
                alt="Logo da vitrine" 
                :class="['w-28 h-28 sm:w-32 sm:h-32 object-cover shadow-xl ring-4 ring-[var(--color-accent)]/40 transform hover:scale-105 transition-all duration-300', avatarShapeClass]" 
              />
              <div 
                v-else 
                :class="['w-28 h-28 sm:w-32 sm:h-32 bg-[var(--color-foreground)] border-2 border-[var(--color-accent)] flex items-center justify-center shadow-xl text-[var(--color-accent)] transform hover:scale-105 transition-all duration-300', avatarShapeClass]"
              >
                <i class="fa-solid fa-store text-4xl"></i>
              </div>
            </div>
            <h1 class="title font-extrabold text-2xl sm:text-3xl text-[var(--color-text)] mb-1">{{ loja.name }}</h1>
          </div>

          <div>
            <Loading v-if="contactStore.carregando" text="" />
            <div v-if="contatos.length" class="space-y-3 mt-6">
              <div v-for="(c, i) in contatos" :key="i">
                <Card 
                  :photo="c.photo" 
                  :text="c.name" 
                  subtitle="Atendimento direto via WhatsApp"
                  :show-arrow="true"
                  class="w-full shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  @click="abrirWhatsapp(c, loja?.name)" 
                />
              </div>
            </div>
            <p v-else class="text-center text-gray-500 py-6">
              Nenhum contato cadastrado para esta loja.
            </p>
          </div>

          <div class="flex justify-center pt-2">
            <button 
              @click="router.back()"
              class="back px-5 py-2.5 rounded-full font-semibold text-xs tracking-wider uppercase shadow-md transition duration-200 flex items-center gap-2"
            >
              ← Voltar para a vitrine
            </button>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </section>
</template>

<style scoped>
section {
  background: var(--color-background);
  color: var(--color-text);
  min-height: 100vh;
}

.custom-loading {
  min-height: calc(100vh - 200px);
}

.custom-loading ::v-deep(.loader) {
  border: 4px solid var(--color-text);
  border-top: 4px solid var(--color-accent);
}

.title {
  color: var(--color-text);
}

.back {
  color: var(--color-text);
  background: var(--color-foreground);
  border: 1px solid var(--color-accent);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--color-accent);
}

section ::v-deep(footer) {
  color: var(--color-text);
}
</style>