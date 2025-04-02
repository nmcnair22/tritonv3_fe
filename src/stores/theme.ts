import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // State
  const isDarkMode = ref(false);
  
  // Initialize theme based on stored preference or system preference
  const initializeTheme = () => {
    // First check localStorage
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      // Use stored preference
      isDarkMode.value = storedTheme === 'dark';
    } else {
      // Check system preference
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Apply theme
    applyTheme();
  };
  
  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    
    // Save preference to localStorage
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
    
    // Apply theme
    applyTheme();
  };
  
  // Apply the current theme
  const applyTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
      // Set specific CSS variables for dark mode
      document.documentElement.style.setProperty('--background', '#0B2244'); // Night Sky
      document.documentElement.style.setProperty('--text-color', '#FFFFFF');
    } else {
      document.documentElement.classList.remove('dark');
      // Set specific CSS variables for light mode
      document.documentElement.style.setProperty('--background', '#F5F5F5');
      document.documentElement.style.setProperty('--text-color', '#333333');
    }
  };
  
  // Watch for system preference changes
  const watchSystemTheme = () => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only update if the user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        isDarkMode.value = e.matches;
        applyTheme();
      }
    });
  };
  
  return {
    isDarkMode,
    initializeTheme,
    toggleDarkMode,
    watchSystemTheme
  };
});