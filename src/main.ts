import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Router from './router'
import App from './App.vue'
// PrimeVue
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
// Axios
import axios from 'axios'
// Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import Card from 'primevue/card'
import Message from 'primevue/message'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import Menu from 'primevue/menu'
import Drawer from 'primevue/drawer'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'
import Breadcrumb from 'primevue/breadcrumb'
// Styles
import 'primeicons/primeicons.css'
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

const pinia = createPinia()
app.use(pinia)
console.log('[MAIN] Pinia registered')

app.use(Router)

app.config.globalProperties.axios = axios

app.use(PrimeVue, {
theme: {
preset: Material,
options: {
prefix: 'p',
darkModeSelector: 'system'
}
},
ripple: true
})

app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)
// Register directives
app.directive('tooltip', Tooltip)
// Register components
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Toast', Toast)
app.component('Select', Select)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Card', Card)
app.component('Message', Message)
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