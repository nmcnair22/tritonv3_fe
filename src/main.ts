import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Router from './router'
import App from './App.vue'

// PrimeVue
import PrimeVue from 'primevue/config'
import Lara from '@primeuix/themes/lara'
import Tooltip from 'primevue/tooltip'
import 'primeicons/primeicons.css'

// Axios
import axios from 'axios'

// Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Menu from 'primevue/menu'
import Drawer from 'primevue/drawer'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'
import Breadcrumb from 'primevue/breadcrumb'

// Styles
import './assets/styles/main.css'

const app = createApp(App)

// Global error handling
app.config.errorHandler = (err, instance, info) => {
  console.error('[VUE ERROR]', err)
  console.error('[VUE ERROR] Component:', instance?.$options?.name || 'Unknown Component')
  console.error('[VUE ERROR] Info:', info)
}

window.addEventListener('error', (event) => {
  console.error('[GLOBAL ERROR]', event.error)
  console.error('[GLOBAL ERROR] Message:', event.message)
  console.error('[GLOBAL ERROR] Source:', event.filename, 'Line:', event.lineno, 'Column:', event.colno)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('[UNHANDLED PROMISE REJECTION]', event.reason)
})

// Set up Pinia
const pinia = createPinia()
app.use(pinia)
console.log('[MAIN] Pinia registered')

// Set up router
app.use(Router)

// Set up Axios globally
app.config.globalProperties.axios = axios

// Set up PrimeVue with Lara theme and ripple
app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      prefix: 'p',
      darkModeSelector: 'system'
    }
  },
  ripple: true
})

// Register PrimeVue services
app.use(ToastService)

// Register directives
app.directive('tooltip', Tooltip)

// Register components
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Toast', Toast)
app.component('Select', Select)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Avatar', Avatar)
app.component('Tag', Tag)
app.component('Menu', Menu)
app.component('Drawer', Drawer)
app.component('Password', Password)
app.component('Checkbox', Checkbox)
app.component('Divider', Divider)
app.component('Breadcrumb', Breadcrumb)

// Mount the app
app.mount('#app')