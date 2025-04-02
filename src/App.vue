<script setup lang="ts">
import { onMounted, watch, computed } from 'vue';
import { useAuth } from '@/composables/auth/useAuth';
import { useRoute } from 'vue-router';

const { isAuthenticated, checkAuth } = useAuth();
const route = useRoute();

// Create computed properties for template access
const isDev = computed(() => import.meta.env.MODE === 'development');
const hasToken = computed(() => !!localStorage.getItem('auth_token'));
const tokenPreview = computed(() => {
  const token = localStorage.getItem('auth_token');
  return token ? token.substring(0, 10) + '...' : 'No Token';
});

// Auth debugging function
async function initializeAuth() {
  console.log('[APP DEBUG] Checking auth...');
  
  // Log the token status first
  console.log('[APP DEBUG] Token in localStorage:', hasToken.value);
  if (hasToken.value) {
    console.log('[APP DEBUG] Token preview:', tokenPreview.value);
  }
  
  // Now run the auth check which validates with backend
  const user = await checkAuth();
  
  // Store auth state for router guards
  window.__APP_STATE__ = {
    isAuthenticated: !!user
  };
  
  console.log('=== AUTH DEBUG ===');
  console.log('Is authenticated from auth check:', !!user);
  console.log('Has token:', hasToken.value);
  if (hasToken.value) {
    console.log('Token preview:', tokenPreview.value);
  }
  console.log('Auth in window.__APP_STATE__:', window.__APP_STATE__.isAuthenticated);
  console.log('=== END AUTH DEBUG ===');
}

// Watch route changes to debug auth issues
watch(() => route.path, (newPath) => {
  console.log(`[APP DEBUG] Route changed to: ${newPath}`);
  console.log(`[APP DEBUG] Is authenticated: ${isAuthenticated}`);
  console.log(`[APP DEBUG] Has token: ${hasToken.value}`);
  
  if (newPath.startsWith('/finance')) {
    console.log(`[APP DEBUG] Finance route detected, checking auth...`);
    initializeAuth();
  }
});

// Set up initial app state
onMounted(async () => {
  try {
    console.log('Checking authentication state...');
    const userData = await checkAuth();
    console.log('Authentication check completed', userData);
    
    // Create a safe window.__APP_STATE__ object
    if (typeof window !== 'undefined') {
      window.__APP_STATE__ = window.__APP_STATE__ || {};
      window.__APP_STATE__.isAuthenticated = isAuthenticated.value;
    }
  } catch (error) {
    console.error('Error during authentication check:', error);
  }
});

// Watch for auth state changes to update window.__APP_STATE__
watch(isAuthenticated, (newValue) => {
  if (typeof window !== 'undefined') {
    window.__APP_STATE__ = window.__APP_STATE__ || {};
    window.__APP_STATE__.isAuthenticated = newValue;
  }
});

// Log auth state if it exists
if (typeof window !== 'undefined' && window.__APP_STATE__ && 'isAuthenticated' in window.__APP_STATE__) {
  console.log('Auth in window.__APP_STATE__:', window.__APP_STATE__.isAuthenticated);
}
</script>

<template>
  <!-- Let router handle layouts -->
  <div class="app-container">
    <!-- Debug panel (only visible in development) -->
    <div v-if="isDev" class="debug-panel">
      <h4>Auth Debug</h4>
      <p>Is Authenticated: {{ isAuthenticated }}</p>
      <p>Current Route: {{ $route.path }}</p>
      <p>Has Token: {{ hasToken }}</p>
      <p>Token First 10 Chars: {{ tokenPreview }}</p>
      <button @click="initializeAuth" class="debug-button">Check Auth</button>
    </div>
    
    <!-- Rest of the app -->
    <router-view />
  </div>
</template>

<style>
/* App-specific styles only - global styles are in main.css */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.debug-panel {
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 9999;
  font-family: monospace;
  font-size: 12px;
  max-width: 300px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.debug-panel:hover {
  opacity: 1;
}

.debug-panel h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #ff9800;
}

.debug-panel p {
  margin: 5px 0;
}

.debug-button {
  background-color: #ff5722;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 10px;
}

.debug-button:hover {
  background-color: #e64a19;
}
</style>
