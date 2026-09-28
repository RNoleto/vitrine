---
name: git-commit-convention
description: Convenção oficial de mensagens de commit no projeto Vitrines utilizando Gitmojis e Conventional Commits.
---

# Skill: Convenção de Commits Git (`git-commit-convention`)

Esta skill estabelece o padrão de formato de mensagens de commit para manter o histórico dos repositórios do **Vitrines** limpo, semântico e legível.

---

## 📌 Formato Padrão de Commit

```bash
git commit -m "<emoji> <tipo>: <mensagem curta e descritiva>"
```

---

## 🎨 Tabela de Gitmojis e Tipos de Commit

| Emoji | Tipo | Significado / Uso | Exemplo |
|---|---|---|---|
| ✨ | `feat` | Nova funcionalidade ou recurso | `✨ feat: adicionar suporte a visualizacao de cliques de contatos` |
| 🐛 | `fix` | Correção de bug ou erro | `🐛 fix: vincular firebase_uid por email ao autenticar com Google` |
| 🎨 | `style` | Alteração visual, CSS, Tailwind ou UI | `🎨 style: adicionar transicao suave no modal de feedback` |
| 🪛 | `refactor` | Refatoração sem mudança de funcionalidade | `refactor: otimizar consulta de lojas no StoreController` |
| ⚡ | `perf` | Melhoria de performance e tempo de resposta | `⚡ perf: reduzir tamanho do bundle do frontend` |
| 📝 | `docs` | Documentação, README ou guias | `📝 docs: atualizar instrucoes de configuracao no README` |
| 🛠️ | `chore` | Manutenção, scripts ou dependências | `🛠️ chore: atualizar pacotes do vite e composer` |
| 🧪 | `test` | Adição ou alteração de testes | `🧪 test: adicionar teste unitario para criacao de vitrines` |
| 🔒 | `security` | Correção de vulnerabilidade ou segurança | `🔒 security: reforçar sanitizacao de inputs no backend` |

---

## ⚠️ Boas Práticas

1. **Mensagens no imperativo/presente**: Prefira "adicionar suporte" ou "corrigir erro" a "adicionado" ou "corrigido".
2. **Sem acentuação problemática no shell**: Quando commitar pelo terminal Windows, evite caracteres especiais na mensagem de commit se houver problemas de codificação.
3. **Escopo isolado**: Realize commits atômicos focados em uma única responsabilidade.
