import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import axios from 'axios'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    total: (state) => state.items.reduce((sum, item) => sum + item.prix, 0),
    itemIds: (state) => state.items.map(item => item.id),
  },
  actions: {
    addToCart(item) {
      this.items.push(item);
    },
    removeFromCart(itemId) {
      const index = this.items.findIndex(item => item.id === itemId);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
    clearCart() {
      this.items = [];
    },
    async createOrder() {
      const authStore = useAuthStore();
      try {
        const response = await axios.post('http://localhost:3000/orders/', {
          userId: authStore.userId,
          plats: this.itemIds
        }, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json',
          }
        });
        this.clearCart();
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        throw error;
      }
    }
  },
})