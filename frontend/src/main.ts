import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { createNotivue } from 'notivue'
import 'notivue/notification.css'
import 'notivue/animations.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/authStore'

const app = createApp(App)

const notivue = createNotivue({
  pauseOnHover: true,
  pauseOnTabChange: true,
  position: 'bottom-right'
})

router.beforeEach((to, from) => {
  const requiresAuth = to.meta['requiresAuth'] ?? false
  if (!requiresAuth || requiresAuth === false) {
    return true
  }

  if (requiresAuth) {
    const authStore = useAuthStore()
    if (authStore.jwt === '') {
      return { name: 'signin' }
    }

    // "requiresRole" va toujours avec "requiresAuth"
    const requiresRole = to.meta['requiresRole']
    if (!requiresRole) {
      return true
    }

    const userRole = authStore.role
    if (requiresRole !== userRole) {
      return { name: 'dashboard' }
    }

    return true
  }
})

app.use(createPinia())
app.use(notivue)
app.use(router)

app.mount('#app')
