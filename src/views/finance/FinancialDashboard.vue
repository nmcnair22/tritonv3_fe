<!-- src/views/finance/FinancialDashboard.vue -->
<template>
  <div class="layout">
    <Menubar :model="menuItems" class="header" />
    <Drawer v-model:visible="sidebarVisible" :baseZIndex="1000" position="left">
      <h3>Navigation</h3>
      <ul>
        <li>Dashboard</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </Drawer>
    <div class="main-content p-3">
      <DateRangeFilter />
      <div class="grid">
        <div class="col-12 md:col-6 lg:col-3" v-for="metric in ['revenue', 'expenses', 'profit', 'cashflow']" :key="metric">
          <MetricsCards :metric="metric" />
        </div>
      </div>
      <div class="grid">
        <div class="col-12 md:col-4" v-for="chart in ['revenueTrend', 'expensesByCategory', 'revenueBySource']" :key="chart">
          <TrendCharts :chart-type="chart" />
        </div>
      </div>
      <RecentTransactions />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Menubar from 'primevue/menubar';
import Drawer from 'primevue/drawer';
import DateRangeFilter from '../../components/finance/dashboard/DateRangeFilter.vue';
import MetricsCards from '../../components/finance/dashboard/MetricsCards.vue';
import TrendCharts from '../../components/finance/dashboard/TrendCharts.vue';
import RecentTransactions from '../../components/finance/dashboard/RecentTransactions.vue';
import { useFinanceStore } from '../../stores/finance';

const menuItems = ref([
  { label: 'Home', icon: 'pi pi-home' },
  { label: 'Settings', icon: 'pi pi-cog' },
  { label: 'Logout', icon: 'pi pi-sign-out' },
]);

const sidebarVisible = ref(false);
const financeStore = useFinanceStore();

onMounted(() => {
  console.log('[FinancialDashboard] Component mounted');
});
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.header {
  border-bottom: 1px solid #e0e0e0;
}
.main-content {
  flex: 1;
}
.grid {
  margin-bottom: 2rem;
}
</style>