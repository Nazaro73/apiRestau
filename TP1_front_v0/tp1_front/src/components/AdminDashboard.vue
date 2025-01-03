<template>
  <div class="admin-dashboard">
    <h2>Tableau de bord Admin</h2>
    <div class="restaurant-list">
      <h3>Liste des Restaurants</h3>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="restaurant in restaurants" :key="restaurant.id">
            <td>{{ restaurant.nom }}</td>
            <td>{{ restaurant.user.email }}</td>
            <td>
              <button @click="deleteRestaurant(restaurant.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="add-restaurateur">
      <h3>Ajouter un Restaurateur</h3>
      <button @click="showAddForm = true">Ajouter un restaurateur</button>
      <form v-if="showAddForm" @submit.prevent="addRestaurateur">
        <input v-model="newRestaurateur.email" type="email" placeholder="Email" required>
        <input v-model="newRestaurateur.password" type="password" placeholder="Mot de passe" required>
        <input v-model="newRestaurateur.restaurantName" type="text" placeholder="Nom du restaurant" required>
        <input v-model="newRestaurateur.restaurantAddress" type="text" placeholder="Adresse du restaurant" required>
        <input v-model="newRestaurateur.restaurantPhone" type="tel" placeholder="Téléphone du restaurant" required>
        <input v-model="newRestaurateur.restaurantImage" type="url" placeholder="URL de l'image du restaurant" required>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const restaurants = ref([]);
const showAddForm = ref(false);
const newRestaurateur = ref({
  email: '',
  password: '',
  role: 'restaurateur',
  restaurantName: '',
  restaurantAddress: '',
  restaurantPhone: '',
  restaurantImage: ''
});

onMounted(async () => {
  await fetchRestaurants();
});

const fetchRestaurants = async () => {
  try {
    const response = await axios.get('http://localhost:3000/restaurants/', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    restaurants.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error);
  }
};

const deleteRestaurant = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/restaurants/${id}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    await fetchRestaurants();
  } catch (error) {
    console.error('Erreur lors de la suppression du restaurant:', error);
  }
};

const addRestaurateur = async () => {
  try {
    await axios.post('http://localhost:3000/users/restaurateur', newRestaurateur.value, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    await fetchRestaurants();
    showAddForm.value = false;
    newRestaurateur.value = {
      email: '',
      password: '',
      role: 'restaurateur',
      restaurantName: '',
      restaurantAddress: '',
      restaurantPhone: '',
      restaurantImage: ''
    };
  } catch (error) {
    console.error('Erreur lors de l\'ajout du restaurateur:', error);
  }
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>