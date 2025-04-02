import { defineStore } from 'pinia'
import { ref } from 'vue'
import { updatePreset } from '@primeuix/themes'

export const useThemeStore = defineStore('theme', () => {
  const darkMode = ref(false)
  
  // Check user's preferred color scheme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  darkMode.value = localStorage.getItem('darkMode') 
    ? localStorage.getItem('darkMode') === 'true' 
    : prefersDark
  
  // Apply dark mode to the document if needed
  if (darkMode.value) {
    document.documentElement.classList.add('dark-mode')
  }
  
  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    localStorage.setItem('darkMode', String(darkMode.value))
    
    if (darkMode.value) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }
  
  function setPrimaryColor(primaryColor: string) {
    // This would be implemented using the PrimeVue theme API
    // For example:
    // updatePrimaryPalette({...})
  }
  
  return {
    darkMode,
    toggleDarkMode,
    setPrimaryColor
  }
}) 