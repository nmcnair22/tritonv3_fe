<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>If you can see this text, the router and layout are working properly.</p>
    
    <div class="debug-card">
      <h2>Debug Information</h2>
      <p><strong>Current Route:</strong> {{ $route.path }}</p>
      <p><strong>Is Authenticated:</strong> {{ isAuthenticated }}</p>
      <p><strong>Route Params:</strong> {{ JSON.stringify($route.params) }}</p>
      <p><strong>Route Query:</strong> {{ JSON.stringify($route.query) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Get authentication state from window.__APP_STATE__
const isAuthenticated = computed(() => {
  return typeof window !== 'undefined' 
    ? window.__APP_STATE__?.isAuthenticated || false 
    : false;
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

h1 {
  color: var(--night-sky, #0B2244);
  margin-bottom: 20px;
}

.debug-card {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-top: 20px;
}

.debug-card h2 {
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--morning-blue, #297FB7);
}
</style>