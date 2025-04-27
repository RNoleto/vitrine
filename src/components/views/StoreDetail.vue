<script setup>
import { ref, computed, onMounted, watch, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLojaStore } from '../../stores/lojaStore'
import { useContactStore } from '../../stores/contactStore'
import Loading from '../ui/Loading.vue'

// Teste de temas
import { useThemeStore } from '../../stores/themeStore'
const themeStore = useThemeStore()
const selectedTheme = ref('')

const themes = ['default', 'dark', 'light', 'pastel', 'aqua', 'light-gradient']

function handleThemeChange() {
  console.log('Tema selecionado:', selectedTheme.value)
  themeStore.setTheme(selectedTheme.value)
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

// function abrirLink(url) {
//   if (url) window.open(url, '_blank')
//   else alert('Link inválido.')
// }

// function irParaContatos() {
//   window.location.href = `/contacts/${lojaId}`
// }

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
      <section>
        <div>
          <select v-model="selectedTheme" @change="handleThemeChange" class="p-2 border rounded">
            <option value="">Selecione um tema</option>
            <option v-for="theme in themes" :key="theme" :value="theme">
              {{ theme.charAt(0).toUpperCase() + theme.slice(1) }}
            </option>
          </select>
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
