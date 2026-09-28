# Workflow: Criação de Novo Endpoint na API (`create-new-api-endpoint`)

Este guia detalha o processo padronizado para criar um novo endpoint na API Laravel 12 (`vitrines-api`).

---

## 📋 Passos de Execução

1. **Definição da Rota (`routes/api.php`)**:
   - Rotas protegidas por login: incluir dentro do grupo `Route::middleware(FirebaseAuthenticate::class)`.
   - Rotas administrativas: incluir sob `Route::middleware([FirebaseAuthenticate::class, \App\Http\Middleware\CheckRole::class.':admin'])`.
2. **Criação / Atualização de Controller**:
   - Adicionar método no controller correspondente em `app/Http/Controllers/`.
   - Utilizar validações com `$request->validate([...])`.
3. **Tratamento de Exceções**:
   - Retornar respostas JSON padronizadas com status de código HTTP apropriados (`200`, `201`, `400`, `401`, `404`, `422`).
4. **Validação de Testes**:
   - Rodar a suíte de testes: `composer test`.
