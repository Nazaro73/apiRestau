<template>
    <div class="restaurant-list">
      <h2>Liste des Restaurants</h2>
      <div class="restaurant-grid">
        <RestaurantCard 
          v-for="restaurant in restaurants" 
          :key="restaurant.id" 
          :restaurant="restaurant"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import RestaurantCard from './RestaurantCard.vue';
  import { useAuthStore } from '../stores/auth';
  
  const restaurants = ref([]);
  const authStore = useAuthStore();
  
  onMounted(async () => {
    try {
      const response = await fetch('http://localhost:3000/restaurants', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      });
      if (response.ok) {
        restaurants.value = await response.json();
      } else {
        console.error('Erreur lors de la récupération des restaurants');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  });
  </script>
  
  <style scoped>
  .restaurant-list {
    padding: 20px;
  }
  
  .restaurant-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
  }
  </style>