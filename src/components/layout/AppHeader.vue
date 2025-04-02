<template>
  <header class="app-header">
    <div class="app-header-left">
      <Button icon="pi pi-bars" class="p-button-text menu-toggle" @click="toggleSidebar" />
      <h1 class="app-title">Triton V3</h1>
    </div>
    <div class="app-header-right">
      <Button v-if="isAuthenticated" label="Logout" icon="pi pi-sign-out" class="p-button-text" @click="logout" />
      <Button v-else label="Login" icon="pi pi-sign-in" class="p-button-text" @click="navigateToLogin" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated, logout } = authStore

const emit = defineEmits(['toggle-sidebar'])

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const navigateToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: var(--p-surface-0);
  border-bottom: 1px solid var(--p-surface-200);
  height: 60px;
}

.app-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.menu-toggle {
  width: 40px;
  height: 40px;
}
</style> 