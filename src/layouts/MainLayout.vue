<template>
  <div class="layout-container">
    <div class="layout-sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <Button 
          icon="pi pi-bars" 
          class="p-button-text p-button-rounded sidebar-toggle" 
          @click="toggleSidebar"
        />
      </div>
      <div class="sidebar-content">
        <div class="menu-item" @click="navigateTo('/')">
          <i class="pi pi-home"></i>
          <span v-if="!isSidebarCollapsed">Home</span>
        </div>
        <div class="menu-item" @click="navigateTo('/dashboard')">
          <i class="pi pi-chart-bar"></i>
          <span v-if="!isSidebarCollapsed">Dashboard</span>
        </div>
        <div class="menu-item" @click="navigateTo('/settings')">
          <i class="pi pi-cog"></i>
          <span v-if="!isSidebarCollapsed">Settings</span>
        </div>
      </div>
    </div>
    <div class="layout-main">
      <div class="layout-header">
        <h2>{{ title }}</h2>
        <div class="user-menu">
          <span>{{ user?.name || 'Guest' }}</span>
          <Button 
            icon="pi pi-user" 
            class="p-button-text p-button-rounded" 
            @click="showUserMenu = !showUserMenu"
          />
          <div v-if="showUserMenu" class="user-dropdown">
            <div class="dropdown-item" @click="navigateTo('/profile')">Profile</div>
            <div class="dropdown-item" @click="logout">Logout</div>
          </div>
        </div>
      </div>
      <div class="layout-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import { useLocalStorage } from '@vueuse/core'
import { useAuth } from '../composables/useAuth'

const props = defineProps<{
  title?: string
}>()

const router = useRouter()
const route = useRoute()
const { currentUser: user, logout: signOut } = useAuth()

const isSidebarCollapsed = useLocalStorage('sidebar_collapsed', false)
const showUserMenu = ref(false)

const title = computed(() => props.title || route.meta.title || 'Triton V3')

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

function navigateTo(path: string) {
  router.push(path)
  showUserMenu.value = false
}

function logout() {
  signOut()
  router.push('/login')
  showUserMenu.value = false
}
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
}

.layout-sidebar {
  width: 240px;
  background-color: #2c3e50;
  color: white;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
}

.layout-sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
}

.sidebar-toggle {
  color: white !important;
}

.sidebar-content {
  padding: 1rem 0;
}

.menu-item {
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-header {
  padding: 1rem 2rem;
  background-color: white;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 160px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 10;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.layout-content {
  padding: 2rem;
  flex: 1;
  overflow: auto;
}
</style> 