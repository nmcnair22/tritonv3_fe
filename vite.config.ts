import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { fileURLToPath } from 'url'

// Ensure Vite is version 5.x for optimal compatibility with Vue 3 and PrimeVue 4
// Run: npm install vite@latest

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'log-config',
      configResolved(config) {
        console.log('[VITE] Resolved alias:', config.resolve.alias)
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})