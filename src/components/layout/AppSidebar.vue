<template>
  <Drawer
    v-model:visible="sidebarVisible"
    :pt="{
      root: 'app-sidebar',
      header: 'app-sidebar-header',
      content: 'app-sidebar-content'
    }"
    :modal="false"
    :showCloseIcon="false"
    position="left"
  >
    <template #header>
      <div class="sidebar-logo">
        <img src="@/assets/images/logo.png" alt="Triton Logo" class="logo-image" />
        <span class="logo-text">Triton V3</span>
      </div>
    </template>

    <div class="sidebar-menu">
      <div 
        v-for="item in menuItems" 
        :key="item.path" 
        @click="navigateTo(item.path)"
        :class="['menu-item', { active: isActive(item.path) }]"
      >
        <i :class="['menu-icon', item.icon]"></i>
        <span class="menu-label">{{ item.label }}</span>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible'])

const router = useRouter()
const route = useRoute()
const sidebarStore = useSidebarStore()

const sidebarVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const menuItems = ref([
  { label: 'Dashboard', icon: 'pi pi-home', path: '/' },
  { label: 'Profile', icon: 'pi pi-user', path: '/profile' },
  { label: 'Settings', icon: 'pi pi-cog', path: '/settings' }
])

const navigateTo = (path: string) => {
  router.push(path)
  if (window.innerWidth < 768) {
    sidebarVisible.value = false
  }
}

const isActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
.app-sidebar :deep(.p-sidebar-content) {
  padding: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
}

.logo-image {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
}

.sidebar-menu {
  padding: 1rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: var(--p-surface-100);
}

.menu-item.active {
  background-color: var(--p-primary-50);
  color: var(--p-primary-500);
}

.menu-icon {
  font-size: 1.25rem;
}

.menu-label {
  font-size: 1rem;
}
</style> 