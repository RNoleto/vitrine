# Vitrines Frontend 🎨

Interface de usuário interativa e moderna desenvolvida em **Vue 3** e **Vite** para gerenciar e visualizar vitrines de negócios com contatos rápidos para Whatsapp.

---

## 🛠️ Tecnologias Utilizadas

* **Framework Principal:** Vue 3 (Composition API com `<script setup>`)
* **Gerenciamento de Build:** Vite
* **Estilização (CSS):** Tailwind CSS v4 (Design responsivo e customizado)
* **Gerenciador de Estado:** Pinia (Para stores globais e persistência)
* **Roteamento:** Vue Router
* **Autenticação:** Firebase Client SDK (Login por Email/Senha e Google)
* **Ícones:** FontAwesome (SVG integrados reativamente)

---

## ✨ Recursos Especiais & UI/UX

### 🔔 Sistema de Feedback Customizado (FeedbackModal)
Para entregar uma experiência de uso premium, removemos os alertas (`alert`) e confirmações (`confirm`) nativos e sem estilo do navegador. Criamos um sistema de feedback centralizado:
* **Pinia Store (`feedbackStore.js`):** Gerencia o modal global e expõe métodos baseados em Promises.
* **Componente Visual (`FeedbackModal.vue`):** Suporta quatro variações de temas com cores e ícones dedicados:
  * 🟢 **Success:** Confirmações de ações bem-sucedidas.
  * 🔴 **Error:** Apresentação de mensagens de erro ou validações que falharam.
  * 🔵 **Info:** Avisos e informativos simples.
  * ⚙️ **Confirm (Dupla Escolha):** Modal de confirmação que retorna uma Promise resolvida em `true` (Confirmar) ou `false` (Cancelar).

#### Como utilizar no código:
```javascript
import { useFeedbackStore } from '@/stores/feedbackStore'
const feedbackStore = useFeedbackStore()

// Para exibir mensagens simples:
feedbackStore.showSuccess('Ação concluída com sucesso!')
feedbackStore.showError('Não foi possível salvar.')

// Para caixas de confirmação de exclusão:
const confirmed = await feedbackStore.confirm({
  title: 'Excluir Item',
  message: 'Tem certeza que deseja apagar?'
})
if (confirmed) {
  // executa exclusão
}
```

### 🏷️ Versão do Projeto & Rodapé
O projeto implementa uma exibição clara e versionada do software:
* A versão atual é importada dinamicamente diretamente do `package.json` do projeto.
* É exibida em formato de badge no rodapé lateral do painel (`Dashboard.vue`) e na base de visualização pública das vitrines (`Footer.vue`).
* **Versão Atual:** `v1.2.0` (incluindo as melhorias críticas de banco, autenticação local bypass e modais de feedback).

---

## 🚀 Como Executar o Projeto Localmente

### 1. Requisitos
* Node.js v18 ou superior instalado
* NPM ou Yarn instalado
* Backend `vitrines-api` rodando localmente

### 2. Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd vitrine
   ```

2. **Instalar dependências do NPM:**
   ```bash
   npm install
   ```

3. **Configurar as Variáveis de Ambiente:**
   Configure a URL base da API local no arquivo `.env.development`:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```

4. **Configurar o Firebase:**
   Insira as chaves públicas da sua aplicação Firebase no arquivo `src/services/firebase.js` para restabelecer a conexão local.

5. **Iniciar o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   O frontend estará disponível em `http://localhost:5173`.

---

## 📁 Estrutura de Pastas Principal

* `src/components/auth/`: Formulários de login e cadastro.
* `src/components/ui/`: Componentes visuais utilitários e reutilizáveis (`FeedbackModal`, `EditStoreModal`, `Button`, `Input`, `Loading`).
* `src/components/views/`: Telas e visões completas da aplicação (`Home`, `Stores`, `Contacts`, `StoreDetail`, `StorePage`).
* `src/router/`: Configuração de rotas públicas e guardas de autenticação privada.
* `src/stores/`: Gerenciadores de estado Pinia (`authStore`, `lojaStore`, `contactStore`, `feedbackStore`, `themeStore`).
