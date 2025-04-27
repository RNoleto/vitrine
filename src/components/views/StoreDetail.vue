<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import { useContactStore } from '../../stores/contactStore'
import Loading from '../ui/Loading.vue'


// Teste de temas
import { useThemeStore } from '../../stores/themeStore'
const themeStore = useThemeStore()
const selectedTheme = ref('')
const previewTheme = ref('')
const isPreview = ref(false)

const themes = ['default', 'dark', 'light', 'pastel', 'aqua', 'light-gradient']

async function handleThemeChange() {
  if (!selectedTheme.value) return;

  // Aplica apenas na pré-visualização
  previewTheme.value = selectedTheme.value
  isPreview.value = true
}

async function aplicarTema() {
  try {
    await lojaStore.atualizarTemaLoja(lojaId, previewTheme.value);
    themeStore.applyTheme(previewTheme.value, lojaId);
    selectedTheme.value = previewTheme.value;
    isPreview.value = false
    alert('Tema aplicado com sucesso!');
  } catch (error) {
    console.error('Erro ao aplicar tema:', error);
    alert('Erro ao aplicar tema: ' + (error.message || 'Tente novamente'));
  }
}

function cancelarPreview() {
  previewTheme.value = ''
  isPreview.value = false
  themeStore.applyTheme(selectedTheme.value, lojaId)
}


// Fim do teste de temas

const route = useRoute()
const router = useRouter()
const lojaStore = useLojaStore()
const contactStore = useContactStore()

const lojaId = parseInt(route.params.id)
const loja = ref(null)

const longUrl = computed(() => `${window.location.origin}/store/${lojaId}`)
const shortUrl = ref('')
const qrCodeUrl = computed(() => {
  const target = shortUrl.value || longUrl.value
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(target)}&size=200x200`
})

// Busca loja após carregamento
async function buscarLoja() {
  if (lojaStore.lojas.length === 0) {
    await lojaStore.listarLojas()
  }
  loja.value = lojaStore.lojas.find(l => l.id === lojaId)
}

onMounted(async () => {
  await buscarLoja()

  selectedTheme.value = lojaStore.getTema(lojaId) || 'default';

  // gera link encurtado
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
    .then(() => alert('Link copiado!'))
    .catch(() => alert('Falha ao copiar link.'))
}

const back = () => {
  router.push('/stores')
}

const contatosDaLoja = computed(() => {
  return contactStore.contatos.filter(contato => contato.store_id === lojaId && contato.ativo)
})
</script>

<template>
  <div>
    <Loading v-if="lojaStore.carregando" />
    <div v-else-if="loja" class="max-w-4xl space-y-10">
      <h1 class="text-3xl font-bold text-center">Detalhes da Loja</h1>
      <!-- Logo e Nome -->
      <section class="flex flex-col items-center justify-center gap-2">
        <img :src="loja.logo_url" alt="Logo da Loja" class="w-24 h-24 object-contain" />
        <h2 class="text-2xl font-semibold">{{ loja.name }}</h2>
      </section>
      <!-- Compartilhamento -->
      <section>
        <h2 class="text-xl font-semibold mb-2">Compartilhar esta página</h2>
        <div class="flex gap-2">
          <input :value="shortUrl || longUrl" readonly class="flex-1 border px-3 py-2 rounded" />
          <button @click="copyLink" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Copiar
          </button>
        </div>
        <a :href="shortUrl || longUrl" target="_blank" class="inline-block mt-4 text-blue-600 hover:underline">
          Veja como sua vitrine está ficando
        </a>
        <div class="mt-4 text-center">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <img :src="qrCodeUrl" alt="QR Code da loja" class="mx-auto" />
          </div>
          <div class="mt-2">
            <a :href="qrCodeUrl" download="qr-loja-{{ lojaId }}.png" class="text-sm text-indigo-600 hover:underline">
              Baixar QR code
            </a>
          </div>
        </div>
      </section>
      <div class="divider"></div>
      <!-- Tema da Loja -->
      <section>
        <div class="flex gap-4 items-center mb-4">
          <select v-model="selectedTheme" @change="handleThemeChange" class="p-2 border rounded">
            <option value="">Selecione um tema</option>
            <option v-for="theme in themes" :key="theme" :value="theme">
              {{ theme.charAt(0).toUpperCase() + theme.slice(1) }}
            </option>
          </select>
          <div v-if="isPreview" class="flex gap-2">
            <button @click="aplicarTema" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Aplicar Tema
            </button>
            <button @click="cancelarPreview" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Cancelar
            </button>
          </div>
        </div>
      </section>

      <!-- Pré-visualização -->
      <section v-if="isPreview" class="border-2 border-dashed p-4 rounded-lg mb-8">
        <div class="preview-theme" :class="`theme-${previewTheme}`">
          <div class="preview-content">
            <div class="preview-header">
              <img :src="loja.logo_url" alt="Logo" class="preview-logo">
              <h3 class="preview-title">{{ loja.name }}</h3>
            </div>

            <div class="preview-links">
              <div v-for="(link, index) in loja.links.slice(0, 2)" :key="index" class="preview-link">
                <i :class="link.icone" :style="{ color: 'var(--color-accent)' }"></i>
                <span>{{ link.texto }}</span>
              </div>
            </div>

            <div class="preview-contact">
              <div class="preview-contact-info" v-for="contato in contatosDaLoja.slice(0, 1)" :key="contato.id">
                <div class="flex items-center gap-2">
                  <img :src="contato.photo" alt="Foto do contato" class="preview-avatar" />
                  <div>
                    <p>{{ contato.name }}</p>
                  </div>
                  <!-- <p>(11) 99999-9999</p> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Links da Loja -->
      <section>
        <h3 class="text-xl font-bold mb-4">Links</h3>
        <div v-if="loja.links.length" class="space-y-2">
          <div v-for="(link, i) in loja.links" :key="i" class="flex items-center gap-2">
            <i :class="link.icone"></i>
            <a :href="link.url" target="_blank" class="text-indigo-600 hover:underline">
              {{ link.texto }}
            </a>
          </div>
        </div>
        <p v-else class="text-gray-500">Nenhum link cadastrado.</p>
      </section>
      <div class="divider"></div>
      <!-- Contatos da Loja -->
      <section>
        <h3 class="text-xl font-bold mb-4">Contatos</h3>
        <div v-if="contatosDaLoja.length" class="space-y-3 mb-2">
          <div v-for="contato in contatosDaLoja" :key="contato.id" class="flex items-center gap-4 p-4 border rounded">
            <img :src="contato.photo" alt="Foto do contato" class="w-10 h-10 rounded-full object-cover" />
            <div class="text-left">
              <p><strong>Nome:</strong> {{ contato.name }}</p>
              <p><strong>Telefone:</strong> {{ contato.whatsapp }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500 mb-2">
          Nenhum contato atribuído a esta loja.
        </p>
      </section>
      <button @click="back" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">← Voltar</button>
    </div>
    <p v-else class="text-center text-red-600 mt-10">Loja não encontrada.</p>
  </div>
</template>
<style scoped>
.preview-theme {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 1rem;
  transform: scale(0.9);
  transform-origin: top left;
  width: 320px;
  min-height: 400px;
  background: var(--color-background);
}

.preview-content {
  pointer-events: none;
}

.preview-header {
  text-align: center;
  margin-bottom: 1rem;
}

.preview-logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin: 0 auto;
}

.preview-title {
  color: var(--color-accent);
  margin-top: 0.5rem;
}

.preview-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  margin: 0.25rem 0;
  background-color: var(--color-foreground);
  border-radius: 4px;
  border: 1px solid var(--color-accent);
  color: var(--color-text);
}

.preview-link i {
  width: 20px;
  text-align: center;
  color: var(--color-accent);
}

.preview-link span {
  color: var(--color-text);
}

.preview-contact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: var(--color-foreground);
  border-radius: 4px;
  border: 1px solid var(--color-accent);
}

.preview-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--color-primary);
}

.preview-contact-info {
  color: var(--color-text);
}
</style>
