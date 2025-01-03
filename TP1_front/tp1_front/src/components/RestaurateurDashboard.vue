<template>
  <div class="restaurateur-dashboard">
    <h2>Tableau de bord Restaurateur</h2>
    <div v-if="restaurant" class="restaurant-info">
      <h3>Mon Restaurant</h3>
      <img :src="restaurant.image" :alt="restaurant.nom">
      <p><strong>Nom:</strong> {{ restaurant.nom }}</p>
      <p><strong>Adresse:</strong> {{ restaurant.adresse }}</p>
      <p><strong>Téléphone:</strong> {{ restaurant.telephone }}</p>
      <button @click="showEditForm = true">Modifier</button>
      <form v-if="showEditForm" @submit.prevent="updateRestaurant">
        <input v-model="editedRestaurant.nom" type="text" placeholder="Nom" required>
        <input v-model="editedRestaurant.adresse" type="text" placeholder="Adresse" required>
        <input v-model="editedRestaurant.telephone" type="tel" placeholder="Téléphone" required>
        <input v-model="editedRestaurant.image" type="url" placeholder="URL de l'image" required>
        <button type="submit">Enregistrer</button>
      </form>
    </div>
    <div class="plats">
      <h3>Mes Plats</h3>
      <div class="plats-grid">
        <div v-for="plat in plats" :key="plat.id" class="plat-card">
          <img :src="plat.image" :alt="plat.nom">
          <h4>{{ plat.nom }}</h4>
          <p>{{ plat.prix }} €</p>
        </div>
      </div>
      <button @click="showAddPlatForm = true">Ajouter un plat</button>
      <form v-if="showAddPlatForm" @submit.prevent="addPlat">
        <input v-model="newPlat.nom" type="text" placeholder="Nom du plat" required>
        <input v-model="newPlat.description" type="text" placeholder="Description" required>
        <input v-model="newPlat.prix" type="number" step="0.01" placeholder="Prix" required>
        <input v-model="newPlat.image" type="url" placeholder="URL de l'image" required>
        <button type="submit">Ajouter le plat</button>
      </form>
    </div>
    <div class="commandes">
      <h3>Commandes</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Statut</th>
            <th>Total</th>
            <th>Date</th>
            <th>Client</th>
            <th>Plats</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="commande in commandes" :key="commande.id">
            <td>{{ commande.id }}</td>
            <td>{{ commande.status }}</td>
            <td>{{ commande.total }} €</td>
            <td>{{ formatDate(commande.createdAt) }}</td>
            <td>{{ commande.user.email }}</td>
            <td>
              <ul>
                <li v-for="plat in commande.Plats" :key="plat.id">
                  {{ plat.nom }} (x{{ plat.OrderPlats.quantity }})
                </li>
              </ul>
            </td>
            <td>
              <button @click="updateOrderStatus(commande.id, 'terminé')" :disabled="commande.status === 'terminé'">
                Marquer comme terminé
              </button>
              <button @click="annulerCommande(commande.id)" :disabled="commande.status === 'annulé'">
                Annuler
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const restaurant = ref(null);
const plats = ref([]);
const commandes = ref([]);
const showEditForm = ref(false);
const showAddPlatForm = ref(false);
const editedRestaurant = ref({});
const newPlat = ref({
  nom: '',
  description: '',
  prix: 0,
  image: ''
});

onMounted(async () => {
  await fetchRestaurantInfo();
  await fetchPlats();
  await fetchCommandes();
});

const fetchRestaurantInfo = async () => {
  try {
    const response = await axios.get('http://localhost:3000/restaurants/restaurant', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    restaurant.value = response.data;
    editedRestaurant.value = { ...restaurant.value };
  } catch (error) {
    console.error('Erreur lors de la récupération des informations du restaurant:', error);
  }
};

const updateRestaurant = async () => {
  try {
    const response = await axios.put(`http://localhost:3000/restaurants/${restaurant.value.id}`, editedRestaurant.value, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    restaurant.value = response.data;
    showEditForm.value = false;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du restaurant:', error);
  }
};

const fetchPlats = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/plats/restaurant/${restaurant.value.id}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    plats.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des plats:', error);
  }
};

const addPlat = async () => {
  try {
    const response = await axios.post(`http://localhost:3000/plats/restaurant/?restaurant_id=${restaurant.value.id}`, newPlat.value, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    plats.value.push(response.data);
    showAddPlatForm.value = false;
    newPlat.value = {
      nom: '',
      description: '',
      prix: 0,
      image: ''
    };
  } catch (error) {
    console.error('Erreur lors de l\'ajout du plat:', error);
  }
};

const fetchCommandes = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/orders/restaurant/${restaurant.value.id}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    commandes.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await axios.put(`http://localhost:3000/orders/${orderId}`, { status: newStatus }, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    await fetchCommandes();
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la commande:', error);
  }
};

const annulerCommande = async (id) => {
  try {
    await updateOrderStatus(id, 'annulé');
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la commande:', error);
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};
</script>

<style scoped>
.restaurateur-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.restaurant-info img {
  max-width: 100%;
  height: auto;
}

.plats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.plat-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}

.plat-card img {
  max-width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
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
  margin-top: 10px;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
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

ul {
  margin: 0;
  padding-left: 20px;
}
</style>