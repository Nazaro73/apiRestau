import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LoginForm from '../components/LoginForm.vue'
import UserDashboard from '../components/UserDashboard.vue'
import RestaurantList from '../components/RestaurantList.vue'
import RestaurantDetails from '../components/RestaurantDetails.vue'
import CartPage from '../components/CartPage.vue'
import OrderList from '../components/OrderList.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import RestaurateurDashboard from '../components/RestaurateurDashboard.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/user',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true, role: 'user' },
    children: [
      {
        path: 'restaurants',
        name: 'Restaurants',
        component: RestaurantList
      },
      {
        path: 'restaurants/:id',
        name: 'RestaurantDetails',
        component: RestaurantDetails
      },
      {
        path: 'panier',
        name: 'UserCart',
        component: CartPage
      },
      {
        path: 'commandes',
        name: 'UserOrders',
        component: OrderList
      }
    ]
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/restaurateur',
    name: 'RestaurateurDashboard',
    component: RestaurateurDashboard,
    meta: { requiresAuth: true, role: 'restaurateur' }
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory("http://localhost:5173/"),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.role && authStore.userRole !== to.meta.role) {
    next('/' + authStore.userRole)
  } else {
    next()
  }
})

export default router