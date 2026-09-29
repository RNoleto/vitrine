<template>
  <section :class="[`theme-${themeStore.themeName}`, 'public-store-page flex flex-col min-h-[100vh] flex-1 relative overflow-hidden']">
    <main class="flex flex-col flex-1 pb-10 relative z-10">
      <div class="max-w-[720px] mx-auto w-full px-4 pt-6">
        <Loading v-if="lojaStore.carregando" text="Carregando vitrine..." class="custom-loading" />

        <!-- --- LAYOUT PREMIUM (PORTRAIT / LANDING PAGE) --- -->
        <div v-else-if="loja && isPremiumLayout" class="storePage-premium space-y-8 animate-fade-in">
          
          <!-- Hero Header Portrait -->
          <div class="premium-hero-card text-center p-8 rounded-3xl relative overflow-hidden shadow-xl border border-[var(--color-accent)]">
            <div class="relative z-10 flex flex-col items-center">
              <div class="relative mb-4">
                <img 
                  :src="loja.logo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'" 
                  alt="Foto de perfil" 
                  class="w-36 h-36 rounded-2xl object-cover shadow-2xl ring-4 ring-[var(--color-accent)] transform hover:scale-105 transition-all duration-300" 
                />
                <span class="absolute -bottom-2 -right-2 bg-[var(--color-accent)] text-[var(--color-background)] w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                  <i class="fa-solid fa-check text-xs"></i>
                </span>
              </div>
              
              <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-[var(--color-text)]">
                {{ loja.name }}
              </h1>
              <p class="text-sm font-medium opacity-90 max-w-md mx-auto leading-relaxed text-[var(--color-text)]">
                {{ loja.description || 'Atendimento exclusivo, estratégias personalizadas e excelência para transformar seus resultados.' }}
              </p>
            </div>
          </div>

          <!-- Store Links Section -->
          <div class="space-y-3">
            <h2 class="text-xs uppercase tracking-widest font-bold opacity-60 text-center mb-4 text-[var(--color-text)]">
              ✨ Serviços & Links em Destaque
            </h2>
            <div v-for="(link, index) in loja.links" :key="index">
              <Card 
                :text="link.texto" 
                :icon="link.icone" 
                :show-arrow="true"
                class="w-full shadow-sm hover:shadow-md transition-all duration-300" 
                @click="handleClickLink(link)"
              />
            </div>

            <!-- Contacts Cards -->
            <div v-if="contatos.length === 1" class="pt-1">
              <Card 
                :text="contatos[0].name" 
                :photo="contatos[0].photo" 
                subtitle="Atendimento direto via WhatsApp"
                :show-arrow="true"
                @click="handleClickContact(contatos[0])" 
              />
            </div>
            <div v-else-if="contatos.length > 1" class="pt-1">
              <Card 
                text="Fale com a nossa equipe de especialistas" 
                icon="fa-solid fa-headset" 
                subtitle="Equipe disponível para atendimento"
                :show-arrow="true"
                @click="irParaContatos" 
              />
            </div>
          </div>

          <!-- Section "Sobre mim / Quem sou eu" -->
          <div class="premium-about-card p-6 sm:p-8 rounded-2xl border border-[var(--color-accent)] bg-[var(--color-foreground)] shadow-lg space-y-3">
            <h3 class="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
              <i class="fa-solid fa-user-check text-base text-[var(--color-accent)]"></i>
              Sobre mim
            </h3>
            <p class="text-sm leading-relaxed opacity-85 text-[var(--color-text)] whitespace-pre-line">
              {{ displayBio }}
            </p>
            <div class="pt-2">
              <button @click="irParaContatos" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-[var(--color-background)] font-medium text-xs tracking-wider uppercase shadow-md hover:opacity-90 transition-all">
                Minha abordagem <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- Social Proof Counter Cards -->
          <div v-if="displayMetrics.length" class="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--color-foreground)] border border-[var(--color-accent)] shadow-md text-center">
            <div 
              v-for="(metric, mIdx) in displayMetrics.slice(0, 3)" 
              :key="mIdx"
              :class="['space-y-1', mIdx === 1 ? 'border-x border-[var(--color-accent)]/30 px-2' : '']"
            >
              <div class="text-xl sm:text-2xl font-black text-[var(--color-primary)]">{{ metric.value }}</div>
              <div class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider opacity-75 text-[var(--color-text)]">{{ metric.label }}</div>
            </div>
          </div>

          <!-- FAQ Accordion Block -->
          <div v-if="activeFaqs.length" class="premium-faq-card p-6 sm:p-8 rounded-2xl border border-[var(--color-accent)] bg-[var(--color-foreground)] shadow-lg space-y-4">
            <h3 class="text-xl font-bold text-[var(--color-text)] flex items-center gap-2 mb-2">
              <i class="fa-solid fa-circle-question text-base text-[var(--color-accent)]"></i>
              Dúvidas frequentes
            </h3>

            <div class="space-y-3">
              <div 
                v-for="(faq, fIdx) in activeFaqs" 
                :key="fIdx"
                class="border-b border-[var(--color-accent)]/20 pb-3"
              >
                <button 
                  @click="faq.open = !faq.open"
                  class="w-full flex items-center justify-between text-left font-semibold text-sm text-[var(--color-text)] focus:outline-none"
                >
                  <span>{{ faq.question }}</span>
                  <i :class="['fa-solid transition-transform duration-200 text-xs text-[var(--color-accent)]', faq.open ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                </button>
                <p v-if="faq.open" class="text-xs opacity-80 mt-2 leading-relaxed text-[var(--color-text)] pl-1 whitespace-pre-line">
                  {{ faq.answer }}
                </p>
              </div>
            </div>
          </div>

          <!-- Bottom Call to Action Footer -->
          <div class="text-center py-6 space-y-4">
            <h4 class="text-lg font-bold text-[var(--color-text)]">
              Vamos criar algo incrível juntos? ♥
            </h4>
            <p class="text-xs opacity-75 text-[var(--color-text)]">
              Acompanhe minhas atualizações e novidades nas redes sociais
            </p>
            <div class="flex items-center justify-center gap-4 text-lg">
              <a href="#" class="w-10 h-10 rounded-full border border-[var(--color-accent)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-background)] transition-all">
                <i class="fa-brands fa-instagram"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full border border-[var(--color-accent)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-background)] transition-all">
                <i class="fa-brands fa-whatsapp"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full border border-[var(--color-accent)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-background)] transition-all">
                <i class="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full border border-[var(--color-accent)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-background)] transition-all">
                <i class="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>

        </div>

        <!-- --- LAYOUT STANDARD MINIMAL --- -->
        <div v-else-if="loja" class="storePage text-center animate-fade-in">
          <div class="mt-6">
            <img :src="loja.logo_url" alt="Logo da loja" class="w-32 h-32 mx-auto object-contain shadow-sm rounded-full" v-if="loja.logo_url" />
            <h1 class="title text-2xl font-bold mt-4">{{ loja.name }}</h1>
            <p v-if="loja.description" class="text-sm opacity-80 mt-1 max-w-md mx-auto">{{ loja.description }}</p>
          </div>
          <div class="mt-8 space-y-3">
            <!-- Links da loja -->
            <div v-for="(link, index) in loja.links" :key="index">
              <Card :text="link.texto" :icon="link.icone" class="w-full" @click="handleClickLink(link)"/>
            </div>
            <!-- Lista de Contatos da Loja -->
            <div v-if="contatos.length === 1" class="space-y-3 mb-2">
              <Card :text="contatos[0].name" :photo="contatos[0].photo" @click="handleClickContact(contatos[0])" />
            </div>
            <div v-else-if="contatos.length > 1">
              <Card text="Fale com um de nossos consultores" icon="fa-solid fa-headset" @click="irParaContatos" />
            </div>
          </div>
        </div>

        <!-- Loja Não Encontrada -->
        <div v-else class="flex flex-1 items-center justify-center min-h-[60vh]">
          <div class="text-center p-6 rounded shadow border border-red-200 bg-red-50 text-red-600">
            <i class="fa-solid fa-store-slash text-3xl mb-2"></i>
            <p class="text-sm font-medium">Vitrine não encontrada ou inativa.</p>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useWhatsapp } from '@/composables/useWhatsapp'
import { useRoute, useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import { useThemeStore } from '../../stores/themeStore'
import Loading from '../ui/Loading.vue'
import Card from '../ui/Card.vue'
import Footer from '../Footer.vue'

const themeStore = useThemeStore()
const { abrirWhatsapp } = useWhatsapp()
const route = useRoute()
const router = useRouter()
const lojaStore = useLojaStore()

const loja = ref(null)
const contatos = ref([])
const activeFaqs = ref([])

// Dynamic FAQs para a Landing Page (fallback)
const defaultFaqs = [
  { question: 'Como funciona o atendimento presencial ou online?', answer: 'Realizamos consultorias personalizadas tanto de forma 100% remota com flexibilidade de horários quanto presencialmente com agendamento prévio.', open: false },
  { question: 'Quais são as etapas do acompanhamento?', answer: 'Iniciamos com um diagnóstico inicial detalhado, mapeamento de necessidades e estruturação de um plano estratégico contínuo.', open: false },
  { question: 'Como faço para tirar dúvidas antes de contratar?', answer: 'Basta clicar no botão de atendimento pelo WhatsApp ou selecionar um dos nossos consultores para falar diretamente conosco.', open: false }
]

const displayBio = computed(() => {
  return loja.value?.bio || 'Especialista dedicada a oferecer soluções sob medida para cada cliente. Com foco em segurança, estratégia e atenção aos detalhes, ajudo você a alcançar seus objetivos com agilidade e clareza.'
})

const displayMetrics = computed(() => {
  if (loja.value?.metrics && Array.isArray(loja.value.metrics) && loja.value.metrics.length > 0) {
    return loja.value.metrics
  }
  return [
    { value: '+500', label: 'Clientes' },
    { value: '8 ANOS', label: 'Experiência' },
    { value: '95%', label: 'Satisfação' }
  ]
})

const currentTheme = computed(() => themeStore.currentThemeObject)

const isPremiumLayout = computed(() => {
  if (!currentTheme.value) return false
  return currentTheme.value.isPremium || ['portrait-hero', 'landing-page'].includes(currentTheme.value.layoutStyle)
})

onMounted(async () => {
  lojaStore.carregando = true
  const slug = route.params.slug

  try {
    loja.value = await lojaStore.obterLojaPublica(slug)
    
    if (loja.value) {
      themeStore.applyTheme(loja.value.theme || 'default', loja.value.id, true)
      contatos.value = loja.value.contacts || []

      if (loja.value.faqs && Array.isArray(loja.value.faqs) && loja.value.faqs.length > 0) {
        activeFaqs.value = loja.value.faqs.map(f => ({ ...f, open: false }))
      } else {
        activeFaqs.value = defaultFaqs.map(f => ({ ...f }))
      }

      await lojaStore.registrarVisita(slug)
    }
  } catch (error) {
    console.error('Erro ao carregar dados públicos da loja:', error)
  } finally {
    lojaStore.carregando = false
  }
})

onUnmounted(() => {
  themeStore.clearBodyTheme()
})

function irParaContatos() {
  router.push(`/${route.params.slug}/contacts`)
}

function handleClickLink(link){
  if(link.id){
    lojaStore.registrarCliqueLink(link.id)
  }

  window.open(link.url, '_blank')
}

function handleClickContact(contato){
  if(contato.id){
    lojaStore.registrarCliqueContato(contato.id)
  }

  if(contato.whatsapp){
    abrirWhatsapp(contato)
  }
}
</script>

<style scoped>
section {
  color: var(--color-text);
  min-height: 100vh;
}

.premium-hero-card {
  background: linear-gradient(145deg, var(--color-foreground), var(--color-background));
}

.title {
  color: var(--color-text);
}

.custom-loading {
  min-height: calc(100vh - 200px);
}

.custom-loading ::v-deep(.loader) {
  border: 4px solid var(--color-text);
  border-top: 4px solid var(--color-accent);
}

.custom-loading ::v-deep(.textLoader) {
  color: var(--color-accent);
}

section ::v-deep(footer) {
  color: var(--color-text);
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>