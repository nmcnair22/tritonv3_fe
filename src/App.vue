<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">Triton V3</h1>
      <div class="menu">
        <Button label="Home" icon="pi pi-home" class="p-button-text" @click="router.push('/')" />
        <Button 
          label="Login" 
          icon="pi pi-sign-in" 
          class="p-button-text" 
          @click="router.push('/login')" 
        />
      </div>
    </header>
    
    <main class="app-content">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <p>Triton V3 - © 2023</p>
    </footer>
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.app-title {
  flex-grow: 1;
  margin: 0;
  font-size: 1.5rem;
}

.menu {
  display: flex;
  gap: 0.5rem;
}

.app-content {
  flex-grow: 1;
  padding: 1rem;
}

.app-footer {
  padding: 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  text-align: center;
}
</style>
