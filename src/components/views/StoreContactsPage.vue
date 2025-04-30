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

// teste manipulação de tema
const route = useRoute()
const router = useRouter()
const slug = route.params.slug

// Stores
const contactStore = useContactStore()
const lojaStore = useLojaStore()
const themeStore = useThemeStore()


const loja = ref(null)

// Tema
const themeClass = computed(() => ({
  [`theme-${themeStore.themeName}`]: true,
  'gradient': themeStore.hasGradient
}))

// Contatos
const contatos = computed(() =>
  contactStore.contatos.filter(c => c.store_id === loja.value?.id && c.ativo)
)

// const loja = computed(() => lojaStore.lojas.find(l => l.id === lojaId))

const { abrirWhatsapp } = useWhatsapp()

onMounted(async () => {
  try {
    // Buscar loja pelo slug
    await lojaStore.obterLojaPublica(slug)
    loja.value = lojaStore.lojaSelecionada
    
    if (loja.value) {
      themeStore.applyTheme(loja.value.theme || 'default', loja.value.id)
      await contactStore.listarContatosPublicosPorLoja(loja.value.id)
    }
  } catch (error) {
    console.error('Erro ao carregar contatos:', error)
    router.push('/404')
  }
})

</script>

<template>
  <section :class="[{ ...themeClass }, 'flex flex-col min-h-[100vh] flex-1']">
    <main class="flex-col w-full">
      <div class="max-w-[800px] mx-auto w-full">
        <Loading v-if="lojaStore.carregando" text="Carregando dados da loja" class="custom-loading" />
        <div v-else class="storePage text-center">
          <div v-if="loja" class="mt-6">
            <img :src="loja.logo_url" alt="Logo da loja" class="w-32 h-32 mx-auto object-contain" />
            <h1 class="title font-bold">{{ loja.name }}</h1>
          </div>
          <div>
            <Loading v-if="contactStore.carregando" text="" />
            <div v-if="contatos.length" class="mt-10">
              <div v-for="(c, i) in contatos" :key="i" @click="abrirWhatsapp(c, loja?.name)">
                <Card :photo="c.photo" :text="c.name" />
              </div>
            </div>
            <p v-else class="text-center text-gray-500">
              Nenhum contato cadastrado para esta loja.
            </p>
          </div>
          <div class="flex justify-end mt-2" @click="router.back()">
            <p class="back px-4 py-2 mt-4 rounded-md shadow-md transition duration-200 ease-in-out">
              ← Voltar
            </p>
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
  color: var(--color-primary);
}

section.gradient {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: var(--color-primary);
}

.custom-loading{
  min-height: calc(100vh - 200px);
}

.custom-loading ::v-deep(.loader) {
  border: 4px solid var(--color-text);
  border-top: 4px solid var(--color-accent);
}

section.gradient ::v-deep(.footer) {
  color: var(--color-text);
}

.title{
  color: var(--color-accent);
}

.back{
  color: var(--color-text);
  background: var(--color-foreground);
  border: 1px solid var(--color-accent);
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.back:hover{
  transform: scale(1.01);
  box-shadow: 0 0 8px var(--color-accent);
}

section.gradient ::v-deep(footer) {
  color: var(--color-text);
}

section ::v-deep(footer) {
  color: var(--color-text);
}
</style>