<template>
  <div class="sidebar-container">
    <!-- Logo/Brand section -->
    <div class="brand">
      <img 
        v-if="expanded"
        src="/images/logos/logo-cis-dark.png" 
        alt="Company Logo" 
        class="logo-full" 
      />
      <img 
        v-else
        src="/images/logos/logo-cis-icon.png" 
        alt="Company Logo" 
        class="logo-icon" 
      />
    </div>
    
    <!-- Toggle button when collapsed -->
    <button v-if="!expanded" class="toggle-collapsed" @click="$emit('toggle')">
      <i class="pi pi-chevron-right"></i>
    </button>
    
    <!-- Navigation -->
    <nav class="navigation">
      <ul>
        <!-- Dashboard -->
        <li>
          <router-link to="/dashboard" :class="{ 'active': isActive('/dashboard'), 'collapsed': !expanded }">
            <i class="pi pi-home"></i>
            <span v-if="expanded">Dashboard</span>
          </router-link>
        </li>
        
        <!-- Analytics -->
        <li>
          <router-link to="/analytics" :class="{ 'active': isActive('/analytics'), 'collapsed': !expanded }">
            <i class="pi pi-chart-bar"></i>
            <span v-if="expanded">Analytics</span>
          </router-link>
        </li>
        
        <!-- Projects -->
        <li>
          <div 
            class="menu-item" 
            :class="{ 'active': isActive('/projects'), 'collapsed': !expanded }"
            @click="toggleSubmenu('projects')"
          >
            <div class="item-content">
              <i class="pi pi-briefcase"></i>
              <span v-if="expanded">Projects</span>
            </div>
            <i v-if="expanded" class="pi submenu-icon" :class="isSubmenuOpen('projects') ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
          </div>
          
          <!-- Projects Submenu -->
          <div v-if="expanded && isSubmenuOpen('projects')" class="submenu">
            <router-link to="/projects" class="submenu-item" :class="{ 'active': route.path === '/projects' }">
              All Projects
            </router-link>
            <router-link to="/projects/create" class="submenu-item" :class="{ 'active': route.path === '/projects/create' }">
              Create New
            </router-link>
          </div>
        </li>
        
        <!-- Team -->
        <li>
          <router-link to="/team" :class="{ 'active': isActive('/team'), 'collapsed': !expanded }">
            <i class="pi pi-users"></i>
            <span v-if="expanded">Team</span>
          </router-link>
        </li>
        
        <!-- Messages -->
        <li>
          <router-link to="/messages" :class="{ 'active': isActive('/messages'), 'collapsed': !expanded }">
            <i class="pi pi-comments"></i>
            <span v-if="expanded">Messages</span>
            <!-- Only show badge when expanded -->
            <span v-if="expanded && unreadMessages > 0" class="badge">{{ unreadMessages }}</span>
          </router-link>
        </li>
      </ul>
      
      <!-- Divider -->
      <div class="divider"></div>
      
      <!-- Settings & Support -->
      <ul>
        <li>
          <router-link to="/settings" :class="{ 'active': isActive('/settings'), 'collapsed': !expanded }">
            <i class="pi pi-cog"></i>
            <span v-if="expanded">Settings</span>
          </router-link>
        </li>
        <li>
          <router-link to="/support" :class="{ 'active': isActive('/support'), 'collapsed': !expanded }">
            <i class="pi pi-question-circle"></i>
            <span v-if="expanded">Help & Support</span>
          </router-link>
        </li>
      </ul>
    </nav>
    
    <!-- User profile section at bottom -->
    <div class="user-profile-wrapper">
      <!-- User profile when expanded -->
      <div v-if="expanded" class="user-profile">
        <div class="avatar">
          <span>{{ userInitials }}</span>
        </div>
        <div class="user-info">
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ userRole }}</div>
        </div>
        <button class="toggle-expand" @click="$emit('toggle')">
          <i class="pi pi-chevron-left"></i>
        </button>
      </div>
      
      <!-- User avatar only when collapsed -->
      <div v-else class="user-profile-collapsed">
        <div class="avatar">
          <span>{{ userInitials }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

// Props
const props = defineProps({
  expanded: {
    type: Boolean,
    default: true
  }
});

// Emits
defineEmits(['toggle']);

// Route
const route = useRoute();

// State
const openSubmenus = ref<string[]>(['projects']); // Initially open submenus
const unreadMessages = ref(3); // Unread message count

// Mock user data
const userName = ref('John Doe');
const userRole = ref('Administrator');
const userInitials = computed(() => {
  const nameParts = userName.value.split(' ');
  return nameParts.map(part => part[0]).join('');
});

// Methods
const isActive = (path: string) => {
  return route.path.startsWith(path);
};

const toggleSubmenu = (menu: string) => {
  if (openSubmenus.value.includes(menu)) {
    openSubmenus.value = openSubmenus.value.filter(item => item !== menu);
  } else {
    openSubmenus.value.push(menu);
  }
};

const isSubmenuOpen = (menu: string) => {
  return openSubmenus.value.includes(menu);
};
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: white;
}

/* Brand section */
.brand {
  padding: 16px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  height: 32px;
  width: auto;
}

.logo-full {
  height: 28px;
  width: auto;
}

.logo-icon {
  height: 32px;
  width: auto;
}

/* Toggle button when collapsed */
.toggle-collapsed {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 8px;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 8px;
  margin-bottom: 8px;
}

.toggle-collapsed:hover {
  opacity: 1;
}

/* Navigation */
.navigation {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.navigation ul {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.menu-item, .navigation a {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 4px;
  margin-bottom: 4px;
  transition: background-color 0.2s;
  cursor: pointer;
}

.menu-item {
  justify-content: space-between;
}

.menu-item .item-content {
  display: flex;
  align-items: center;
}

.navigation a:hover, .menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navigation a.active, .menu-item.active {
  background-color: rgba(255, 255, 255, 0.15);
}

.navigation i {
  margin-right: 12px;
  font-size: 18px;
}

.submenu-icon {
  margin-right: 0 !important;
  font-size: 14px !important;
}

/* Collapsed menu items */
.navigation a.collapsed {
  justify-content: center;
  padding: 12px 0;
}

.navigation a.collapsed i {
  margin-right: 0;
}

/* Submenu */
.submenu {
  margin-top: 4px;
  margin-bottom: 8px;
  margin-left: 32px;
}

.submenu-item {
  display: block;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
  margin-bottom: 2px;
  font-size: 14px;
}

.submenu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.submenu-item.active {
  background-color: rgba(255, 255, 255, 0.15);
}

/* Badge */
.badge {
  background-color: var(--sunrise-yellow, #FFB400);
  color: var(--night-sky, #0B2244);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: auto;
}

/* Divider */
.divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
}

/* User profile section at bottom */
.user-profile-wrapper {
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  padding: 16px;
  position: relative;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: var(--morning-blue, #297FB7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
}

.user-info {
  margin-left: 12px;
  flex: 1;
  overflow: hidden;
}

.user-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 12px;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toggle-expand {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 0;
}

.toggle-expand:hover {
  opacity: 1;
}

/* Collapsed user profile */
.user-profile-collapsed {
  padding: 16px 0;
  display: flex;
  justify-content: center;
}
</style>