<template>
  <footer class="app-footer">
    <p class="copyright">© {{ currentYear }} Triton V3. All rights reserved.</p>
    <div class="footer-links">
      <a href="#" class="footer-link">Privacy Policy</a>
      <a href="#" class="footer-link">Terms of Service</a>
      <a href="#" class="footer-link">Contact</a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--p-surface-0);
  border-top: 1px solid var(--p-surface-200);
  font-size: 0.875rem;
}

.copyright {
  margin: 0;
  color: var(--p-surface-700);
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: var(--p-primary-500);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--p-primary-600);
  text-decoration: underline;
}

@media (max-width: 640px) {
  .app-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style> 