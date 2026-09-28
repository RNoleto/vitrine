---
name: laravel_backend_helper
description: Auxilia no desenvolvimento do backend Laravel 12 do projeto Vitrines, incluindo rotas, controllers, models, migrations e autenticação via Firebase com bypass local.
---

# Habilidade: Backend Helper (Laravel 12)

Esta skill é ativada quando há necessidade de trabalhar no backend Laravel (`/vitrines-api`), incluindo a criação de modelos, migrações, rotas, controladores ou alteração na camada de autenticação.

## 🔑 Autenticação e Usuários locais

Se você precisar simular requisições autenticadas localmente no Postman/Insomnia ou em testes automatizados:
1. Consulte a tabela `users` no seu banco de dados local para obter o campo `firebase_uid`.
2. Envie a requisição com o cabeçalho:
   ```http
   Authorization: Bearer <firebase_uid_do_usuario>
   ```
3. O middleware `FirebaseAuthenticate` detectará o ambiente `local` e autenticará o usuário diretamente por esse UID, sem bater na rede do Firebase.

---

## 🗄️ Criando Migrações e Modelos

Siga rigorosamente a convenção do Laravel 12:
* **Migrations**: Sempre defina as chaves estrangeiras explicitamente usando `constrained()` e delete em cascata quando apropriado (`cascadeOnDelete()`).
  Exemplo:
  ```php
  $table->foreignId('store_id')->constrained()->cascadeOnDelete();
  ```
* **Models**:
  * Utilize tipagem estrita nos relacionamentos (`HasMany`, `BelongsTo`, etc.).
  * Defina a propriedade `$fillable` corretamente.
  * Use cast de atributos apropriadamente (ex: `$casts = ['click_count' => 'integer']`).

---

## 🧭 Definindo Rotas (`routes/api.php`)

* Rotas que dependem de usuário logado devem estar sob o middleware `FirebaseAuthenticate::class`:
  ```php
  Route::middleware(FirebaseAuthenticate::class)->group(function() {
      // Rotas protegidas aqui
  });
  ```
* Rotas administrativas devem também adicionar o middleware `CheckRole` para o papel de administrador:
  ```php
  Route::middleware([
      FirebaseAuthenticate::class,
      \App\Http\Middleware\CheckRole::class.':admin'
  ])->group(function() {
      // Rotas exclusivas de administrador aqui
  });
  ```

---

## 📤 Manipulação de Arquivos e Imagens

* O projeto usa o Cloudinary para guardar logos e imagens de vitrines.
* Use a API do Cloudinary configurada através do provider do Laravel:
  ```php
  use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
  
  $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath())->getSecurePath();
  ```

---

## 🧪 Rodando Testes e Comandos Úteis

* Para rodar a suite de testes PHPUnit no ambiente do projeto:
  ```bash
  composer test
  ```
* Para limpar o cache do Laravel se houver inconsistências:
  ```powershell
  # Na pasta vitrines-api
  .\limpar-cache-laravel.ps1
  ```
* Para iniciar o servidor de desenvolvimento unificado (Vite, Laravel serve, queue listener, logs):
  ```bash
  composer dev
  ```
