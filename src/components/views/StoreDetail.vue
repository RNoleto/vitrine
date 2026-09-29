<template>
  <div class="max-w-7xl mx-auto pb-12">
    <Loading v-if="lojaStore.carregando" text="Carregando detalhes da vitrine..." />
    <div v-else-if="loja" class="space-y-6">
      
      <!-- Top Bar & Compact Header -->
      <div class="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4 text-center sm:text-left">
          <img 
            :src="loja.logo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'" 
            alt="Logo" 
            class="w-14 h-14 rounded-xl object-cover shadow-sm ring-2 ring-indigo-50" 
          />
          <div>
            <div class="flex items-center justify-center sm:justify-start gap-2">
              <h1 class="text-xl font-bold text-gray-900 leading-tight">{{ loja.name }}</h1>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Ativa</span>
              <span v-if="activeThemeObj?.isPremium" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                <i class="fa-solid fa-crown text-[9px]"></i> Premium
              </span>
            </div>
            <p class="text-xs text-gray-500 truncate max-w-sm mt-0.5">{{ loja.description || 'Vitrine Digital com Links & Contatos' }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <a :href="longUrl" target="_blank" class="flex-1 sm:flex-initial px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Ver Pública
          </a>
          <button @click="back" class="flex-1 sm:flex-initial px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-arrow-left"></i> Voltar
          </button>
        </div>
      </div>

      <!-- MAIN 2-COLUMN GRID (TABS + SIDE STICKY MOCKUP) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- LEFT COLUMN: TABS NAVIGATION & EDITOR (7 Cols) -->
        <div class="lg:col-span-7 xl:col-span-7 space-y-4">
          
          <!-- Main Tabs Navigation Bar -->
          <div class="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap sm:flex-nowrap gap-1">
            <button 
              v-for="tNav in mainNavigationTabs" 
              :key="tNav.id"
              @click="activeMainTab = tNav.id"
              :class="[
                'flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap',
                activeMainTab === tNav.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              ]"
            >
              <i :class="tNav.icon"></i>
              <span>{{ tNav.label }}</span>
            </button>
          </div>

          <!-- TAB 1: TEMAS & APARÊNCIA -->
          <div v-show="activeMainTab === 'theme'" class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5 animate-fade-in">
            <div class="border-b pb-3">
              <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-palette text-indigo-600"></i> Escolher Tema Visual
              </h3>
              <p class="text-xs text-gray-500">Selecione um estilo visual e layouts nobres para sua vitrine</p>
            </div>

            <!-- Filtros por Categoria de Temas -->
            <div class="flex flex-wrap gap-1.5">
              <button 
                v-for="tab in filterTabs" 
                :key="tab.id"
                @click="selectedCategoryTab = tab.id"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1',
                  selectedCategoryTab === tab.id 
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                ]"
              >
                <span>{{ tab.label }}</span>
              </button>
            </div>

            <!-- Dropdown Select -->
            <div class="space-y-2">
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-600">Tema Selecionado:</label>
              <select 
                v-model="selectedTheme" 
                @change="handleThemeChange" 
                class="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
              >
                <option value="" disabled>Escolha um tema visual...</option>
                
                <optgroup v-if="filteredThemes.some(t => t.isPremium)" label="👑 TEMAS PREMIUM VIP (Layouts Especiais)">
                  <option v-for="t in filteredThemes.filter(t => t.isPremium)" :key="t.id" :value="t.id">
                    👑 {{ t.label }}
                  </option>
                </optgroup>

                <optgroup v-if="filteredThemes.some(t => !t.isPremium && (t.category === 'gradient' || t.colors?.background?.includes('gradient')))" label="🎨 TEMAS GRADIENTE">
                  <option v-for="t in filteredThemes.filter(t => !t.isPremium && (t.category === 'gradient' || t.colors?.background?.includes('gradient')))" :key="t.id" :value="t.id">
                    🎨 {{ t.label }}
                  </option>
                </optgroup>

                <optgroup v-if="filteredThemes.some(t => !t.isPremium && t.category !== 'gradient')" label="⚡ TEMAS PADRÃO DO SISTEMA">
                  <option v-for="t in filteredThemes.filter(t => !t.isPremium && t.category !== 'gradient')" :key="t.id" :value="t.id">
                    ⚡ {{ t.label }}
                  </option>
                </optgroup>
              </select>
            </div>

            <!-- Ações do Tema -->
            <div class="flex flex-col sm:flex-row gap-2 pt-2">
              <button 
                @click="aplicarTema" 
                :disabled="salvandoTema"
                class="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <i v-if="salvandoTema" class="fa-solid fa-circle-notch fa-spin"></i>
                <i v-else class="fa-solid fa-check"></i>
                <span>{{ salvandoTema ? 'Aplicando Tema...' : 'Aplicar este Tema à Vitrine' }}</span>
              </button>

              <button 
                v-if="isPreview"
                @click="cancelarPreview" 
                class="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
              >
                Restaurar
              </button>
            </div>
          </div>

          <!-- TAB 2: CONTEÚDO PERSONALIZADO (PREMIUM) -->
          <div v-show="activeMainTab === 'content'" class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5 animate-fade-in">
            <div class="border-b pb-3">
              <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-pen-to-square text-indigo-600"></i> Conteúdo Personalizado (Premium)
              </h3>
              <p class="text-xs text-gray-500">Edite a biografia, as métricas e as perguntas frequentes exibidas nos temas VIP</p>
            </div>

            <!-- 1. Biografia / Sobre mim -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <i class="fa-solid fa-user-check text-indigo-500"></i> Biografia ("Sobre Mim"):
                </label>
                <span class="text-[10px] text-gray-400">{{ formBio.length }}/3000</span>
              </div>
              <textarea 
                v-model="formBio" 
                rows="3" 
                placeholder="Escreva uma breve apresentação profissional..." 
                class="w-full p-2.5 border border-gray-300 rounded-xl text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              ></textarea>
            </div>

            <!-- 2. Métricas / Prova Social -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-gray-700">
                <i class="fa-solid fa-chart-line text-indigo-500 mr-1"></i> 3 Destaques Numéricos (Métricas):
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div v-for="(metric, mIdx) in formMetrics" :key="mIdx" class="p-2.5 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
                  <span class="text-[10px] font-bold text-indigo-600 block">Destaque #{{ mIdx + 1 }}</span>
                  <input 
                    v-model="metric.value" 
                    placeholder="Ex: +500" 
                    class="w-full p-1.5 border border-gray-300 rounded-lg text-xs font-bold bg-white"
                  />
                  <input 
                    v-model="metric.label" 
                    placeholder="Ex: Clientes" 
                    class="w-full p-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            <!-- 3. Perguntas Frequentes (FAQ) -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-gray-700">
                  <i class="fa-solid fa-circle-question text-indigo-500 mr-1"></i> Dúvidas Frequentes (FAQ):
                </label>
                <button 
                  @click="adicionarFaq" 
                  class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1"
                >
                  <i class="fa-solid fa-plus text-[9px]"></i> Adicionar
                </button>
              </div>

              <div v-if="formFaqs.length === 0" class="p-3 border border-dashed border-gray-200 rounded-xl text-center text-xs text-gray-400">
                Nenhuma pergunta cadastrada.
              </div>

              <div v-else class="space-y-2 max-h-60 overflow-y-auto pr-1">
                <div v-for="(faq, fIdx) in formFaqs" :key="fIdx" class="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5 relative">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-indigo-600">Pergunta #{{ fIdx + 1 }}</span>
                    <button @click="removerFaq(fIdx)" class="text-red-500 hover:text-red-700 text-[11px] font-medium flex items-center gap-1">
                      <i class="fa-solid fa-trash-can text-[9px]"></i> Remover
                    </button>
                  </div>
                  <input 
                    v-model="faq.question" 
                    placeholder="Pergunta (ex: Como agendar?)" 
                    class="w-full p-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white"
                  />
                  <textarea 
                    v-model="faq.answer" 
                    rows="2" 
                    placeholder="Resposta..." 
                    class="w-full p-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Botão Salvar Conteúdo -->
            <div class="pt-2">
              <button 
                @click="salvarConteudoCustomizado" 
                :disabled="salvandoConteudo"
                class="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <i v-if="salvandoConteudo" class="fa-solid fa-circle-notch fa-spin"></i>
                <i v-else class="fa-solid fa-floppy-disk"></i>
                <span>{{ salvandoConteudo ? 'Salvando...' : 'Salvar Conteúdo Personalizado' }}</span>
              </button>
            </div>
          </div>

          <!-- TAB 3: LINKS & CONTATOS -->
          <div v-show="activeMainTab === 'links'" class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 animate-fade-in">
            <!-- Links Cadastrados -->
            <div class="space-y-3">
              <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-link text-indigo-600"></i> Links da Vitrine ({{ loja.links ? loja.links.length : 0 }})
              </h3>
              <div v-if="loja.links && loja.links.length" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="(link, i) in loja.links" :key="i" class="flex items-center gap-2.5 p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <i :class="link.icone"></i>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-bold text-gray-800 truncate">{{ link.texto }}</p>
                    <a :href="link.url" target="_blank" class="text-[10px] text-indigo-600 hover:underline truncate block">
                      {{ link.url }}
                    </a>
                  </div>
                </div>
              </div>
              <p v-else class="text-xs text-gray-400 italic">Nenhum link cadastrado.</p>
            </div>

            <!-- Contatos Vinculados -->
            <div class="pt-4 border-t space-y-3">
              <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-headset text-indigo-600"></i> Contatos Vinculados ({{ contatosDaLoja.length }})
              </h3>
              <div v-if="contatosDaLoja.length" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="contato in contatosDaLoja" :key="contato.id" class="flex items-center gap-2.5 p-2.5 border border-gray-200 rounded-xl bg-gray-50">
                  <img :src="contato.photo || 'https://via.placeholder.com/40'" alt="Foto" class="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200" />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-bold text-gray-800 truncate">{{ contato.name }}</p>
                    <p class="text-[10px] text-gray-500 truncate"><i class="fa-brands fa-whatsapp text-emerald-600 mr-1"></i>{{ contato.whatsapp }}</p>
                  </div>
                </div>
              </div>
              <p v-else class="text-xs text-gray-400 italic">Nenhum contato vinculado.</p>
            </div>
          </div>

          <!-- TAB 4: COMPARTILHAR & QR CODE -->
          <div v-show="activeMainTab === 'share'" class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5 animate-fade-in">
            <div class="border-b pb-3">
              <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-share-nodes text-indigo-600"></i> Divulgação & QR Code
              </h3>
              <p class="text-xs text-gray-500">Copie o link direto ou baixe a imagem do QR Code para impressão</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-2">
              <input :value="shortUrl || longUrl" readonly class="flex-1 border border-gray-200 bg-gray-50 px-3 py-2 rounded-xl text-xs font-mono text-gray-700" />
              <button @click="copyLink" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm">
                <i class="fa-solid fa-copy"></i> Copiar Link
              </button>
            </div>

            <div class="pt-3 border-t flex flex-col sm:flex-row items-center gap-4">
              <div class="p-2.5 bg-gray-50 border border-gray-200 rounded-xl shadow-inner shrink-0">
                <img :src="qrCodeUrl" alt="QR Code da loja" class="w-28 h-28 mx-auto" />
              </div>
              <div class="space-y-1 text-center sm:text-left">
                <h4 class="font-bold text-gray-800 text-xs">QR Code para Divulgação</h4>
                <p class="text-[11px] text-gray-500 max-w-xs">Use o QR Code em cartões de visita, balcões e materiais impressos.</p>
                <a :href="qrCodeUrl" :download="`qr-loja-${slug}.png`" class="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-1">
                  <i class="fa-solid fa-download"></i> Baixar Imagem do QR Code
                </a>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: STICKY LIVE SMARTPHONE MOCKUP (5 Cols) -->
        <div class="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-6 self-start space-y-2">
          
          <div class="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <h4 class="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <i class="fa-solid fa-mobile-screen text-indigo-500"></i> Previsualização em Tempo Real
            </h4>
            <span class="text-[10px] font-bold text-indigo-600 truncate max-w-[140px]">{{ activeThemeObj?.label }}</span>
          </div>

          <!-- Smartphone Frame Container (iPhone 13 Proportions) -->
          <div class="relative mx-auto w-full max-w-[340px] h-[680px] bg-slate-900 rounded-[48px] p-3.5 shadow-2xl ring-1 ring-slate-800/80 border-[5px] border-slate-800 flex flex-col">
            <!-- Hardware Side Buttons -->
            <div class="absolute -left-[8px] top-24 w-[3px] h-10 bg-slate-700 rounded-l"></div>
            <div class="absolute -left-[8px] top-38 w-[3px] h-12 bg-slate-700 rounded-l"></div>
            <div class="absolute -right-[8px] top-32 w-[3px] h-14 bg-slate-700 rounded-r"></div>

            <!-- Dynamic Island / Camera Notch -->
            <div class="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-end px-2 gap-1 shadow-sm">
              <div class="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800"></div>
              <div class="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
            </div>

            <!-- Overlay Layer no Mockup de Detalhes -->
            <div 
              v-if="activeThemeObj?.bgOverlay?.enabled && activeThemeObj?.bgOverlay?.opacity > 0"
              class="absolute inset-3.5 rounded-[36px] pointer-events-none z-10 transition-all duration-300"
              :style="{
                backgroundColor: activeThemeObj.bgOverlay.color || '#000',
                opacity: activeThemeObj.bgOverlay.opacity,
                backdropFilter: activeThemeObj.bgOverlay.blur > 0 ? `blur(${activeThemeObj.bgOverlay.blur}px)` : 'none'
              }"
            ></div>

            <!-- Screen Area with Active Theme Class & iPhone Aspect Ratio -->
            <div 
              :class="['theme-' + (previewTheme || selectedTheme)]" 
              class="w-full h-[640px] overflow-y-auto rounded-[36px] p-4 pt-9 text-center transition-all duration-300 relative select-none shadow-inner z-0"
              :style="themeStore.getThemePreviewStyle(activeThemeObj)"
            >
              <!-- Hero Header Mockup -->
              <div class="flex flex-col items-center mb-5">
                <img 
                  :src="loja.logo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'" 
                  alt="Logo" 
                  class="w-18 h-18 rounded-2xl object-cover shadow-lg ring-2 ring-[var(--color-accent)] mb-2" 
                />
                <h3 class="text-lg font-bold leading-tight" style="color: var(--color-text);">{{ loja.name }}</h3>
                <p class="text-xs opacity-80 max-w-[220px] mt-1 leading-snug" style="color: var(--color-text);">
                  {{ loja.description || 'Sua vitrine digital com links e atendimento personalizado.' }}
                </p>
              </div>

              <!-- Links Mockup Cards -->
              <div class="space-y-2 mb-4">
                <div 
                  v-for="(link, lIdx) in (loja.links && loja.links.length ? loja.links : [{ texto: 'Nosso Site Oficial', icone: 'fa-solid fa-globe' }, { texto: 'Atendimento WhatsApp', icone: 'fa-brands fa-whatsapp' }])" 
                  :key="lIdx"
                  class="flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs font-semibold shadow-sm transition-all"
                  style="background: var(--color-foreground); border-color: var(--color-accent); color: var(--color-text);"
                >
                  <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style="background: var(--color-background);">
                    <i :class="link.icone || 'fa-solid fa-link'" class="text-xs" style="color: var(--color-accent);"></i>
                  </div>
                  <span class="flex-1 truncate">{{ link.texto }}</span>
                  <i class="fa-solid fa-chevron-right text-[10px] opacity-60" style="color: var(--color-accent);"></i>
                </div>
              </div>

              <!-- Premium Landing Page Features Preview -->
              <div v-if="activeThemeObj?.isPremium || ['portrait-hero', 'landing-page'].includes(activeThemeObj?.layoutStyle)" class="space-y-3 pt-2 text-left">
                <!-- Sobre Mim Block -->
                <div class="p-3 rounded-xl border text-xs space-y-1" style="background: var(--color-foreground); border-color: var(--color-accent);">
                  <div class="font-bold flex items-center gap-1" style="color: var(--color-text);">
                    <i class="fa-solid fa-user-check text-[10px]" style="color: var(--color-accent);"></i> Sobre mim
                  </div>
                  <p class="opacity-80 text-xs leading-relaxed whitespace-pre-line" style="color: var(--color-text);">
                    {{ formBio || 'Atendimento estratégico com compromisso e excelência.' }}
                  </p>
                </div>

                <!-- Stats Counter Row -->
                <div v-if="formMetrics && formMetrics.length" class="grid grid-cols-3 gap-1 p-2 rounded-xl text-center border" style="background: var(--color-foreground); border-color: var(--color-accent);">
                  <div 
                    v-for="(metric, mIdx) in formMetrics.slice(0, 3)" 
                    :key="mIdx"
                    :class="[mIdx === 1 ? 'border-x px-1' : '']"
                    :style="mIdx === 1 ? { borderColor: 'var(--color-accent)' } : {}"
                  >
                    <div class="font-black text-xs" style="color: var(--color-primary);">{{ metric.value || '-' }}</div>
                    <div class="text-[8px] uppercase opacity-70 truncate">{{ metric.label || '-' }}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
    <p v-else class="text-center text-red-600 mt-10">Vitrine não encontrada.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import { useContactStore } from '../../stores/contactStore'
import { useThemeStore } from '../../stores/themeStore'
import { useFeedbackStore } from '../../stores/feedbackStore'
import Loading from '../ui/Loading.vue'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug

const themeStore = useThemeStore()
const lojaStore = useLojaStore()
const contactStore = useContactStore()
const feedbackStore = useFeedbackStore()

const activeMainTab = ref('theme') // 'theme' | 'content' | 'links' | 'share'
const selectedTheme = ref('')
const previewTheme = ref('')
const isPreview = ref(false)
const salvandoTema = ref(false)
const selectedCategoryTab = ref('all') // 'all' | 'premium' | 'gradient' | 'standard'

const mainNavigationTabs = [
  { id: 'theme', label: 'Temas & Visual', icon: 'fa-solid fa-palette' },
  { id: 'content', label: 'Conteúdo Premium', icon: 'fa-solid fa-pen-to-square' },
  { id: 'links', label: 'Links & Contatos', icon: 'fa-solid fa-link' },
  { id: 'share', label: 'Compartilhar', icon: 'fa-solid fa-share-nodes' }
]

const filterTabs = [
  { id: 'all', label: 'Todos os Temas' },
  { id: 'premium', label: '👑 Premium VIP' },
  { id: 'gradient', label: '🎨 Gradientes' },
  { id: 'standard', label: '⚡ Padrão' }
]

const loja = ref(null)

const longUrl = computed(() => `${window.location.origin}/${slug}`)
const shortUrl = ref('')
const qrCodeUrl = computed(() => {
  const target = shortUrl.value || longUrl.value
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(target)}&size=200x200`
})

const filteredThemes = computed(() => {
  const all = themeStore.allThemes
  if (selectedCategoryTab.value === 'premium') return all.filter(t => t.isPremium)
  if (selectedCategoryTab.value === 'gradient') return all.filter(t => t.category === 'gradient' || t.colors?.background?.includes('gradient'))
  if (selectedCategoryTab.value === 'standard') return all.filter(t => !t.isPremium && t.category !== 'gradient')
  return all
})

const activeThemeObj = computed(() => {
  const targetId = previewTheme.value || selectedTheme.value
  return themeStore.allThemes.find(t => t.id === targetId) || themeStore.allThemes[0]
})

function handleThemeChange() {
  if (!selectedTheme.value) return
  previewTheme.value = selectedTheme.value
  isPreview.value = true
  themeStore.initDynamicCss()
}

async function aplicarTema() {
  if (!loja.value?.id) return
  const themeToApply = previewTheme.value || selectedTheme.value

  salvandoTema.value = true
  try {
    await lojaStore.atualizarTemaLoja(loja.value.id, themeToApply)
    loja.value.theme = themeToApply
    themeStore.applyTheme(themeToApply, loja.value.id)
    selectedTheme.value = themeToApply
    previewTheme.value = themeToApply
    isPreview.value = false
    
    feedbackStore.showSuccess(`Tema "${activeThemeObj.value?.label || themeToApply}" aplicado com sucesso!`)
  } catch (error) {
    console.error('Erro ao aplicar tema:', error)
    const msg = error.response?.data?.error || error.message || 'Falha ao atualizar o tema.'
    feedbackStore.showError('Erro ao aplicar tema: ' + msg)
  } finally {
    salvandoTema.value = false
  }
}

function cancelarPreview() {
  const savedTheme = loja.value?.theme || 'default'
  selectedTheme.value = savedTheme
  previewTheme.value = savedTheme
  isPreview.value = false
  themeStore.applyTheme(savedTheme, loja.value?.id)
}

const formBio = ref('')
const formMetrics = ref([
  { value: '+500', label: 'Clientes' },
  { value: '8 ANOS', label: 'Experiência' },
  { value: '95%', label: 'Satisfação' }
])
const formFaqs = ref([])
const salvandoConteudo = ref(false)

function adicionarFaq() {
  formFaqs.value.push({
    question: '',
    answer: ''
  })
}

function removerFaq(index) {
  formFaqs.value.splice(index, 1)
}

async function salvarConteudoCustomizado() {
  if (!loja.value?.id) return
  salvandoConteudo.value = true
  try {
    const validMetrics = formMetrics.value.filter(m => m.value && m.value.trim() && m.label && m.label.trim())
    const validFaqs = formFaqs.value.filter(f => f.question && f.question.trim() && f.answer && f.answer.trim())

    await lojaStore.atualizarConteudoCustomizado(loja.value.id, {
      bio: formBio.value,
      metrics: validMetrics,
      faqs: validFaqs
    })

    loja.value.bio = formBio.value
    loja.value.metrics = validMetrics
    loja.value.faqs = validFaqs

    feedbackStore.showSuccess('Conteúdo personalizado salvo com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar conteúdo personalizado:', error)
    const msg = error.response?.data?.error || error.message || 'Falha ao salvar conteúdo.'
    feedbackStore.showError('Erro ao salvar conteúdo: ' + msg)
  } finally {
    salvandoConteudo.value = false
  }
}

async function buscarLoja() {
  if (lojaStore.lojas.length === 0) {
    await lojaStore.listarLojas()
  }
  loja.value = lojaStore.lojas.find(l => l.slug === slug)
}

onMounted(async () => {
  themeStore.initDynamicCss()
  await buscarLoja()

  if (loja.value) {
    selectedTheme.value = loja.value.theme || 'default'
    previewTheme.value = selectedTheme.value
    themeStore.applyTheme(selectedTheme.value, loja.value.id)

    formBio.value = loja.value.bio || ''
    if (loja.value.metrics && Array.isArray(loja.value.metrics) && loja.value.metrics.length > 0) {
      formMetrics.value = JSON.parse(JSON.stringify(loja.value.metrics))
    }
    if (loja.value.faqs && Array.isArray(loja.value.faqs) && loja.value.faqs.length > 0) {
      formFaqs.value = JSON.parse(JSON.stringify(loja.value.faqs))
    } else {
      formFaqs.value = [
        { question: 'Como funciona o atendimento presencial ou online?', answer: 'Realizamos consultorias personalizadas tanto de forma 100% remota com flexibilidade de horários quanto presencialmente com agendamento prévio.' },
        { question: 'Quais são as etapas do acompanhamento?', answer: 'Iniciamos com um diagnóstico inicial detalhado, mapeamento de necessidades e estruturação de um plano estratégico contínuo.' },
        { question: 'Como faço para tirar dúvidas antes de contratar?', answer: 'Basta clicar no botão de atendimento pelo WhatsApp ou selecionar um dos nossos consultores para falar diretamente conosco.' }
      ]
    }
  }

  // Gera link encurtado
  try {
    const resp = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl.value)}`
    )
    if (resp.ok) shortUrl.value = await resp.text()
    else shortUrl.value = longUrl.value
  } catch {
    shortUrl.value = longUrl.value
  }

  await contactStore.listarContatos()
})

function copyLink() {
  const text = shortUrl.value || longUrl.value
  navigator.clipboard.writeText(text)
    .then(() => feedbackStore.showSuccess('Link copiado para a área de transferência!'))
    .catch(() => feedbackStore.showError('Falha ao copiar link.'))
}

const back = () => {
  router.push('/stores')
}

const contatosDaLoja = computed(() => contactStore.contatos.filter(contato => 
  contato.stores?.some(store => 
    store.id === loja.value?.id && 
    (!store.pivot || !store.pivot.deleted_at)
  )
))
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scrollbar fina para o mockup */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>


