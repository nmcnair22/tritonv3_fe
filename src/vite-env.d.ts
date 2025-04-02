/// <reference types="vite/client" />

// Declares .vue files as Vue components for TypeScript recognition
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}