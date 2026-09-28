# Workflow: Setup e Execução do Ambiente Dev (`dev-setup-and-run`)

Este guia descreve os passos para subir e verificar todo o ambiente de desenvolvimento local do projeto **Vitrines**.

---

## 📋 Passos de Execução

### 1. Backend (`vitrines-api`)
1. Abrir terminal na pasta `vitrines-api`.
2. Verificar se o banco PostgreSQL/SQLite está ativo e as variáveis em `.env` configuradas.
3. Executar o servidor Laravel:
   ```bash
   php artisan serve
   ```
4. Testar a rota de status da API em `http://127.0.0.1:8000/api/public/stores`.

### 2. Frontend (`vitrine`)
1. Abrir terminal na pasta `vitrine`.
2. Iniciar o servidor Vite:
   ```bash
   cmd /c "npm run dev"
   ```
3. Acessar a aplicação em `http://localhost:5173`.
