<!-- src/components/finance/dashboard/TrendCharts.vue -->
<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <Chart v-else :type="chartType" :data="chartData" :options="chartOptions" />
  </template>
  
  <script setup>
  import { computed, onMounted } from 'vue';
  import { useFinanceStore } from '../../../stores/finance';
  import Chart from 'primevue/chart';
  
  const props = defineProps({
    chartType: { type: String, required: true },
  });
  
  const financeStore = useFinanceStore();
  const loading = computed(() => financeStore.isLoading);
  const error = computed(() => financeStore.error);
  
  // Make sure we initialize the store data
  onMounted(() => {
    console.log(`[TrendCharts-${props.chartType}] Component mounted`);
    financeStore.fetchAllData();
  });
  
  const chartType = computed(() => ({
    revenueTrend: 'line',
    expensesByCategory: 'bar',
    revenueBySource: 'pie',
  }[props.chartType]));
  
  const chartData = computed(() => {
    if (props.chartType === 'revenueTrend') {
      const data = financeStore.revenueTrend || [];
      return {
        labels: data.map(item => item.period),
        datasets: [{
          label: 'Revenue',
          data: data.map(item => item.revenue),
          borderColor: '#42A5F5',
          tension: 0.4,
        }],
      };
    } else if (props.chartType === 'expensesByCategory') {
      const data = financeStore.expensesByCategory || [];
      return {
        labels: data.map(item => item.category),
        datasets: [{
          label: 'Expenses',
          data: data.map(item => item.amount),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }],
      };
    } else {
      const data = financeStore.revenueBySource || [];
      return {
        labels: data.map(item => item.source),
        datasets: [{
          data: data.map(item => item.revenue),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }],
      };
    }
  });
  
  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: props.chartType === 'revenueBySource' ? 'bottom' : 'top' } },
  };
  </script>