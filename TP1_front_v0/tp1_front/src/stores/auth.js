import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userRole: null,
    userId: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('http://localhost:3000/users/login', { email, password });
        this.token = response.data.token;
        localStorage.setItem('token', response.data.token);
        await this.fetchUserRole();
      } catch (error) {
        console.error('Erreur de connexion:', error);
        throw error;
      }
    },
    async fetchUserRole() {
      try {
        const response = await axios.get('http://localhost:3000/users/me', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.userRole = response.data.role;
        this.userId = response.data.id;
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle:', error);
        throw error;
      }
    },
    logout() {
      this.token = null;
      this.userRole = null;
      this.userId = null;
      localStorage.removeItem('token');
    },
  },
})