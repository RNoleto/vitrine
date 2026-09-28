---
name: qa_testing_helper
description: Auxilia na realização de testes de controle de qualidade (Q.A), execução de testes automatizados e manuais, além de estruturar relatórios de problemas (bugs) encontrados.
---

# Habilidade: Q.A e Relatório de Problemas (QA Testing Helper)

Esta skill é ativada quando for solicitado realizar testes de controle de qualidade (Q.A.), depurar problemas de execução ou descrever e registrar falhas encontradas.

## 🧪 1. Testes Automatizados no Backend

Sempre que alterar códigos no backend (`/vitrines-api`), execute os testes automatizados para garantir que não houve regressão:
* Executar todos os testes:
  ```bash
  composer test
  ```
* Se precisar executar uma classe de teste específica:
  ```bash
  php artisan test --filter=StoreControllerTest
  ```

---

## 🔍 2. Testes Manuais & Depuração de APIs

Para testar endpoints localmente (Postman, Insomnia, curl, ou via scripts):
* Utilize a autenticação simplificada do ambiente `local`:
  * Envie o cabeçalho `Authorization: Bearer <firebase_uid>` com um UID existente na tabela `users` do banco local.
* Verifique o retorno HTTP:
  * `200 OK` ou `201 Created` para sucessos.
  * `400 Bad Request` / `422 Unprocessable Content` para validações.
  * `401 Unauthorized` / `403 Forbidden` para falhas de permissão ou autenticação.

---

## 📋 3. Rastreamento e Depuração de Logs

Se encontrar algum erro ou comportamento inesperado, consulte as seguintes fontes de logs antes de propor correções:
* **Backend Laravel**:
  * Visualizar arquivo de logs em tempo real: `php artisan pail` (se configurado).
  * Arquivo físico: `vitrines-api/storage/logs/laravel.log`.
* **Frontend Vue/Vite**:
  * Console de desenvolvimento do navegador (erros de runtime JS ou avisos de componentes).
  * Aba Network (Rede) para validar as chamadas ao backend e payloads enviados/recebidos.

---

## 📝 4. Padrão de Relatório de Bugs (Issue Report)

Ao identificar um bug ou erro que não possa ser corrigido imediatamente (ou que precise ser apresentado para o usuário), crie um log/relatório em formato Markdown. Salve na pasta temporária ou de artefatos, ou anote no chat seguindo este modelo estruturado:

```markdown
### 🐞 [Nome Curto e Descritivo do Erro]

* **Componente/Escopo**: [Ex: Frontend (StorePage.vue) / Backend (ContactController.php)]
* **Gravidade**: [Baixa / Média / Alta / Crítica]

#### Passos para Reproduzir
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

#### Comportamento Esperado
- [O que deveria acontecer]

#### Comportamento Atual
- [O que de fato aconteceu, incluindo mensagens de erro ou logs se houver]

#### Solução Proposta
- [O que precisa ser alterado para corrigir o problema]
```

---

## 🧹 5. Limpeza de Banco de Dados para Testes

Para resetar ou limpar todas as tabelas da base de dados local de forma segura e reiniciar os IDs (auto-incrementos/sequências) sem afetar a tabela de migrações:
* **Comando Artisan**:
  ```bash
  php artisan db:truncate
  ```
  *(Este comando solicitará confirmação em ambiente local e requer o parâmetro `--force` caso seja rodado em ambiente de produção)*
* **Script SQL**:
  Você também pode usar o arquivo [truncate.sql](file:///c:/Users/95661913249/Documents/Pessoal/Desenvolvimento/Vitrines/vitrines-api/database/truncate.sql) diretamente no seu console de banco de dados (DBeaver, pgAdmin, etc.).

