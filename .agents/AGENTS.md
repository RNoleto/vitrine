# Regras do Projeto & Diretivas de Agentes - Vitrines

Bem-vindo ao workspace do **Vitrines**. Este repositório é uma plataforma de gerenciamento e exibição de vitrines digitais (links e contatos) integrando uma API em Laravel 12 e um Frontend Single Page Application (SPA) em Vue 3.

---

## 🏗️ Arquitetura do Workspace

O repositório é dividido em dois ecossistemas principais:

1. **`vitrine/` (Frontend)**:
   - Framework: Vue 3 (Composition API com `<script setup>`) + Vite
   - Gerenciamento de Estado: Pinia (Stores em `src/stores/`: `authStore`, `lojaStore`, `themeStore`, `feedbackStore`, `contactStore`)
   - Estilização & UI: Tailwind CSS v4 + FontAwesome 6 + CSS Dinâmico (`src/assets/themes.css`)
   - Autenticação: Firebase Client SDK (`src/services/firebase.js`)
   - Consumo de API: Axios (`src/services/api.js`) com injeção automática de token JWT
   - Componentes Compartilhados: `src/components/ui/` (ex: `Button.vue` registrado globalmente)

2. **`vitrines-api/` (Backend)**:
   - Framework: Laravel 12 (PHP 8.2+)
   - Autenticação: Middleware `FirebaseAuthenticate` (`app/Http/Middleware/FirebaseAuthenticate.php`) com fallback de validação offline JWT em ambiente `local`
   - Banco de Dados: PostgreSQL / SQLite com Eloquent ORM
   - Administração: Middleware `CheckRole` (`app/Http/Middleware/CheckRole.php`)
   - Upload de Imagens: Cloudinary (`cloudinary-labs/cloudinary-laravel`)
   - Limpeza de Base: Comando Artisan `db:truncate` (`TruncateDatabase.php`)

---

## 📜 Regras & Princípios de Desenvolvimento

1. **Escopo Estrito de Comandos**:
   - Comandos de frontend **devem** ser executados dentro do diretório `vitrine/`.
   - Comandos de backend **devem** ser executados dentro do diretório `vitrines-api/`.

2. **Autenticação & Segurança**:
   - O Axios em `vitrine/src/services/api.js` anexa automaticamente o token Firebase `Bearer <token>` do `localStorage`.
   - Novas rotas protegidas em `vitrines-api/routes/api.php` **devem** estar sob o middleware `FirebaseAuthenticate::class`.
   - No ambiente local, o middleware aceita UIDs locais diretamente para facilitar testes via Postman/Insomnia.
   - Ao fazer login com Firebase (Google/E-mail), o backend busca o usuário por `firebase_uid`. Se não encontrar, vincula ao registro existente por e-mail para evitar erros de restrição única (`users_email_unique`).

3. **Compatibilidade & Padrões do Banco de Dados**:
   - Migrations devem utilizar relacionamentos com `constrained()->cascadeOnDelete()` quando aplicável.
   - Truncar/limpar banco local: use `php artisan db:truncate` ou a query SQL `database/truncate.sql`.

4. **Padrões de UI & Estética Premium**:
   - Layout sofisticado, transições suaves (`transition-all duration-300`), cantos arredondados, gradientes calibrados.
   - Utilizar fontes premium do Google Fonts carregadas no `index.html`.
   - Temas visuais dinâmicos controlados pelo `themeStore` injetando estilos de `src/assets/themes.css`.

5. **Arquivos Reservados & Ignorados**:
   - A pasta `.agents/` contém as regras, skills e workflows do assistente.

6. **Fluxo Obrigatório de Tarefas, Trello e Git (`task-workflow`)**:
   - **Quadro Oficial do Trello**: [Quadro de Tarefas - Vitrines](https://trello.com/b/QGJG8nx3/vitrines)
   - **Exclusividade na Coluna `Iniciado`**: Apenas 1 cartão em `Iniciado` por vez.
   - **Nomenclatura Semântica de Branches**:
     - `feat/nome-da-tarefa`: Novas funcionalidades e recursos.
     - `fix/nome-da-tarefa` ou `bug/nome-da-tarefa`: Correções de erros e bugs.
     - `refactor/nome-da-tarefa`: Refatorações e limpezas de código.
     - `perf/nome-da-tarefa`: Otimizações de performance.
     - `style/nome-da-tarefa`: Redesign, ajustes visuais ou CSS/Tailwind.
     - `docs/nome-da-tarefa`: Alterações de documentação ou README.
     - `chore/nome-da-tarefa`: Manutenção, atualização de pacotes ou scripts.
   - **Branch na Descrição do Cartão (`desc`)**: Ao iniciar qualquer tarefa no Trello, adicione obrigatoriamente no campo `desc` a linha `### 🌿 Branch da Tarefa: <tipo>/nome-da-tarefa`.
   - **Comentários e Rastreabilidade no Trello**:
     - **Fase 1 (Desenvolver -> `Feito`)**: Desenvolver na branch `<tipo>/nome-da-tarefa`. Ao concluir, manter o código isolado na branch, publicar comentário com resumo, branch e tutorial de testes, mover para **`Feito`** e solicitar aprovação.
     - **Fase 2 (Aprovação -> `dev` -> `Teste`)**: Após aprovação em `Feito`, mesclar a branch para `dev` (`git push origin dev`), registrar commit/merge em comentário no cartão e movê-lo para a coluna **`Teste`**.
     - **Fase 3 (Homologação -> `main` -> `Produção`)**: Após aprovação dos testes na `dev`, excluir a branch temporária, mesclar `dev` -> `main` (Produção), registrar as informações do merge em `main` e mover o cartão para a coluna **`Produção`**, posicionado no **TOPO** da lista (`pos: "top"`).

---

## 🛠️ Skills & Workflows Disponíveis no Workspace

- `/task-workflow`: Ciclo oficial de tarefas, Trello e ciclo de branches Git (dev/main).
- `/trello-integration`: Integração com API do Trello (API Key, Token, IDs das listas e automações).
- `/git-commit-convention`: Padrão de commits com Gitmojis e Conventional Commits.
- `/start-project`: Inicialização simultânea dos servidores de desenvolvimento (Vue + Laravel).
- `/laravel-backend-helper`: Padrões, rotas, controllers, Eloquent e Firebase no Laravel 12.
- `/vue-frontend-helper`: Componentes Vue 3, Pinia stores, Tailwind v4 e Axios.
- `/qa-testing-helper`: Controle de qualidade, testes automatizados/manuais e relatórios de bugs.

### 📋 Workflows (.agents/workflows/)
- `dev-setup-and-run.md`: Setup e execução do ambiente dev.
- `create-new-api-endpoint.md`: Criação de rotas, controllers e regras no Laravel 12.
- `create-new-vue-feature.md`: Adição de novas telas, componentes e stores no Vue 3.
- `database-migration-workflow.md`: Migrations, seeders e resets no banco de dados.
