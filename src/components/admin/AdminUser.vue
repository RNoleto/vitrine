<script setup>
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
    <p class="text-gray-700">Aqui você pode visualizar, editar e excluir usuários do sistema.</p>

    <div class="overflow-x-auto mt-6">
      <table class="min-w-full bg-white border border-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left px-4 py-2 border-b">Nome</th>
            <th class="text-left px-4 py-2 border-b">Email</th>
            <th class="text-left px-4 py-2 border-b">Grupo</th>
            <th class="text-left px-4 py-2 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="px-4 py-2 border-b">João Silva</td>
            <td class="px-4 py-2 border-b">joao@example.com</td>
            <td class="px-4 py-2 border-b">User</td>
            <td class="px-4 py-2 border-b">
              <div class="flex gap-2">
                <button class="text-blue-600 hover:underline">Editar</button>
                <button class="text-red-600 hover:underline ml-2">Excluir</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
