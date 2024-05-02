import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap';
import { createNotivue } from 'notivue'
import 'notivue/notification.css' 
import 'notivue/animations.css'
import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const notivue = createNotivue({
    pauseOnHover: true,
    pauseOnTabChange: true,
    position: "bottom-right",
})

app.use(createPinia())
app.use(notivue)
app.use(router)

app.mount('#app')
