<template>
  <div id="app">
    <header v-if="authStore.isAuthenticated">
      <nav>
        <template v-if="authStore.userRole === 'user'">
          <router-link to="/user/restaurants">Restaurants</router-link> |
          <router-link to="/user/panier">Panier</router-link> |
          <router-link to="/user/commandes">Commandes</router-link>
        </template>
        <template v-else-if="authStore.userRole === 'admin'">
          <router-link to="/admin">Tableau de bord Admin</router-link>
        </template>
        <template v-else-if="authStore.userRole === 'restaurateur'">
          <router-link to="/restaurateur">Tableau de bord Restaurateur</router-link>
        </template>
        <a href="#" @click.prevent="logout">Déconnexion</a>
      </nav>
    </header>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
  } else {
    // Rediriger vers le dashboard approprié en fonction du rôle
    switch (authStore.userRole) {
      case 'user':
        router.push('/user/restaurants');
        break;
      case 'admin':
        router.push('/admin');
        break;
      case 'restaurateur':
        router.push('/restaurateur');
        break;
    }
  }
});

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

header {
  background-color: #f8f8f8;
  padding: 20px;
}

nav {
  padding: 20px 0;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>