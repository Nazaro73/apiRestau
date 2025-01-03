<template>
  <div class="user-dashboard">
    <h2>Tableau de bord Utilisateur</h2>
    <nav>
      <router-link to="/user/restaurants">Restaurants</router-link> |
      <router-link to="/user/panier">Panier</router-link> |
      <router-link to="/user/commandes">Mes Commandes</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
// Pas besoin de logique supplémentaire ici
</script>

<style scoped>
.user-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

nav {
  margin-bottom: 20px;
}

nav a {
  margin-right: 10px;
  text-decoration: none;
  color: #2c3e50;
}

nav a.router-link-active {
  font-weight: bold;
  color: #42b983;
}
</style>