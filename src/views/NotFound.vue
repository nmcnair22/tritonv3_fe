<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 text-center">
    <div class="card p-4 max-w-md">
      <h1 class="text-5xl mb-4 text-primary">404</h1>
      <h2 class="text-2xl mb-4">Page Not Found</h2>
      <p class="mb-6">The page you are looking for does not exist or has been moved.</p>
      <router-link to="/" class="p-button p-component">
        <span class="p-button-label">Return to Dashboard</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// NotFound component logic
</script>

<style scoped>
.max-w-md {
  max-width: 28rem;
}
</style> 