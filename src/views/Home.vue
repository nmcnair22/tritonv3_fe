<template>
  <div class="home">
    <h1>Welcome to Triton V3</h1>
    <div class="card">
      <p>
        This is your new Vue 3 + TypeScript application with PrimeVue components.
      </p>
      <div class="actions">
        <Button label="Get Started" icon="pi pi-arrow-right" class="p-button-primary" />
      </div>
    </div>
    
    <div class="features">
      <div class="feature-card">
        <i class="pi pi-bolt feature-icon"></i>
        <h3>Vue 3 + TypeScript</h3>
        <p>Modern frontend framework with strong typing</p>
      </div>
      <div class="feature-card">
        <i class="pi pi-palette feature-icon"></i>
        <h3>PrimeVue Components</h3>
        <p>Rich UI component library with clean design</p>
      </div>
      <div class="feature-card">
        <i class="pi pi-database feature-icon"></i>
        <h3>Pinia Store</h3>
        <p>Type-safe and intuitive state management</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
</script>

<style scoped>
.home {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.card {
  padding: 2rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  margin-top: 2rem;
}

.actions {
  margin-top: 1.5rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  padding: 2rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}
</style> 