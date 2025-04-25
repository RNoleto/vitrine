<script setup>
defineProps({
  text: String,
  icon: String,      // Aqui pode vir 'fa-brands fa-instagram'
  photo: String,     // Aqui é URL de imagem
  link: String,
  internal: Boolean,
});
</script>

<template>
  <component
    :is="internal ? 'RouterLink' : 'a'"
    v-bind="internal ? { to: link } : { href: link, target: '_blank', rel: 'noopener noreferrer' }"
    class="card"
  >
    <div class="icon-wrapper">
      <img
        v-if="photo"
        :src="photo"
        alt="Foto"
        class="photo"
      />
      <i
        v-else-if="icon"
        :class="icon"
        class="icon"
      />
    </div>
    <p>{{ text }}</p>
  </component>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #ffffff;
  text-align: left;
  padding: 0.25rem 0.25rem 0.25rem 1rem;
  border: 1px solid #cecece;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  margin-bottom: 1rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.01);
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  /* background: linear-gradient(135deg, #5A50B3 0%, #874DA2 50%, #B24890 100%); */
  background: #cecece;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

.icon-wrapper .icon {
  font-size: 20px;
  color: white;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transform: scale(1.13);
}
</style>
