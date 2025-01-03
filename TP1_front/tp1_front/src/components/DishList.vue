<template>
  <div class="dish-list">
    <div v-if="dishes.length > 0" class="dish-grid">
      <DishCard 
        v-for="dish in dishes" 
        :key="dish.id" 
        :dish="dish"
      />
    </div>
    <p v-else>Aucun plat inscrit</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DishCard from './DishCard.vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  restaurantId: {
    type: Number,
    required: true
  }
});

const dishes = ref([]);
const authStore = useAuthStore();

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:3000/plats/restaurant/${props.restaurantId}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    if (response.ok) {
      dishes.value = await response.json();
    } else {
      console.error('Erreur lors de la récupération des plats');
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
});
</script>

<style scoped>
.dish-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}
</style>