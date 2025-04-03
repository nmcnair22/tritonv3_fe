<!-- src/components/finance/dashboard/MetricsCards.vue -->
<template>
    <Card v-if="!loading && !error">
      <template #title>{{ title }}</template>
      <template #content>
        <p class="text-2xl font-bold">{{ formatCurrency(value) }}</p>
        <p :class="change >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ formatPercentage(change) }} from last period
        </p>
      </template>
    </Card>
    <div v-else-if="loading" class="p-4">Loading...</div>
    <div v-else class="p-4 text-red-600">{{ error }}</div>
  </template>
  
  <script setup>
  import { computed, onMounted } from 'vue';
  import { useFinanceStore } from '../../../stores/finance';
  import Card from 'primevue/card';
  
  const props = defineProps({
    metric: { type: String, required: true },
  });
  
  const financeStore = useFinanceStore();
  
  const loading = computed(() => financeStore.isLoading);
  const error = computed(() => financeStore.error);
  
  // Make sure we initialize the store metrics
  onMounted(() => {
    console.log(`[MetricsCards-${props.metric}] Component mounted`);
    if (!financeStore.metrics) {
      console.log(`[MetricsCards-${props.metric}] No metrics data, fetching...`);
      financeStore.fetchAllData();
    }
  });
  
  const title = computed(() => ({
    revenue: 'Total Revenue',
    expenses: 'Total Expenses',
    profit: 'Net Profit',
    cashflow: 'Cash Flow',
  }[props.metric]));
  
  const value = computed(() => {
    if (!financeStore.metrics) return 0;
    
    return {
      revenue: financeStore.metrics.total_revenue,
      expenses: financeStore.metrics.total_expenses,
      profit: financeStore.metrics.net_profit,
      cashflow: financeStore.metrics.cash_flow,
    }[props.metric] || 0;
  });
  
  const change = computed(() => {
    if (!financeStore.metrics) return 0;
    
    const current = value.value || 0;
    const previous = {
      revenue: financeStore.metrics.previous_total_revenue,
      expenses: financeStore.metrics.previous_total_expenses,
      profit: financeStore.metrics.previous_net_profit,
      cashflow: financeStore.metrics.previous_cash_flow,
    }[props.metric] || 0;
    
    return previous ? ((current - previous) / previous) * 100 : 0;
  });
  
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  const formatPercentage = (val) => `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
  </script>