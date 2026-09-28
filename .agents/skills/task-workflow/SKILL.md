---
name: task-workflow
description: Workflow oficial do projeto Vitrines para gestão de tarefas no Trello, criação de branches semânticas e ciclo de merge entre dev e main.
---

# Skill: Fluxo de Trabalho de Tarefas (`task-workflow`)

Esta skill estabelece a metodologia oficial e obrigatória para planejamento, desenvolvimento, testes e publicação de qualquer tarefa no ecossistema Vitrines.

---

## 📌 Regras Obrigatórias de Rastreamento no Trello

1. **Branch na Descrição (`desc`)**: Ao iniciar a execução da tarefa no Trello, edite obrigatoriamente a descrição do cartão inserindo a linha `### 🌿 Branch da Tarefa: <tipo>/nome-da-tarefa`.
2. **Registro de Commits e Merges via Comentário**: Todo cartão deve possuir comentários detalhando os commits, a branch de origem, os passos para testes e as confirmações de merge nas branches `dev` e `main`.

---

## 📌 Categorização & Tags de Branches (`<tipo>/nome-da-tarefa`)

| Tag/Prefixo | Tipo de Tarefa | Exemplo |
|---|---|---|
| 🟢 `feat/` | Nova funcionalidade ou recurso | `feat/social-links-counter` |
| 🔴 `fix/` ou `bug/` | Correção de erro ou falha | `fix/google-auth-duplicate-email` |
| 🪛 `refactor/` | Refatoração de código sem alterar comportamento | `refactor/store-controller-clean` |
| ⚡ `perf/` | Otimização de performance ou carregamento | `perf/optimize-store-logo-load` |
| 🎨 `style/` | Ajustes visuais, CSS, Tailwind ou UI | `style/store-modal-animations` |
| 📝 `docs/` | Atualização de documentação ou README | `docs/update-architecture-guide` |
| 🛠️ `chore/` | Atualização de dependências ou scripts | `chore/update-vue-deps` |

---

## 📌 Fluxo Detalhado por Etapas

### 1. Inicialização da Tarefa (Coluna `Iniciado`)
- Mover o cartão correspondente para a coluna **`Iniciado`** (`680a3fd87430c9f8bfe39e94`).
- **Exclusividade**: Apenas 1 cartão por vez na coluna `Iniciado`.
- **Criação da Branch Semântica**:
  - Frontend: `git checkout dev`, `git pull origin dev`, `git checkout -b <tipo>/nome-da-tarefa` em `vitrine/`.
  - Backend: `git checkout dev`, `git pull origin dev`, `git checkout -b <tipo>/nome-da-tarefa` em `vitrines-api/`.
- Atualizar a descrição do cartão no Trello com a linha `### 🌿 Branch da Tarefa: <tipo>/nome-da-tarefa`.

---

### 2. Desenvolvimento -> Coluna `Feito`
- Desenvolver a solução mantendo os testes limpos (`npm run build` no frontend e `composer test` no backend).
- Realizar commits no padrão Conventional Commits + Gitmojis.
- Ao concluir, **manter o código na branch da tarefa sem mesclar ainda**.
- Adicionar comentário no cartão do Trello com:
  - 🌿 **Branch**: `<tipo>/nome-da-tarefa`
  - 📝 **Resumo das alterações e arquivos modificados**.
  - 🧪 **Tutorial de testes passo a passo**.
- Mover o cartão para a coluna **`Feito`** (`680a3fd9561329b89400102b`).
- Solicitar aprovação prévia do usuário.

---

### 3. Aprovação -> Branch `dev` -> Coluna `Teste`
- Após confirmação do usuário:
  - Mesclar a branch na `dev` e fazer o push:
    ```bash
    git checkout dev
    git merge <tipo>/nome-da-tarefa
    git push origin dev
    ```
  - Comentar no Trello a confirmação do merge na `dev` e o hash do commit.
  - Mover o cartão para a coluna **`Teste`** (`680a3fde1025c48f857984bc`).

---

### 4. Homologação -> Branch `main` -> Coluna `Produção` (No Topo)
- Após a homologação e aprovação dos testes na `dev`:
  - Excluir a branch temporária da tarefa: `git branch -d <tipo>/nome-da-tarefa`.
  - Promover a `dev` para a `main`:
    ```bash
    git checkout main
    git merge dev
    git push origin main
    git checkout dev
    ```
  - Comentar no Trello a promoção para `main` (Produção), remoção da branch temporária e confirmação da branch ativa `dev`.
  - Mover o cartão para a coluna **`Produção`** (`680a3fe1229c0933261c1b1b`), posicionado no **TOPO** (`pos: "top"`).
