<template>
  <div class="order-list">
    <h2>Historique des commandes</h2>
    <div v-if="orders.length === 0" class="no-orders">
      Vous n'avez pas encore de commandes.
    </div>
    <div v-else class="orders">
      <div v-for="(order, index) in orders" :key="index" class="order-card">
        <h3>Commande #{{ index + 1 }}</h3>
        <p><strong>Total:</strong> {{ order.total.toFixed(2) }} €</p>
        <h4>Plats:</h4>
        <ul>
          <li v-for="plat in order.plats" :key="plat.id">
            {{ plat.description }} (Quantité: {{ plat.quantity }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const orders = ref([]);

const fetchOrders = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/orders/user/orders`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    orders.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.order-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.no-orders {
  text-align: center;
  color: #666;
  margin-top: 20px;
}

.orders {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
}

h3 {
  margin-top: 0;
  color: #333;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 5px;
}
</style>