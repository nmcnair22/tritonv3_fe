<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue'

const route = useRoute()

// Only show layout for authenticated routes
const showLayout = computed(() => {
  // Skip layout for login and error pages
  return !route.meta.guest && route.name !== 'NotFound'
})
</script>

<template>
  <AppLayout v-if="showLayout">
    <router-view />
  </AppLayout>
  <router-view v-else />
</template>

<style>
/* App-specific styles only - global styles are in main.css */
</style>
