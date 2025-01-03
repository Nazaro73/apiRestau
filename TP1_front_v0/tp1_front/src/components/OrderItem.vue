<template>
  <div class="order-item">
    <h3>Commande #{{ order.id }}</h3>
    <p>Date: {{ formatDate(order.createdAt) }}</p>
    <ul>
      <li v-for="item in order.items" :key="item.id">
        {{ item.nom }} - {{ item.prix }} €
      </li>
    </ul>
    <p class="total">Total: {{ order.total }} €</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  order: {
    type: Object,
    required: true
  }
});

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};
</script>

<style scoped>
.order-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 5px;
}

.total {
  font-weight: bold;
  margin-top: 10px;
}
</style>