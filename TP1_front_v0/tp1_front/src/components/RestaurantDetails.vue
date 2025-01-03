<template>
    <div v-if="restaurant" class="restaurant-details">
      <img :src="restaurant.image" :alt="restaurant.nom">
      <h2>{{ restaurant.nom }}</h2>
      <p>{{ restaurant.adresse }}</p>
      <p>{{ restaurant.telephone }}</p>
      
      <h3>Menu</h3>
      <DishList :restaurantId="restaurant.id" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import DishList from './DishList.vue';
  import { useAuthStore } from '../stores/auth';
  
  const route = useRoute();
  const restaurant = ref(null);
  const authStore = useAuthStore();
  
  onMounted(async () => {
    try {
      const response = await fetch(`http://localhost:3000/restaurants/${route.params.id}`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      if (response.ok) {
        restaurant.value = await response.json();
      } else {
        console.error('Erreur lors de la récupération des détails du restaurant');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  });
  </script>
  
  <style scoped>
  .restaurant-details {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .restaurant-details img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  h2, h3 {
    color: #2c3e50;
  }
  
  p {
    color: #34495e;
  }
  </style>