<template>
  <div class="financial-reports">
    <div class="card">
      <h1>Financial Reports</h1>
      
      <div class="p-fluid grid">
        <div class="col-12 md:col-3">
          <label for="reportType" class="block mb-2">Report Type</label>
          <Select
            id="reportType"
            v-model="filters.reportType"
            :options="reportTypes"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
        
        <div class="col-12 md:col-3">
          <label for="dateRange" class="block mb-2">Period</label>
          <Select
            id="dateRange"
            v-model="filters.dateRange"
            :options="dateRanges"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
        
        <div v-if="filters.dateRange === 'custom'" class="col-12 md:col-6">
          <label class="block mb-2">Custom Range</label>
          <div class="flex gap-2">
            <InputText
              type="date"
              v-model="filters.startDate"
              placeholder="Start Date"
              class="w-full"
            />
            <InputText
              type="date"
              v-model="filters.endDate"
              placeholder="End Date"
              class="w-full"
            />
          </div>
        </div>
        
        <div class="col-12 md:col-3">
          <label for="comparison" class="block mb-2">Comparison</label>
          <Select
            id="comparison"
            v-model="filters.comparison"
            :options="comparisonOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
      </div>
      
      <div class="flex justify-content-end mt-4">
        <Button
          label="Generate Report"
          icon="pi pi-refresh"
          @click="generateReport"
          :loading="financeStore.isLoading"
        />
      </div>
    </div>
    
    <div v-if="financeStore.error" class="p-message p-message-error mt-4">
      {{ financeStore.error }}
    </div>
    
    <div v-if="financeStore.reportData" class="card mt-4">
      <div class="flex justify-content-end mb-4">
        <Button icon="pi pi-print" label="Print" class="p-button-secondary mr-2" @click="printReport" />
        <Button icon="pi pi-file-pdf" label="Export PDF" class="p-button-secondary mr-2" @click="exportPdf" />
        <Button icon="pi pi-file-excel" label="Export Excel" class="p-button-secondary" @click="exportExcel" />
      </div>
      
      <component 
        :is="reportComponent" 
        :reportData="financeStore.reportData" 
        :filters="filters"
        :isLoading="financeStore.isLoading"
      />
    </div>
    
    <div v-else-if="!financeStore.isLoading && !financeStore.error" class="card mt-4 text-center p-4">
      <i class="pi pi-file text-4xl text-500 mb-4"></i>
      <p class="text-700">Select parameters and click "Generate Report" to view financial data.</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useFinanceStore } from '@/stores/finance';
import Button from 'primevue/button';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import BalanceSheetReport from '@/components/finance/reports/BalanceSheetReport.vue';
import IncomeStatementReport from '@/components/finance/reports/IncomeStatementReport.vue';
import CashFlowReport from '@/components/finance/reports/CashFlowReport.vue';
import RetainedEarningsReport from '@/components/finance/reports/RetainedEarningsReport.vue';
import TrialBalanceReport from '@/components/finance/reports/TrialBalanceReport.vue';

// Initialize finance store
const financeStore = useFinanceStore();

// Options for dropdowns
const reportTypes = [
  { label: 'Balance Sheet', value: 'balanceSheet' },
  { label: 'Income Statement', value: 'incomeStatement' },
  { label: 'Cash Flow', value: 'cashFlow' },
  { label: 'Retained Earnings', value: 'retainedEarnings' },
  { label: 'Trial Balance', value: 'trialBalance' }
];

const dateRanges = [
  { label: 'This Month', value: 'month' },
  { label: 'This Quarter', value: 'quarter' },
  { label: 'Year to Date', value: 'ytd' },
  { label: 'Fiscal Year', value: 'fiscal' },
  { label: 'Custom Range', value: 'custom' }
];

const comparisonOptions = [
  { label: 'None', value: 'none' },
  { label: 'Previous Period', value: 'previous' },
  { label: 'Budget', value: 'budget' },
  { label: 'Year over Year', value: 'yoy' }
];

// State
const filters = reactive({
  reportType: 'balanceSheet',
  dateRange: 'month',
  startDate: '',
  endDate: '',
  comparison: 'none'
});

// Computed properties
const reportComponent = computed(() => {
  switch (filters.reportType) {
    case 'balanceSheet': return BalanceSheetReport;
    case 'incomeStatement': return IncomeStatementReport;
    case 'cashFlow': return CashFlowReport;
    case 'retainedEarnings': return RetainedEarningsReport;
    case 'trialBalance': return TrialBalanceReport;
    default: return null;
  }
});

// Methods
function initializeDateRange() {
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  filters.endDate = endDate;
  
  const startDate = new Date(today);
  
  switch (filters.dateRange) {
    case 'month':
      startDate.setDate(1);
      break;
    case 'quarter':
      startDate.setMonth(Math.floor(today.getMonth() / 3) * 3, 1);
      break;
    case 'ytd':
      startDate.setMonth(0, 1);
      break;
    case 'fiscal':
      if (today.getMonth() < 3) {
        startDate.setFullYear(startDate.getFullYear() - 1, 3, 1);
      } else {
        startDate.setMonth(3, 1);
      }
      break;
    default:
      startDate.setDate(today.getDate() - 30);
  }
  
  filters.startDate = startDate.toISOString().split('T')[0];
}

async function generateReport() {
  try {
    switch (filters.reportType) {
      case 'balanceSheet':
        await financeStore.fetchBalanceSheet(filters.endDate);
        break;
      case 'incomeStatement':
        await financeStore.fetchIncomeStatement(filters.startDate, filters.endDate);
        break;
      case 'cashFlow':
        await financeStore.fetchCashFlowStatement(filters.startDate, filters.endDate);
        break;
      case 'retainedEarnings':
        await financeStore.fetchRetainedEarnings(filters.endDate);
        break;
      case 'trialBalance':
        await financeStore.fetchTrialBalance(filters.endDate);
        break;
    }
  } catch (err) {
    console.error(`Error generating ${filters.reportType}:`, err);
  }
}

function printReport() {
  window.print();
}

function exportPdf() {
  // TODO: Implement PDF export
}

function exportExcel() {
  // TODO: Implement Excel export
}

// Lifecycle hooks
onMounted(() => {
  initializeDateRange();
});
</script>

<style>
.financial-reports {
  padding: 1.5rem;
}

@media print {
  .financial-reports {
    padding: 0;
  }
  
  .report-filters,
  .report-actions {
    display: none;
  }
}
</style>