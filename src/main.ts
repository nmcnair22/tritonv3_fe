import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import Aura from '@primeuix/themes/aura'
import router from './router'

// Import style.css after PrimeVue theme
import './style.css'
import App from './App.vue'

// Create Pinia store
const pinia = createPinia()

// Create app
const app = createApp(App)

// Configure PrimeVue with the new theme system
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  }
})
app.use(pinia)
app.use(router)

app.mount('#app')
