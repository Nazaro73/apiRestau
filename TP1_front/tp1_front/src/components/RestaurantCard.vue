<template>
  <router-link :to="{ name: 'RestaurantDetails', params: { id: restaurant.id } }" class="restaurant-card">
    <img :src="restaurant.image" :alt="restaurant.nom">
    <h3>{{ restaurant.nom }}</h3>
  </router-link>
</template>

<script setup>
defineProps({
  restaurant: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.restaurant-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.restaurant-card:hover {
  transform: translateY(-5px);
}

.restaurant-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.restaurant-card h3 {
  padding: 10px;
  margin: 0;
  background-color: #f8f8f8;
}
</style>