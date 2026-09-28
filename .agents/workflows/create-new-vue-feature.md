# Workflow: Criação de Nova Tela/Recurso Vue 3 (`create-new-vue-feature`)

Este guia orienta o desenvolvimento de novas telas ou componentes no frontend Vue 3 (`vitrine`).

---

## 📋 Passos de Execução

1. **Modelagem de Estado (Pinia)**:
   - Se houver novo estado compartilhado, crie ou estenda uma store em `src/stores/`.
2. **Criação da View/Componente**:
   - Crie a view em `src/components/views/` usando `<script setup>`.
   - Utilize classes utilitárias do Tailwind CSS v4 e a biblioteca FontAwesome.
   - Utilize o componente reutilizável `<Button>` de `src/components/ui/Button.vue`.
3. **Registro de Rota (`src/router/index.js`)**:
   - Registrar rota com nome, caminho e meta tags (`meta: { requiresAuth: true }`).
4. **Validação do Build**:
   - Rodar `cmd /c "npm run build"` para garantir compilação sem erros.
