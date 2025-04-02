import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isVisible = ref(true)
  
  function setVisible(value: boolean) {
    isVisible.value = value
    document.documentElement.style.setProperty('--sidebar-width', value ? '250px' : '0')
  }
  
  // Initialize the sidebar width CSS variable
  setVisible(isVisible.value)
  
  return {
    isVisible,
    setVisible
  }
}) 