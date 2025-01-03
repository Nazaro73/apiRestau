<template>
  <div class="cart-page">
    <h2>Votre Panier</h2>
    <div v-if="cartItems.length > 0">
      <CartItem 
        v-for="item in cartItems" 
        :key="item.id" 
        :item="item"
        @remove="removeFromCart"
      />
      <CartSummary :total="cartTotal" />
      <button @click="createOrder" class="create-order-button">Passer la commande</button>
    </div>
    <p v-else>Votre panier est vide.</p>
    <div v-if="orderMessage" class="order-message" :class="{ 'success': orderSuccess, 'error': !orderSuccess }">
      {{ orderMessage }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useCartStore } from '../stores/cart';
import CartItem from './CartItem.vue';
import CartSummary from './CartSummary.vue';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();

const cartItems = computed(() => cartStore.items);
const cartTotal = computed(() => cartStore.total);

const orderMessage = ref('');
const orderSuccess = ref(false);

const removeFromCart = (itemId) => {
  cartStore.removeFromCart(itemId);
};

const createOrder = async () => {
  try {
    await cartStore.createOrder();
    orderSuccess.value = true;
    orderMessage.value = 'Votre commande a été créée avec succès !';
    setTimeout(() => {
      router.push('/user/commandes');
    }, 2000);
  } catch (error) {
    orderSuccess.value = false;
    orderMessage.value = 'Erreur lors de la création de la commande. Veuillez réessayer.';
  }
};
</script>

<style scoped>
.cart-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.create-order-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.create-order-button:hover {
  background-color: #3aa876;
}

.order-message {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
}

.order-message.success {
  background-color: #d4edda;
  color: #155724;
}

.order-message.error {
  background-color: #f8d7da;
  color: #721c24;
}
</style>