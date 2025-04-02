<template>
  <div class="not-found">
    <div class="not-found-content">
      <i class="pi pi-exclamation-triangle not-found-icon"></i>
      <h1 class="not-found-title">404</h1>
      <h2 class="not-found-subtitle">Page Not Found</h2>
      <p class="not-found-message">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button label="Go Home" icon="pi pi-home" @click="router.push('/')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
}

.not-found-content {
  max-width: 600px;
  padding: 2rem;
}

.not-found-icon {
  font-size: 4rem;
  color: var(--p-warning-500);
  margin-bottom: 1rem;
}

.not-found-title {
  font-size: 6rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
  color: var(--p-surface-900);
}

.not-found-subtitle {
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--p-surface-700);
}

.not-found-message {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  color: var(--p-surface-600);
}
</style> 