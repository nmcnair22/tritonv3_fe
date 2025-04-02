<template>
  <header class="header">
    <div class="header-left">
      <!-- Toggle sidebar button for mobile/desktop -->
      <button class="toggle-button" @click="$emit('toggle-sidebar')">
        <i class="pi pi-bars"></i>
      </button>
    </div>
    
    <div class="header-right">
      <!-- Add Button -->
      <button class="header-button">
        <i class="pi pi-plus"></i>
      </button>
      
      <!-- Notifications -->
      <button class="header-button notification-button">
        <i class="pi pi-bell"></i>
        <span v-if="notifications > 0" class="notification-badge">{{ notifications }}</span>
      </button>
      
      <!-- Theme Toggle -->
      <button class="header-button" @click="toggleDarkMode">
        <i class="pi" :class="isDarkMode ? 'pi-sun' : 'pi-moon'"></i>
      </button>
      
      <!-- Language Selector -->
      <div class="language-selector">
        <span>English</span>
        <i class="pi pi-chevron-down"></i>
      </div>
      
      <!-- User Menu -->
      <div class="user-menu" @click="toggleUserMenu">
        <span class="user-menu-item">
          <i class="pi pi-user"></i>
        </span>
        <!-- User dropdown menu would go here -->
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useThemeStore } from '../../stores/theme';

// Emits
defineEmits(['toggle-sidebar']);

// Store
const themeStore = useThemeStore();

// State
const notifications = ref(4);
const userMenuOpen = ref(false);

// Computed
const isDarkMode = ref(themeStore.isDarkMode);

// Methods
const toggleDarkMode = () => {
  themeStore.toggleDarkMode();
  isDarkMode.value = themeStore.isDarkMode;
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 24px;
  background-color: var(--white);
  border-bottom: 1px solid var(--medium-gray);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
}

.header-right {
  gap: 12px;
}

.toggle-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--dark-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.toggle-button:hover {
  background-color: var(--light-gray);
}

.header-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--dark-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: background-color 0.2s;
  position: relative;
}

.header-button:hover {
  background-color: var(--light-gray);
}

.notification-button {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--sunrise-yellow);
  color: white;
  font-size: 10px;
  font-weight: 600;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.language-selector:hover {
  background-color: var(--light-gray);
}

.user-menu {
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.user-menu:hover {
  background-color: var(--light-gray);
}

.user-menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  width: 32px;
  height: 32px;
}

/* Dark mode styles would be applied through CSS variables */
</style>