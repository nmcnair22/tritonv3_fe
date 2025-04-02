import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
  // State
  const isVisible = ref(true);
  const isMobileView = ref(false);
  const sidebarWasVisibleBeforeResize = ref(true);
  
  // Methods
  const toggleSidebar = () => {
    isVisible.value = !isVisible.value;
    
    // Save state for mobile view toggling
    if (!isMobileView.value) {
      sidebarWasVisibleBeforeResize.value = isVisible.value;
    }
  };
  
  const showSidebar = () => {
    isVisible.value = true;
  };
  
  const hideSidebar = () => {
    isVisible.value = false;
  };
  
  const setMobileView = (isMobile: boolean) => {
    // When transitioning between views
    if (isMobile !== isMobileView.value) {
      if (isMobile) {
        // Moving to mobile view
        sidebarWasVisibleBeforeResize.value = isVisible.value;
        isVisible.value = false;
      } else {
        // Moving to desktop view
        isVisible.value = sidebarWasVisibleBeforeResize.value;
      }
      
      isMobileView.value = isMobile;
    }
  };
  
  return {
    isVisible,
    isMobileView,
    sidebarWasVisibleBeforeResize,
    toggleSidebar,
    showSidebar,
    hideSidebar,
    setMobileView
  };
});