---
name: start-project
description: Instruções e procedimentos para inicialização dos servidores de desenvolvimento local do projeto Vitrines (Frontend Vue 3 e Backend Laravel 12).
---

# Skill: Inicialização do Projeto (`start-project`)

Esta skill orienta sobre os procedimentos de inicialização simultânea dos ambiente de desenvolvimento do projeto **Vitrines**.

---

## 🚀 Inicialização Rápida

### 1. Backend API (Laravel 12)
- Direcionar para a pasta: `c:\Users\95661913249\Documents\Pessoal\Desenvolvimento\Vitrines\vitrines-api`
- Executar o servidor dev:
  ```bash
  php artisan serve
  ```
  *(Servidor rodando em `http://127.0.0.1:8000`)*

- Para inicializar com worker de filas e logs unificados:
  ```bash
  composer dev
  ```

- Se houver necessidade de limpar os caches do Laravel:
  ```powershell
  .\limpar-cache-laravel.ps1
  ```

---

### 2. Frontend SPA (Vue 3 + Vite + Tailwind v4)
- Direcionar para a pasta: `c:\Users\95661913249\Documents\Pessoal\Desenvolvimento\Vitrines\vitrine`
- Executar o dev server via cmd/powershell:
  ```bash
  cmd /c "npm run dev"
  ```
  *(Servidor rodando em `http://localhost:5173`)*

- Para verificar e rodar a compilação de produção:
  ```bash
  cmd /c "npm run build"
  ```
