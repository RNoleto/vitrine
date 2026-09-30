<template>
  <div class="max-w-7xl mx-auto pb-12">
    <Loading v-if="lojaStore.carregando" text="Carregando detalhes da vitrine..." />
    <div v-else-if="loja" class="space-y-6">
      
      <!-- Top Bar & Compact Header -->
      <div class="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4 text-center sm:text-left">
          <img 
            :src="formLogoPreview || loja.logo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'" 
            alt="Logo" 
            class="w-14 h-14 rounded-xl object-cover shadow-sm ring-2 ring-indigo-50" 
          />
          <div>
            <div class="flex items-center justify-center sm:justify-start gap-2">
              <h1 class="text-xl font-bold text-gray-900 leading-tight">{{ formName || loja.name }}</h1>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Ativa</span>
              <span v-if="activeThemeObj?.isPremium" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                <i class="fa-solid fa-crown text-[9px]"></i> Premium
              </span>
            </div>
            <p class="text-xs text-gray-500 truncate max-w-sm mt-0.5">{{ formDescription || loja.description || 'Vitrine Digital com Links & Contatos' }}</p>
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

          <!-- TAB 2: DADOS & CONTEÚDO PERSONALIZADO (PREMIUM) -->
          <div v-show="activeMainTab === 'content'" class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5 animate-fade-in">
            <div class="border-b pb-3">
              <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
                <i class="fa-solid fa-pen-to-square text-indigo-600"></i> Dados & Conteúdo da Vitrine
              </h3>
              <p class="text-xs text-gray-500">Edite o nome, a logo, o subtítulo, a biografia e as informações da sua vitrine</p>
            </div>

            <!-- 0. Dados Principais (Nome & Logo) -->
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 pb-4 border-b border-gray-100">
              <div class="sm:col-span-7 space-y-1.5">
                <label class="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <i class="fa-solid fa-store text-indigo-500"></i> Nome da Vitrine:
                </label>
                <input 
                  v-model="formName" 
                  placeholder="Ex: Minha Empresa / Meu Nome" 
                  class="w-full p-2.5 border border-gray-300 rounded-xl text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-800"
                />
              </div>

              <div class="sm:col-span-5 space-y-1.5">
                <label class="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <i class="fa-solid fa-image text-indigo-500"></i> Logo da Vitrine:
                </label>
                <div class="flex items-center gap-2">
                  <img 
                    v-if="formLogoPreview" 
                    :src="formLogoPreview" 
                    alt="Preview Logo" 
                    class="w-9 h-9 rounded-lg object-cover border border-gray-200 shadow-xs shrink-0" 
                  />
                  <div v-else class="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                    <i class="fa-solid fa-store text-sm"></i>
                  </div>
                  <label class="flex-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all cursor-pointer text-center truncate shadow-xs">
                    <i class="fa-solid fa-upload mr-1"></i> Alterar Logo
                    <input type="file" accept="image/*" class="hidden" @change="handleLogoChange" />
                  </label>
                </div>
              </div>
            </div>

            <!-- Descrição Curta da Vitrine -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-700 flex items-center gap-1">
                <i class="fa-solid fa-quote-left text-indigo-500"></i> Descrição Curta / Tagline da Vitrine:
              </label>
              <input 
                v-model="formDescription" 
                placeholder="Ex: Atendimento estratégico, advocacia especializada e consultoria..." 
                class="w-full p-2.5 border border-gray-300 rounded-xl text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              />
              <span class="text-[10px] text-gray-400">Exibido no cabeçalho da vitrine abaixo do nome.</span>
            </div>

            <!-- Subtítulo / Slogan Personalizado -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-700 flex items-center gap-1">
                <i class="fa-solid fa-heading text-indigo-500"></i> Subtítulo / Slogan Personalizado do Tema:
              </label>
              <input 
                v-model="formSubtitle" 
                placeholder="Ex: Soluções jurídicas preventivas e atendimento estratégico personalizado" 
                class="w-full p-2.5 border border-gray-300 rounded-xl text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              />
              <span class="text-[10px] text-gray-400">Sobrescreve o subtítulo modelo do tema. Deixe em branco para usar o padrão do tema.</span>
            </div>

            <!-- Banner de Imagem Destaque -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-700 flex items-center gap-1">
                <i class="fa-solid fa-panorama text-indigo-500"></i> Banner de Imagem Destaque (URL de Imagem / Produto):
              </label>
              <input 
                v-model="formBannerImage" 
                placeholder="Ex: https://images.unsplash.com/... (URL de imagem em destaque)" 
                class="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-mono bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <span class="text-[10px] text-gray-400">URL da imagem de capa/destaque da sua vitrine. Sobrescreve a imagem modelo do tema.</span>
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
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <i class="fa-solid fa-chart-line text-indigo-500"></i> 3 Destaques Numéricos (Métricas):
                </label>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="formShowMetrics" class="sr-only peer">
                  <div class="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span class="ml-2 text-xs font-semibold" :class="formShowMetrics ? 'text-indigo-700' : 'text-gray-400'">
                    {{ formShowMetrics ? 'Exibir na Vitrine' : 'Ocultar da Vitrine' }}
                  </span>
                </label>
              </div>
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

              <div v-else class="space-y-2.5">
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

            <!-- 4. Configuração do Rodapé de Redes Sociais -->
            <div class="space-y-3 p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-gray-800 flex items-center gap-2">
                  <i class="fa-solid fa-share-nodes text-indigo-600"></i> Rodapé de Redes Sociais na Vitrine
                </label>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="formShowSocialFooter" class="sr-only peer">
                  <div class="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span class="ml-2 text-xs font-semibold" :class="formShowSocialFooter ? 'text-indigo-700' : 'text-gray-400'">
                    {{ formShowSocialFooter ? 'Exibir no Rodapé' : 'Ocultar Rodapé' }}
                  </span>
                </label>
              </div>

              <div v-if="formShowSocialFooter" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <div class="space-y-1">
                  <label class="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                    <i class="fa-brands fa-instagram text-pink-600"></i> Instagram
                  </label>
                  <input v-model="formSocialNetworks.instagram" placeholder="https://instagram.com/seu-perfil" class="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white" />
                </div>
                <div class="space-y-1">
                  <label class="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                    <i class="fa-brands fa-whatsapp text-emerald-600"></i> WhatsApp
                  </label>
                  <input v-model="formSocialNetworks.whatsapp" placeholder="https://wa.me/5511999999999" class="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white" />
                </div>
                <div class="space-y-1">
                  <label class="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                    <i class="fa-brands fa-youtube text-red-600"></i> YouTube
                  </label>
                  <input v-model="formSocialNetworks.youtube" placeholder="https://youtube.com/@seu-canal" class="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white" />
                </div>
                <div class="space-y-1">
                  <label class="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                    <i class="fa-brands fa-tiktok text-black"></i> TikTok
                  </label>
                  <input v-model="formSocialNetworks.tiktok" placeholder="https://tiktok.com/@seu-usuario" class="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white" />
                </div>
                <div class="space-y-1">
                  <label class="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                    <i class="fa-brands fa-facebook text-blue-600"></i> Facebook
                  </label>
                  <input v-model="formSocialNetworks.facebook" placeholder="https://facebook.com/suapagina" class="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white" />
                </div>
                <div class="space-y-1">
                  <label class="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                    <i class="fa-brands fa-x-twitter text-gray-800"></i> X / Twitter
                  </label>
                  <input v-model="formSocialNetworks.twitter" placeholder="https://x.com/seu-perfil" class="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white" />
                </div>
                <div class="space-y-1">
                  <label class="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                    <i class="fa-brands fa-linkedin text-blue-700"></i> LinkedIn
                  </label>
                  <input v-model="formSocialNetworks.linkedin" placeholder="https://linkedin.com/in/seu-perfil" class="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white" />
                </div>
                <div class="space-y-1">
                  <label class="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                    <i class="fa-solid fa-globe text-indigo-600"></i> Website / Blog
                  </label>
                  <input v-model="formSocialNetworks.website" placeholder="https://seusite.com.br" class="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white" />
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
                <span>{{ salvandoConteudo ? 'Salvando...' : 'Salvar Conteúdo & Redes Sociais' }}</span>
              </button>
            </div>
          </div>

          <!-- TAB 3: LINKS & CONTATOS -->
          <div v-show="activeMainTab === 'links'" class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 animate-fade-in">
            <!-- Links Cadastrados & Editor de Botões -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <i class="fa-solid fa-link text-indigo-600"></i> Botões & Links da Vitrine ({{ formLinks.length }})
                  </h3>
                  <p class="text-xs text-gray-500 mt-0.5">Edite os textos dos botões, ícones e URLs como desejar</p>
                </div>
                <button 
                  @click="adicionarLink" 
                  class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <i class="fa-solid fa-plus text-xs"></i> Adicionar Botão
                </button>
              </div>

              <div v-if="formLinks.length === 0" class="p-4 border border-dashed border-gray-200 rounded-2xl text-center text-xs text-gray-400">
                Nenhum botão cadastrado. Clique em "Adicionar Botão" para criar o primeiro link.
              </div>

              <div v-else class="space-y-3">
                <div v-for="(link, lIdx) in formLinks" :key="lIdx" class="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 relative shadow-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-indigo-700">Botão #{{ lIdx + 1 }}</span>
                    <button @click="removerLink(lIdx)" class="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1">
                      <i class="fa-solid fa-trash-can text-xs"></i> Remover
                    </button>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label class="block text-[10px] font-bold text-gray-600 mb-0.5">Texto do Botão</label>
                      <input v-model="link.texto" placeholder="Ex: Nosso Site Oficial" class="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white font-semibold" />
                    </div>
                    <div>
                      <label class="block text-[10px] font-bold text-gray-600 mb-0.5">Ícone (FontAwesome)</label>
                      <input v-model="link.icone" placeholder="Ex: fa-solid fa-globe" class="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white font-mono" />
                    </div>
                    <div>
                      <label class="block text-[10px] font-bold text-gray-600 mb-0.5">Link / URL de Destino</label>
                      <input v-model="link.url" placeholder="https://..." class="w-full p-2 border border-gray-300 rounded-xl text-xs bg-white font-mono" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-2">
                <button 
                  @click="salvarLinksEBotoes" 
                  :disabled="salvandoLinks"
                  class="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <i v-if="salvandoLinks" class="fa-solid fa-circle-notch fa-spin"></i>
                  <i v-else class="fa-solid fa-floppy-disk"></i>
                  <span>{{ salvandoLinks ? 'Salvando Botões...' : 'Salvar Texto dos Botões & Links' }}</span>
                </button>
              </div>
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
                  :src="formLogoPreview || loja.logo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'" 
                  alt="Logo" 
                  :class="['w-18 h-18 object-cover shadow-lg ring-2 ring-[var(--color-accent)] mb-2', avatarShapeClass]" 
                />
                <h3 class="text-lg font-bold leading-tight" style="color: var(--color-text);">{{ formName || loja.name }}</h3>
                <p class="text-xs opacity-80 max-w-[220px] mt-1 leading-snug" style="color: var(--color-text);">
                  {{ formSubtitle || loja.subtitle || formDescription || loja.description || activeThemeObj?.subtitle || 'Sua vitrine digital com links e atendimento personalizado.' }}
                </p>
              </div>

              <!-- Links Mockup Cards (Real-Time Reactive to formLinks) -->
              <div class="space-y-2 mb-4">
                <div 
                  v-for="(link, lIdx) in (formLinks && formLinks.length ? formLinks : (loja?.links && loja?.links.length ? loja.links : [{ texto: 'Nosso Site Oficial', icone: 'fa-solid fa-globe' }, { texto: 'Atendimento WhatsApp', icone: 'fa-brands fa-whatsapp' }]))" 
                  :key="lIdx"
                  class="flex items-center gap-2.5 p-2.5 border text-left text-xs font-semibold transition-all"
                  :class="[btnShapeClass, btnShadowClass]"
                  style="background: var(--color-foreground); border-color: var(--color-accent); color: var(--color-text);"
                >
                  <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style="background: var(--color-background-solid, var(--color-background));">
                    <i :class="link.icone || 'fa-solid fa-link'" class="text-xs" style="color: var(--color-accent);"></i>
                  </div>
                  <span class="flex-1 truncate">{{ link.texto }}</span>
                  <i class="fa-solid fa-chevron-right text-[10px] opacity-60" style="color: var(--color-accent);"></i>
                </div>
              </div>

              <!-- Features & Content Preview (Real-Time Reactive to formBio & formMetrics) -->
              <div class="space-y-3 pt-2 text-left">
                <!-- Sobre Mim Block -->
                <div v-if="formBio && formBio.trim()" class="p-3 rounded-xl border text-xs space-y-1" style="background: var(--color-foreground); border-color: var(--color-accent);">
                  <div class="font-bold flex items-center gap-1" style="color: var(--color-text);">
                    <i class="fa-solid fa-user-check text-[10px]" style="color: var(--color-accent);"></i> Sobre mim
                  </div>
                  <p class="opacity-80 text-xs leading-relaxed whitespace-pre-line" style="color: var(--color-text);">
                    {{ formBio }}
                  </p>
                </div>

                <!-- Stats Counter Row -->
                <div v-if="showMetricsComputed && formMetrics && formMetrics.length" class="grid grid-cols-3 gap-1 p-2 rounded-xl text-center border" style="background: var(--color-foreground); border-color: var(--color-accent);">
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

              <!-- Banner Destaque no Mockup em Tempo Real -->
              <div v-if="formBannerImage || loja?.banner_image || activeThemeObj?.banner_image || activeThemeObj?.bannerImage" class="rounded-xl overflow-hidden shadow-xs border border-white/20 my-2.5">
                <img 
                  :src="formBannerImage || loja?.banner_image || activeThemeObj?.banner_image || activeThemeObj?.bannerImage" 
                  alt="Banner Destaque" 
                  class="w-full h-24 object-cover" 
                />
              </div>

              <!-- Rodapé de Redes Sociais no Mockup em Tempo Real -->
              <div v-if="showSocialFooterComputed" class="pt-3 border-t border-black/10 flex items-center justify-center gap-2 flex-wrap">
                <template v-if="socialStyle === 'minimal'">
                  <span v-for="sItem in mockupSocialLinks" :key="sItem.key" class="p-1.5 opacity-80 hover:opacity-100 transition-opacity" style="color: var(--color-text);">
                    <i :class="sItem.icon" class="text-xs"></i>
                  </span>
                </template>
                <template v-else-if="socialStyle === 'circle-filled'">
                  <span v-for="sItem in mockupSocialLinks" :key="sItem.key" class="w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-xs" style="background: var(--color-primary); color: #FFFFFF;">
                    <i :class="sItem.icon" class="text-[10px]"></i>
                  </span>
                </template>
                <template v-else-if="socialStyle === 'outline'">
                  <span v-for="sItem in mockupSocialLinks" :key="sItem.key" class="w-6 h-6 rounded-full border flex items-center justify-center text-xs" style="border-color: var(--color-accent); color: var(--color-text);">
                    <i :class="sItem.icon" class="text-[10px]"></i>
                  </span>
                </template>
                <template v-else-if="socialStyle === 'pills'">
                  <span v-for="sItem in mockupSocialLinks" :key="sItem.key" class="px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 border" style="background: var(--color-foreground); border-color: var(--color-accent); color: var(--color-text);">
                    <i :class="sItem.icon" class="text-[9px]"></i>
                    <span class="capitalize">{{ sItem.key }}</span>
                  </span>
                </template>
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
  { id: 'content', label: 'Conteúdo & Dados', icon: 'fa-solid fa-pen-to-square' },
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

const avatarShapeClass = computed(() => {
  const shape = activeThemeObj.value?.avatarShape || activeThemeObj.value?.avatar_shape || 'circle'
  if (shape === 'square') return 'rounded-none'
  if (shape === 'rounded-square' || shape === 'rounded') return 'rounded-2xl'
  return 'rounded-full'
})

const btnShapeClass = computed(() => {
  const shape = activeThemeObj.value?.btnShape || activeThemeObj.value?.btn_shape || 'pill'
  if (shape === 'pill') return 'rounded-full'
  if (shape === 'rounded') return 'rounded-xl'
  if (shape === 'square') return 'rounded-none'
  if (shape === 'wavy') return 'rounded-3xl border-dashed'
  if (shape === 'outline') return 'rounded-xl !bg-transparent border-2'
  return 'rounded-full'
})

const btnShadowClass = computed(() => {
  const shadow = activeThemeObj.value?.btnShadow || activeThemeObj.value?.btn_shadow || 'soft'
  if (shadow === 'none') return 'shadow-none'
  if (shadow === 'soft') return 'shadow-sm'
  if (shadow === 'medium') return 'shadow-md'
  if (shadow === 'glow') return 'shadow-lg shadow-indigo-500/30'
  if (shadow === 'hard') return 'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]'
  return 'shadow-sm'
})

const socialStyle = computed(() => {
  return activeThemeObj.value?.socialStyle || activeThemeObj.value?.social_style || 'minimal'
})

const showSocialFooterComputed = computed(() => {
  if (typeof formShowSocialFooter.value !== 'undefined' && formShowSocialFooter.value !== null) {
    return formShowSocialFooter.value
  }
  return activeThemeObj.value?.showSocialFooter !== false && activeThemeObj.value?.show_social_footer !== false
})

const showMetricsComputed = computed(() => {
  if (typeof formShowMetrics.value !== 'undefined' && formShowMetrics.value !== null) {
    return formShowMetrics.value
  }
  return loja.value?.show_metrics !== 0 && loja.value?.show_metrics !== false
})

const mockupSocialLinks = computed(() => {
  const filled = []
  const networks = formSocialNetworks.value || {}
  
  if (networks.instagram) filled.push({ key: 'instagram', icon: 'fa-brands fa-instagram' })
  if (networks.whatsapp) filled.push({ key: 'whatsapp', icon: 'fa-brands fa-whatsapp' })
  if (networks.facebook) filled.push({ key: 'facebook', icon: 'fa-brands fa-facebook-f' })
  if (networks.youtube) filled.push({ key: 'youtube', icon: 'fa-brands fa-youtube' })
  if (networks.tiktok) filled.push({ key: 'tiktok', icon: 'fa-brands fa-tiktok' })
  if (networks.linkedin) filled.push({ key: 'linkedin', icon: 'fa-brands fa-linkedin-in' })
  if (networks.twitter) filled.push({ key: 'twitter', icon: 'fa-brands fa-x-twitter' })
  if (networks.website) filled.push({ key: 'website', icon: 'fa-solid fa-globe' })

  if (filled.length > 0) return filled

  return [
    { key: 'instagram', icon: 'fa-brands fa-instagram' },
    { key: 'whatsapp', icon: 'fa-brands fa-whatsapp' },
    { key: 'facebook', icon: 'fa-brands fa-facebook-f' },
    { key: 'linkedin', icon: 'fa-brands fa-linkedin-in' },
    { key: 'website', icon: 'fa-solid fa-globe' }
  ]
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

const formName = ref('')
const formLogoBase64 = ref(null)
const formLogoPreview = ref('')
const formDescription = ref('')
const formSubtitle = ref('')
const formBannerImage = ref('')
const formBio = ref('')
const formShowMetrics = ref(true)
const formMetrics = ref([
  { value: '+500', label: 'Clientes' },
  { value: '8 ANOS', label: 'Experiência' },
  { value: '95%', label: 'Satisfação' }
])
const formFaqs = ref([])
const formLinks = ref([])
const salvandoConteudo = ref(false)
const salvandoLinks = ref(false)

const formShowSocialFooter = ref(true)
const formSocialNetworks = ref({
  instagram: '',
  whatsapp: '',
  youtube: '',
  tiktok: '',
  facebook: '',
  twitter: '',
  linkedin: '',
  website: ''
})

function handleLogoChange(e) {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    feedbackStore.showError('Por favor, selecione um arquivo de imagem válido.')
    return
  }
  const reader = new FileReader()
  reader.onload = (event) => {
    formLogoBase64.value = event.target.result
    formLogoPreview.value = event.target.result
  }
  reader.readAsDataURL(file)
}

function adicionarFaq() {
  formFaqs.value.push({
    question: '',
    answer: ''
  })
}

function removerFaq(index) {
  formFaqs.value.splice(index, 1)
}

function adicionarLink() {
  formLinks.value.push({
    icone: 'fa-solid fa-globe',
    texto: 'Novo Botão de Link',
    url: 'https://'
  })
}

function removerLink(index) {
  formLinks.value.splice(index, 1)
}

async function salvarLinksEBotoes() {
  if (!loja.value?.id) return
  salvandoLinks.value = true
  try {
    const validLinks = formLinks.value.filter(l => l.texto && l.texto.trim() && l.url && l.url.trim())
    await lojaStore.editarLoja(loja.value.id, {
      name: formName.value || loja.value.name,
      logoBase64: formLogoBase64.value,
      links: validLinks,
      ativo: loja.value.ativo ?? 1
    })
    const updatedStore = lojaStore.lojas.find(l => l.id === loja.value.id)
    if (updatedStore) {
      loja.value = updatedStore
      formLinks.value = JSON.parse(JSON.stringify(updatedStore.links || []))
    }
    feedbackStore.showSuccess('Links e textos dos botões salvos com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar links:', error)
    const msg = error.response?.data?.error || error.message || 'Falha ao salvar links.'
    feedbackStore.showError('Erro ao salvar links: ' + msg)
  } finally {
    salvandoLinks.value = false
  }
}

async function salvarConteudoCustomizado() {
  if (!loja.value?.id) return
  salvandoConteudo.value = true
  try {
    // Atualiza nome e logo se alterados
    if ((formName.value && formName.value !== loja.value.name) || formLogoBase64.value) {
      await lojaStore.editarLoja(loja.value.id, {
        name: formName.value || loja.value.name,
        logoBase64: formLogoBase64.value,
        links: loja.value.links || [],
        ativo: loja.value.ativo ?? 1
      })
      const updatedStore = lojaStore.lojas.find(l => l.id === loja.value.id)
      if (updatedStore) {
        loja.value = updatedStore
        formLogoPreview.value = updatedStore.logo_url
        formLogoBase64.value = null
      }
    }

    const validMetrics = formMetrics.value.filter(m => m.value && m.value.trim() && m.label && m.label.trim())
    const validFaqs = formFaqs.value.filter(f => f.question && f.question.trim() && f.answer && f.answer.trim())

    await lojaStore.atualizarConteudoCustomizado(loja.value.id, {
      description: formDescription.value,
      subtitle: formSubtitle.value,
      banner_image: formBannerImage.value,
      bio: formBio.value,
      metrics: validMetrics,
      show_metrics: formShowMetrics.value ? 1 : 0,
      faqs: validFaqs,
      social_networks: formSocialNetworks.value,
      show_social_footer: formShowSocialFooter.value ? 1 : 0
    })

    loja.value.description = formDescription.value
    loja.value.subtitle = formSubtitle.value
    loja.value.banner_image = formBannerImage.value
    loja.value.bio = formBio.value
    loja.value.metrics = validMetrics
    loja.value.show_metrics = formShowMetrics.value ? 1 : 0
    loja.value.faqs = validFaqs
    loja.value.social_networks = JSON.parse(JSON.stringify(formSocialNetworks.value))
    loja.value.show_social_footer = formShowSocialFooter.value ? 1 : 0

    feedbackStore.showSuccess('Dados, conteúdo e redes sociais da vitrine salvos com sucesso!')
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
  await themeStore.carregarTemasDoBanco()
  await buscarLoja()

  if (loja.value) {
    selectedTheme.value = loja.value.theme || 'default'
    previewTheme.value = selectedTheme.value
    themeStore.applyTheme(selectedTheme.value, loja.value.id)

    formName.value = loja.value.name || ''
    formLogoPreview.value = loja.value.logo_url || ''
    formDescription.value = loja.value.description || ''
    formSubtitle.value = loja.value.subtitle || ''
    formBannerImage.value = loja.value.banner_image || ''
    formBio.value = loja.value.bio || ''
    formShowMetrics.value = loja.value.show_metrics !== 0 && loja.value.show_metrics !== false
    formLinks.value = JSON.parse(JSON.stringify(loja.value.links || []))
    formShowSocialFooter.value = loja.value.show_social_footer !== 0 && loja.value.show_social_footer !== false

    if (loja.value.social_networks && typeof loja.value.social_networks === 'object') {
      formSocialNetworks.value = {
        instagram: loja.value.social_networks.instagram || '',
        whatsapp: loja.value.social_networks.whatsapp || '',
        youtube: loja.value.social_networks.youtube || '',
        tiktok: loja.value.social_networks.tiktok || '',
        facebook: loja.value.social_networks.facebook || '',
        twitter: loja.value.social_networks.twitter || '',
        linkedin: loja.value.social_networks.linkedin || '',
        website: loja.value.social_networks.website || ''
      }
    }

    if (loja.value.metrics && Array.isArray(loja.value.metrics) && loja.value.metrics.length > 0) {
      formMetrics.value = JSON.parse(JSON.stringify(loja.value.metrics))
    }
    if (loja.value.faqs && Array.isArray(loja.value.faqs) && loja.value.faqs.length > 0) {
      formFaqs.value = JSON.parse(JSON.stringify(loja.value.faqs))
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


