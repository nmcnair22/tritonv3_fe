<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuth } from './composables/auth/useAuth';

const { checkAuth } = useAuth();

// Set up initial app state
onMounted(async () => {
  try {
    const userData = await checkAuth();
    if (typeof window !== 'undefined') {
      window.__APP_STATE__ = window.__APP_STATE__ || {};
      window.__APP_STATE__.isAuthenticated = !!userData;
    }
  } catch (error) {
    console.error('Error during authentication check:', error);
  }
});
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>