import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Lara from '@primeuix/themes/lara'
import Router from './router'
import App from './App.vue'

// Import PrimeIcons
import 'primeicons/primeicons.css'

// Import custom styles
import './assets/styles/main.css'

// Import PrimeVue components that will be used globally
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'
import Breadcrumb from 'primevue/breadcrumb'
import Ripple from 'primevue/ripple'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'
import Menu from 'primevue/menu'
import Select from 'primevue/select'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'

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
      prefix: 'p',
      darkModeSelector: 'system'
    }
  },
  ripple: true
})

// Register PrimeVue services
app.use(ToastService)

// Register PrimeVue directives
app.directive('ripple', Ripple)
app.directive('tooltip', Tooltip)

// Register global components
app.component('Button', Button)
app.component('Drawer', Drawer)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Checkbox', Checkbox)
app.component('Divider', Divider)
app.component('Breadcrumb', Breadcrumb)
app.component('Menu', Menu)
app.component('Select', Select)
app.component('Chart', Chart)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Avatar', Avatar)
app.component('Tag', Tag)

// Mount the app
app.mount('#app')
