import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore()

// Check authentication status before each route change
router.beforeEach(async (to, from, next) => {
  if (!authStore.isAuthenticated && to.name !== 'Login') {
    next({ name: 'Login' })
  } else if (authStore.isAuthenticated && !authStore.userRole) {
    await authStore.fetchUserRole()
    next()
  } else {
    next()
  }
})

app.mount('#app')