<template>
  <div class="cart-item">
    <img :src="item.image" :alt="item.nom" class="cart-item-image">
    <div class="cart-item-details">
      <h3>{{ item.nom }}</h3>
      <p>{{ item.prix }} €</p>
    </div>
    <button @click="$emit('remove', item.id)" class="remove-button">Supprimer</button>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
});

defineEmits(['remove']);
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 4px;
}

.cart-item-details {
  flex-grow: 1;
}

.remove-button {
  background-color: #ff4757;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #ff6b81;
}
</style>