<template>
  <div class="dish-card">
    <img :src="dish.image" :alt="dish.nom">
    <h4>{{ dish.nom }}</h4>
    <p>{{ dish.description }}</p>
    <p class="price">{{ dish.prix }} €</p>
    <button @click="addToCart">Ajouter au panier</button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useCartStore } from '../stores/cart';

const props = defineProps({
  dish: {
    type: Object,
    required: true
  },
  restaurantId: {
    type: Number,
    required: true
  }
});

const cartStore = useCartStore();

const addToCart = () => {
  try {
    cartStore.addToCart(props.dish, props.restaurantId);
    alert('Plat ajouté au panier !');
  } catch (error) {
    alert(error.message);
  }
};
</script>



<style scoped>
.dish-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.dish-card:hover {
  transform: translateY(-5px);
}

.dish-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.price {
  font-weight: bold;
  color: #42b983;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #3aa876;
}
</style>