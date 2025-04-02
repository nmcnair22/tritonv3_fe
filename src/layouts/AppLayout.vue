<template>
  <div class="layout-wrapper" :class="{ 'sidebar-collapsed': !isSidebarExpanded }">
    <!-- Sidebar component -->
    <div class="sidebar" :class="{ 'collapsed': !isSidebarExpanded, 'expanded': isMobile && isSidebarExpanded }">
      <AppSidebar :expanded="isSidebarExpanded" @toggle="toggleSidebar" />
    </div>
    
    <!-- Main content area -->
    <div class="main-content">
      <!-- Header -->
      <AppHeader @toggle-sidebar="toggleSidebar" />
      
      <!-- Page content -->
      <div class="content-wrapper">
        <router-view></router-view>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <div class="copyright">
          TritonV3 © {{ currentYear }} All rights reserved
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import AppSidebar from '../components/layout/AppSidebar.vue';
import AppHeader from '../components/layout/AppHeader.vue';

// State
const isSidebarExpanded = ref(true);
const isMobile = ref(false);

// Computed
const currentYear = computed(() => new Date().getFullYear());

// Methods
const toggleSidebar = () => {
  isSidebarExpanded.value = !isSidebarExpanded.value;
};

const checkMobile = () => {
  isMobile.value = window.innerWidth < 992;
  if (isMobile.value) {
    isSidebarExpanded.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style>
:root {
  /* Brand Colors */
  --night-sky: #0B2244;
  --sunrise-yellow: #FFB400;
  --morning-blue: #297FB7;
  /* UI Colors */
  --white: #FFFFFF;
  --light-gray: #F5F5F5;
  --medium-gray: #E0E0E0;
  --dark-gray: #757575;
  /* Layout */
  --sidebar-width: 234px;
  --sidebar-collapsed-width: 60px;
  --header-height: 56px;
  --content-padding: 24px;
}

/* Layout Styles */
.layout-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: var(--light-gray);
}

.sidebar {
  width: var(--sidebar-width);
  background-color: var(--night-sky);
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: width 0.3s ease, transform 0.3s ease;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.sidebar-collapsed .main-content {
  margin-left: var(--sidebar-collapsed-width);
}

.content-wrapper {
  flex: 1;
  padding: var(--content-padding);
  overflow-y: auto;
  background-color: white;
  min-height: 300px;
}

.footer {
  padding: 16px var(--content-padding);
  border-top: 1px solid var(--medium-gray);
  background-color: var(--white);
  font-size: 0.85rem;
  color: var(--dark-gray);
}

/* Responsive styles */
@media (max-width: 991px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.expanded {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0 !important;
  }
}
</style>