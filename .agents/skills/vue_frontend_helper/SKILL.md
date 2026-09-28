---
name: vue_frontend_helper
description: Auxilia no desenvolvimento do frontend Vue 3 + Tailwind v4 + Pinia + Axios do projeto Vitrines, cobrindo rotas, stores, consumo de API e temas.
---

# Habilidade: Vue 3 Frontend Helper

Esta skill é ativada quando há necessidade de trabalhar no frontend Vue (`/vitrine`), incluindo a criação de componentes, telas, gerenciamento de estado no Pinia, tratamento de rotas no Vue Router ou estilização com Tailwind CSS v4.

## 📦 Gerenciamento de Estado com Pinia

As stores estão centralizadas em `src/stores/`. Sempre verifique as stores existentes antes de criar novos estados:
* **authStore**: Gerencia o estado de autenticação do usuário, token JWT do Firebase, dados do usuário logado e verificação de papéis (ex: `isAdmin()`, `isLoggedIn()`).
* **lojaStore**: Gerencia a busca de lojas (públicas e privadas), criação e edição de vitrines, links de contatos vinculados.
* **themeStore**: Gerencia a aplicação de temas visuais dinâmicos. Quando o usuário acessa uma vitrine (`StorePage`), a rota aplica o tema correspondente via `themeStore.applyTheme(theme, storeId)`.
* **feedbackStore**: Centraliza feedbacks visuais simples (mensagens de sucesso, erro, loading).

---

## 🌐 Consumo da API com Axios

Utilize o cliente de API unificado em `src/services/api.js`. Ele anexa automaticamente o token JWT armazenado no `localStorage`:
```javascript
import api from '@/services/api'

// Exemplo de chamada
const response = await api.get('/stores')
```

---

## 🎨 Temas Dinâmicos e Tailwind CSS v4

O projeto utiliza Tailwind v4 que traz uma arquitetura de compilação CSS moderna.
* O arquivo `src/style.css` realiza o `@import "tailwindcss"`.
* O arquivo `src/assets/themes.css` armazena as classes e variáveis CSS de cada tema da loja. Para adicionar ou modificar temas:
  1. Adicione a classe do tema (ex: `.tema-dark`, `.tema-neon`) com as variáveis CSS de cor de fundo, cor de texto e gradientes.
  2. Atualize o controlador de temas ou as opções disponíveis de temas na interface para refletir o novo tema.
  
### Estética Premium:
* **Transições**: Adicione `transition-all duration-300` em hovers e cliques de botões ou cards.
* **Componente de Botão**: O projeto possui um botão base `src/components/ui/Button.vue` que está registrado globalmente. Use `<Button>Texto</Button>` em vez de recriar botões `button` puros a menos que necessário.

---

## 🚦 Roteamento e Guards

As rotas são configuradas em `src/router/index.js`.
* **requiresAuth**: Protege rotas de dashboard do usuário.
* **requiresAdmin**: Protege as rotas sob o escopo de `/admin`.
* Ao criar uma nova rota que precise de controle de acesso, lembre-se de adicionar o objeto `meta`:
  ```javascript
  meta: { requiresAuth: true, requiresAdmin: true }
  ```
