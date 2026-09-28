---
name: trello-integration
description: Habilidade e utilitário de integração oficial com o Trello no projeto Vitrines. Contém credenciais de API, IDs das listas, regras de movimentação e automação.
---

# Skill: Integração com Trello (`trello-integration`)

Esta skill fornece as credenciais, IDs de listas, mapeamentos e convenções de automação do Trello para o repositório **Vitrines**.

---

## 🔑 Credenciais da API do Trello

- **API Key**: `b8752ac8834e7100bb988d50ef8cc56e`
- **Token**: `ATTA7a9df72c9febdbb8319361cee6adc88043d4c8424dd59272907f340a5002a5bf65184B38`
- **ID do Quadro (Board)**: `QGJG8nx3` (`680a3fada89545c2223264fd`)
- **Link Oficial do Quadro**: [https://trello.com/b/QGJG8nx3/vitrines](https://trello.com/b/QGJG8nx3/vitrines)

---

## 📊 Mapeamento Oficial das Listas/Colunas

| Nome da Coluna | ID da Lista (`idList`) | Função no Fluxo de Trabalho |
|---|---|---|
| ⏳ **Backlog** | `680a3fb77f2cbf8c700ffc89` | Banco de ideias, pendências gerais e futuras features. |
| 📋 **Requisitos** | `680a3fbb200b29c857bf0094` | Especificações, historias de usuário e demandas detalhadas. |
| 🚀 **A iniciar** | `680a3fd24bab8f3477c75e41` | Tarefas prontas para serem puxadas. |
| 🏃 **Iniciado** | `680a3fd87430c9f8bfe39e94` | Tarefa em andamento ativo (**Apenas 1 por vez**). |
| ✅ **Feito** | `680a3fd9561329b89400102b` | Código pronto na branch `<tipo>/nome` aguardando validação do usuário. |
| 🧪 **Teste** | `680a3fde1025c48f857984bc` | Código mesclado na branch `dev` em testes de homologação. |
| 🔧 **Correção** | `6818d974fffd22f6237d9f14` | Ajustes e correções apontadas em homologação. |
| 🎉 **Produção** | `680a3fe1229c0933261c1b1b` | Código mesclado na branch `main` e publicado (**Inserido no TOPO**). |

---

## 🤖 Automação via REST API (Node.js / cURL / PowerShell)

### 1. Mover Cartão de Coluna
```javascript
// PUT https://api.trello.com/1/cards/{cardId}
{
  "idList": "ID_DA_NOVA_LISTA",
  "key": "b8752ac8834e7100bb988d50ef8cc56e",
  "token": "ATTA7a9df72c9febdbb8319361cee6adc88043d4c8424dd59272907f340a5002a5bf65184B38"
}
```

### 2. Atualizar Descrição do Cartão com a Branch
```javascript
// PUT https://api.trello.com/1/cards/{cardId}
{
  "desc": "### 🌿 Branch da Tarefa: feat/nome-da-tarefa\n\nDescricao da tarefa...",
  "key": "b8752ac8834e7100bb988d50ef8cc56e",
  "token": "ATTA7a9df72c9febdbb8319361cee6adc88043d4c8424dd59272907f340a5002a5bf65184B38"
}
```

### 3. Adicionar Comentário no Cartão
```javascript
// POST https://api.trello.com/1/cards/{cardId}/actions/comments
{
  "text": "🌿 **Branch**: feat/nome\n🔀 **Merge dev**: Commit abc1234\n🧪 **Passos de Teste**: 1. Testar recurso...",
  "key": "b8752ac8834e7100bb988d50ef8cc56e",
  "token": "ATTA7a9df72c9febdbb8319361cee6adc88043d4c8424dd59272907f340a5002a5bf65184B38"
}
```
