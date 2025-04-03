<!-- src/components/finance/dashboard/RecentTransactions.vue -->
<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <DataTable v-else :value="transactions" :paginator="true" :rows="5" responsiveLayout="scroll">
      <Column field="date" header="Date" sortable></Column>
      <Column field="invoice_number" header="Invoice Number" sortable></Column>
      <Column field="customer" header="Customer" sortable></Column>
      <Column field="amount" header="Amount" sortable :body="row => formatCurrency(row.amount)"></Column>
      <Column field="status" header="Status" sortable></Column>
    </DataTable>
  </template>
  
  <script setup>
  import { computed, onMounted } from 'vue';
  import { useFinanceStore } from '../../../stores/finance';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  
  const financeStore = useFinanceStore();
  const transactions = computed(() => financeStore.recentTransactions || []);
  const loading = computed(() => financeStore.isLoading);
  const error = computed(() => financeStore.error);
  
  // Make sure we initialize the store data
  onMounted(() => {
    console.log('[RecentTransactions] Component mounted');
    financeStore.fetchAllData();
  });
  
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  </script>