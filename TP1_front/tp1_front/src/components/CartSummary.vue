<template>
  <div class="cart-summary">
    <h3>Total: {{ total }} €</h3>
    <button @click="$emit('checkout')" class="checkout-button">Valider la commande</button>
  </div>
</template>

<script setup>
defineProps({
  total: {
    type: Number,
    required: true
  }
});

defineEmits(['checkout']);
</script>

<style scoped>
.cart-summary {
  margin-top: 20px;
  text-align: right;
}

h3 {
  margin-bottom: 10px;
}

.checkout-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.checkout-button:hover {
  background-color: #3aa876;
}
</style>