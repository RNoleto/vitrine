# Workflow: Migrações e Atualizações de Banco (`database-migration-workflow`)

Este guia orienta sobre criação, execução e reinício de migrações no banco de dados do projeto **Vitrines**.

---

## 📋 Passos de Execução

1. **Criar Nova Migration**:
   - Executar na pasta `vitrines-api`:
     ```bash
     php artisan make:migration nome_da_migracao
     ```
2. **Definir Estrutura e Chaves Estrangeiras**:
   - Utilizar a convenção Eloquent com `constrained()->cascadeOnDelete()`.
3. **Executar Migrations**:
   - `php artisan migrate`
4. **Limpeza e Reset do Banco Local**:
   - Para limpar todas as tabelas mantendo as migrações:
     ```bash
     php artisan db:truncate
     ```
