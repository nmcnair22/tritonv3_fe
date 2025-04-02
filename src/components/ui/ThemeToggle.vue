<template>
  <button 
    class="p-button p-button-rounded p-button-text" 
    @click="toggleTheme" 
    :class="{ 'p-button-plain': true }"
    v-tooltip="themeStore.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    aria-label="Toggle theme">
    <i :class="themeStore.isDarkMode ? 'pi pi-sun' : 'pi pi-moon'" />
  </button>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '../../stores/theme'

const themeStore = useThemeStore()

// Initialize theme and watch for system preference changes
onMounted(() => {
  themeStore.initializeTheme()
  themeStore.watchSystemTheme()
})

const toggleTheme = () => {
  themeStore.toggleDarkMode()
}
</script>

<style scoped>
/* Custom styling for the theme toggle button */
</style> 