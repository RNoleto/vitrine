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
                  v-if="loja.logo_url"
                  :src="loja.logo_url" 
                  alt="Logo da vitrine" 
                  :class="['w-36 h-36 object-cover shadow-2xl ring-4 ring-[var(--color-accent)] transform hover:scale-105 transition-all duration-300', avatarShapeClass]" 
                />
                <div 
                  v-else 
                  :class="['w-36 h-36 bg-[var(--color-foreground)] border-2 border-[var(--color-accent)] flex items-center justify-center shadow-2xl ring-4 ring-[var(--color-accent)]/30 text-[var(--color-accent)] transform hover:scale-105 transition-all duration-300', avatarShapeClass]"
                >
                  <i class="fa-solid fa-store text-5xl"></i>
                </div>
                <span class="absolute -bottom-2 -right-2 bg-[var(--color-accent)] text-[var(--color-accent-text)] w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                  <i class="fa-solid fa-check text-xs"></i>
                </span>
              </div>
              
              <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-[var(--color-text)]">
                {{ loja.name }}
              </h1>
              <p v-if="themeSubtitle" class="text-sm font-medium opacity-90 max-w-md mx-auto leading-relaxed text-[var(--color-text)]">
                {{ themeSubtitle }}
              </p>
            </div>
          </div>

          <!-- Store Links Section -->
          <div v-if="loja.links && loja.links.length" class="space-y-3">
            <h2 class="text-xs uppercase tracking-widest font-bold opacity-60 text-center mb-4 text-[var(--color-text)]">
              ✨ Links em Destaque
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

          <!-- Section "Sobre mim / Quem sou eu" -->
          <div v-if="loja.bio && loja.bio.trim()" class="premium-about-card p-6 sm:p-8 rounded-2xl border border-[var(--color-accent)] bg-[var(--color-foreground)] shadow-lg space-y-3">
            <h3 class="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
              <i class="fa-solid fa-user-check text-base text-[var(--color-accent)]"></i>
              Sobre mim
            </h3>
            <p class="text-sm leading-relaxed opacity-85 text-[var(--color-text)] whitespace-pre-line">
              {{ loja.bio }}
            </p>
            <div v-if="contatos.length" class="pt-2">
              <button @click="irParaContatos" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-text)] font-semibold text-xs tracking-wider uppercase shadow-md hover:opacity-90 transition-all">
                Fazer contato <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- Social Proof Counter Cards -->
          <div v-if="loja.metrics && loja.metrics.length" class="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--color-foreground)] border border-[var(--color-accent)] shadow-md text-center">
            <div 
              v-for="(metric, mIdx) in loja.metrics.slice(0, 3)" 
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

          <!-- Banner / Imagem de Destaque do Tema -->
          <div v-if="themeBannerImage" class="rounded-2xl overflow-hidden shadow-lg border border-[var(--color-accent)] my-4">
            <img :src="themeBannerImage" alt="Imagem em destaque" class="w-full h-48 sm:h-60 object-cover hover:scale-105 transition-transform duration-500" />
          </div>

          <!-- Bottom Call to Action Footer -->
          <div v-if="socialLinks.length && socialFooterVisible" class="text-center py-6 space-y-4">
            <h4 class="text-base sm:text-lg font-bold text-[var(--color-text)]">
              Acompanhe nas redes sociais
            </h4>
            <div class="flex items-center justify-center flex-wrap gap-4 text-lg">
              <a 
                v-for="(sLink, sIdx) in socialLinks" 
                :key="sIdx"
                :href="sLink.url"
                target="_blank"
                rel="noopener noreferrer"
                :title="sLink.label"
                class="w-10 h-10 rounded-full border border-[var(--color-accent)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-text)] transition-all shadow-sm hover:scale-105"
              >
                <i :class="sLink.icon"></i>
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

const socialLinks = computed(() => {
  if (!loja.value) return []
  const links = []

  if (Array.isArray(loja.value.links)) {
    loja.value.links.forEach(l => {
      if (!l.url) return
      const icon = (l.icone || '').toLowerCase()
      const url = l.url.toLowerCase()
      let brandIcon = null

      if (icon.includes('instagram') || url.includes('instagram.com')) brandIcon = 'fa-brands fa-instagram'
      else if (icon.includes('whatsapp') || url.includes('wa.me') || url.includes('whatsapp.com')) brandIcon = 'fa-brands fa-whatsapp'
      else if (icon.includes('linkedin') || url.includes('linkedin.com')) brandIcon = 'fa-brands fa-linkedin-in'
      else if (icon.includes('youtube') || url.includes('youtube.com') || url.includes('youtu.be')) brandIcon = 'fa-brands fa-youtube'
      else if (icon.includes('facebook') || url.includes('facebook.com')) brandIcon = 'fa-brands fa-facebook-f'
      else if (icon.includes('twitter') || icon.includes('x-twitter') || url.includes('twitter.com') || url.includes('x.com')) brandIcon = 'fa-brands fa-x-twitter'
      else if (icon.includes('tiktok') || url.includes('tiktok.com')) brandIcon = 'fa-brands fa-tiktok'
      else if (icon.includes('github') || url.includes('github.com')) brandIcon = 'fa-brands fa-github'
      else if (icon.includes('globe') || icon.includes('website') || icon.includes('site')) brandIcon = 'fa-solid fa-globe'

      if (brandIcon) {
        links.push({
          url: l.url,
          icon: brandIcon,
          label: l.texto || 'Rede social'
        })
      }
    })
  }

  if (Array.isArray(contatos.value)) {
    contatos.value.forEach(c => {
      if (c.whatsapp) {
        const waNum = c.whatsapp.replace(/\D/g, '')
        const waUrl = `https://wa.me/${waNum}`
        if (!links.some(item => item.url.includes(waNum) || item.url.includes('wa.me'))) {
          links.push({
            url: waUrl,
            icon: 'fa-brands fa-whatsapp',
            label: c.name || 'WhatsApp'
          })
        }
      }
    })
  }

  return links
})

const currentTheme = computed(() => themeStore.currentThemeObject)

const avatarShapeClass = computed(() => {
  const shape = currentTheme.value?.avatarShape || currentTheme.value?.avatar_shape || 'circle'
  if (shape === 'square') return 'rounded-none'
  if (shape === 'rounded-square') return 'rounded-3xl'
  return 'rounded-full'
})

const socialFooterVisible = computed(() => {
  if (!currentTheme.value) return true
  return currentTheme.value.showSocialFooter !== false && currentTheme.value.show_social_footer !== false
})

const themeBannerImage = computed(() => {
  return currentTheme.value?.elements?.banner_image || null
})

const themeSubtitle = computed(() => {
  return loja.value?.description || currentTheme.value?.elements?.subtitle || null
})

const isPremiumLayout = computed(() => {
  if (!currentTheme.value) return false
  return currentTheme.value.isPremium || ['portrait-hero', 'landing-page'].includes(currentTheme.value.layoutStyle)
})

onMounted(async () => {
  lojaStore.carregando = true
  const slug = route.params.slug

  try {
    await themeStore.carregarTemasDoBanco()
    loja.value = await lojaStore.obterLojaPublica(slug)
    
    if (loja.value) {
      themeStore.applyTheme(loja.value.theme || 'default', loja.value.id, true)
      contatos.value = loja.value.contacts || []

      if (loja.value.faqs && Array.isArray(loja.value.faqs) && loja.value.faqs.length > 0) {
        activeFaqs.value = loja.value.faqs.map(f => ({ ...f, open: false }))
      } else {
        activeFaqs.value = []
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