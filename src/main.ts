import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Lara from '@primeuix/themes/lara'
import Router from './router'
import App from './App.vue'

// Import PrimeVue styles
// Note: In PrimeVue 4, themes are imported differently compared to v3
// No need to import theme.css anymore as it's handled by the theme preset

// Import PrimeIcons
import 'primeicons/primeicons.css'

// Import custom styles
import '@/assets/styles/main.css'

// Import PrimeVue components that will be used globally
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import Ripple from 'primevue/ripple'

// Initialize the app
const app = createApp(App)

// Set up Pinia
const pinia = createPinia()
app.use(pinia)

// Set up Vue Router
app.use(Router)

// Set up PrimeVue with the Lara theme
app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      // The prefix used by the component styles (default is 'p')
      prefix: 'p',
      
      // CSS layer configuration (optional)
      cssLayer: {
        name: 'primevue'
      }
    }
  },
  // Enable ripple effect for buttons
  ripple: true
})

// Register PrimeVue directives
app.directive('ripple', Ripple)

// Register global components
app.component('Button', Button)
app.component('Drawer', Drawer)

// Mount the app
app.mount('#app')
