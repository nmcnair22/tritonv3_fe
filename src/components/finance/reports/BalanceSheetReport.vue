// Very first script
console.log('<<<< BALANCE SHEET REPORT COMPONENT LOADED >>>>');

<template>
  <div class="balance-sheet-report">
    <h2>Balance Sheet</h2>
    <div v-if="isLoading" class="loading">Loading balance sheet data...</div>
    <div v-else-if="!reportData" class="no-data">No balance sheet data available.</div>
    <div v-else>
      <div class="report-header">
        <h3>Balance Sheet as of {{ formattedDate }}</h3>
        <div class="report-meta">Company: {{ companyName }}</div>
      </div>
      
      <!-- Debug info -->
      <div class="debug-info" v-if="isDevelopment">
        <h4>Debug Information</h4>
        <pre>{{ JSON.stringify(reportData, null, 2) }}</pre>
      </div>
      
      <!-- Actual report content -->
      <table class="report-table">
        <thead>
          <tr>
            <th>Account</th>
            <th class="amount">Amount</th>
            <th v-if="hasComparison" class="amount">{{ comparisonLabel }}</th>
            <th v-if="hasComparison" class="amount">Variance</th>
          </tr>
        </thead>
        <tbody>
          <!-- Assets -->
          <tr class="section-header">
            <td colspan="4">Assets</td>
          </tr>
          
          <template v-if="reportData.assets && reportData.assets.length">
            <tr v-for="(item, index) in reportData.assets" :key="'asset-'+index">
              <td :class="{ 'account-total': item.isTotal }">{{ item.accountName }}</td>
              <td class="amount" :class="{ 'account-total': item.isTotal }">{{ formatCurrency(item.amount) }}</td>
              <td v-if="hasComparison" class="amount" :class="{ 'account-total': item.isTotal }">
                {{ formatCurrency(item.comparisonAmount) }}
              </td>
              <td v-if="hasComparison" class="amount" :class="{ 'account-total': item.isTotal }">
                {{ formatCurrency(item.variance) }}
              </td>
            </tr>
          </template>
          <tr v-else class="no-data-row">
            <td colspan="4">No asset data available</td>
          </tr>
          
          <!-- Total Assets -->
          <tr class="total-row">
            <td>Total Assets</td>
            <td class="amount">{{ formatCurrency(totalAssets) }}</td>
            <td v-if="hasComparison" class="amount">{{ formatCurrency(totalAssetsComparison) }}</td>
            <td v-if="hasComparison" class="amount">{{ formatCurrency(totalAssetsVariance) }}</td>
          </tr>
          
          <!-- Liabilities -->
          <tr class="section-header">
            <td colspan="4">Liabilities</td>
          </tr>
          
          <template v-if="reportData.liabilities && reportData.liabilities.length">
            <tr v-for="(item, index) in reportData.liabilities" :key="'liability-'+index">
              <td :class="{ 'account-total': item.isTotal }">{{ item.accountName }}</td>
              <td class="amount" :class="{ 'account-total': item.isTotal }">{{ formatCurrency(item.amount) }}</td>
              <td v-if="hasComparison" class="amount" :class="{ 'account-total': item.isTotal }">
                {{ formatCurrency(item.comparisonAmount) }}
              </td>
              <td v-if="hasComparison" class="amount" :class="{ 'account-total': item.isTotal }">
                {{ formatCurrency(item.variance) }}
              </td>
            </tr>
          </template>
          <tr v-else class="no-data-row">
            <td colspan="4">No liability data available</td>
          </tr>
          
          <!-- Total Liabilities -->
          <tr class="total-row">
            <td>Total Liabilities</td>
            <td class="amount">{{ formatCurrency(totalLiabilities) }}</td>
            <td v-if="hasComparison" class="amount">{{ formatCurrency(totalLiabilitiesComparison) }}</td>
            <td v-if="hasComparison" class="amount">{{ formatCurrency(totalLiabilitiesVariance) }}</td>
          </tr>
          
          <!-- Equity -->
          <tr class="section-header">
            <td colspan="4">Equity</td>
          </tr>
          
          <template v-if="reportData.equity && reportData.equity.length">
            <tr v-for="(item, index) in reportData.equity" :key="'equity-'+index">
              <td :class="{ 'account-total': item.isTotal }">{{ item.accountName }}</td>
              <td class="amount" :class="{ 'account-total': item.isTotal }">{{ formatCurrency(item.amount) }}</td>
              <td v-if="hasComparison" class="amount" :class="{ 'account-total': item.isTotal }">
                {{ formatCurrency(item.comparisonAmount) }}
              </td>
              <td v-if="hasComparison" class="amount" :class="{ 'account-total': item.isTotal }">
                {{ formatCurrency(item.variance) }}
              </td>
            </tr>
          </template>
          <tr v-else class="no-data-row">
            <td colspan="4">No equity data available</td>
          </tr>
          
          <!-- Total Equity -->
          <tr class="total-row">
            <td>Total Equity</td>
            <td class="amount">{{ formatCurrency(totalEquity) }}</td>
            <td v-if="hasComparison" class="amount">{{ formatCurrency(totalEquityComparison) }}</td>
            <td v-if="hasComparison" class="amount">{{ formatCurrency(totalEquityVariance) }}</td>
          </tr>
          
          <!-- Total Liabilities and Equity -->
          <tr class="grand-total-row">
            <td>Total Liabilities and Equity</td>
            <td class="amount">{{ formatCurrency(totalLiabilitiesAndEquity) }}</td>
            <td v-if="hasComparison" class="amount">{{ formatCurrency(totalLiabilitiesAndEquityComparison) }}</td>
            <td v-if="hasComparison" class="amount">{{ formatCurrency(totalLiabilitiesAndEquityVariance) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';

// Development flag
const isDevelopment = import.meta.env.MODE === 'development';

// Log component initialization
console.log('[BALANCE SHEET REPORT] Component setup starting');

// Props
const props = defineProps({
  reportData: {
    type: Object,
    default: null
  },
  filters: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

// Log props received
console.log('[BALANCE SHEET REPORT] Props received:', {
  hasReportData: !!props.reportData,
  filters: props.filters,
  isLoading: props.isLoading
});

// Computed properties
const formattedDate = computed(() => {
  if (!props.filters.endDate) return 'N/A';
  
  // Format date as MM/DD/YYYY
  const date = new Date(props.filters.endDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

const companyName = computed(() => {
  // Find company name from filters.companyId
  return 'Sample Company'; // Replace with actual company name lookup
});

// Debug raw data
console.log('[BALANCE SHEET REPORT] Report data:', props.reportData);

// Comparison flags
const hasComparison = computed(() => props.filters.comparison !== 'none');

const comparisonLabel = computed(() => {
  switch (props.filters.comparison) {
    case 'previous':
      return 'Previous Period';
    case 'budget':
      return 'Budget';
    case 'yoy':
      return 'Year over Year';
    default:
      return '';
  }
});

// Totals
const totalAssets = computed(() => {
  if (!props.reportData || !props.reportData.assets) return 0;
  return props.reportData.assets.reduce((sum, item) => 
    item.isTotal ? sum + parseFloat(item.amount || 0) : sum, 0);
});

const totalAssetsComparison = computed(() => {
  if (!hasComparison.value || !props.reportData || !props.reportData.assets) return 0;
  return props.reportData.assets.reduce((sum, item) => 
    item.isTotal ? sum + parseFloat(item.comparisonAmount || 0) : sum, 0);
});

const totalAssetsVariance = computed(() => {
  return totalAssets.value - totalAssetsComparison.value;
});

const totalLiabilities = computed(() => {
  if (!props.reportData || !props.reportData.liabilities) return 0;
  return props.reportData.liabilities.reduce((sum, item) => 
    item.isTotal ? sum + parseFloat(item.amount || 0) : sum, 0);
});

const totalLiabilitiesComparison = computed(() => {
  if (!hasComparison.value || !props.reportData || !props.reportData.liabilities) return 0;
  return props.reportData.liabilities.reduce((sum, item) => 
    item.isTotal ? sum + parseFloat(item.comparisonAmount || 0) : sum, 0);
});

const totalLiabilitiesVariance = computed(() => {
  return totalLiabilities.value - totalLiabilitiesComparison.value;
});

const totalEquity = computed(() => {
  if (!props.reportData || !props.reportData.equity) return 0;
  return props.reportData.equity.reduce((sum, item) => 
    item.isTotal ? sum + parseFloat(item.amount || 0) : sum, 0);
});

const totalEquityComparison = computed(() => {
  if (!hasComparison.value || !props.reportData || !props.reportData.equity) return 0;
  return props.reportData.equity.reduce((sum, item) => 
    item.isTotal ? sum + parseFloat(item.comparisonAmount || 0) : sum, 0);
});

const totalEquityVariance = computed(() => {
  return totalEquity.value - totalEquityComparison.value;
});

const totalLiabilitiesAndEquity = computed(() => {
  return totalLiabilities.value + totalEquity.value;
});

const totalLiabilitiesAndEquityComparison = computed(() => {
  return totalLiabilitiesComparison.value + totalEquityComparison.value;
});

const totalLiabilitiesAndEquityVariance = computed(() => {
  return totalLiabilitiesVariance.value + totalEquityVariance.value;
});

// Format currency values
const formatCurrency = (value) => {
  const numValue = parseFloat(value || 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numValue);
};

// Lifecycle hooks
onMounted(() => {
  console.log('[BALANCE SHEET REPORT] Component mounted');
  console.log('[BALANCE SHEET REPORT] Report data available:', !!props.reportData);
});
</script>

<style scoped>
.balance-sheet-report {
  width: 100%;
}

.report-header {
  margin-bottom: 20px;
  text-align: center;
}

.report-header h3 {
  margin-bottom: 5px;
  font-size: 1.4rem;
  color: var(--text-color-primary);
}

.report-meta {
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.report-table th,
.report-table td {
  padding: 8px 12px;
  border: 1px solid var(--surface-border);
  text-align: left;
}

.report-table thead th {
  background-color: var(--surface-500);
  color: var(--text-color);
  font-weight: bold;
}

.amount {
  text-align: right;
  font-family: monospace;
}

.section-header td {
  background-color: var(--surface-400);
  font-weight: bold;
  padding: 10px 12px;
}

.account-total {
  font-weight: bold;
}

.total-row td {
  border-top: 2px solid var(--surface-border);
  font-weight: bold;
  background-color: var(--surface-300);
}

.grand-total-row td {
  border-top: 3px double var(--surface-border);
  font-weight: bold;
  background-color: var(--surface-500);
}

.loading,
.no-data {
  padding: 20px;
  text-align: center;
  color: var(--text-color-secondary);
}

.no-data-row td {
  text-align: center;
  color: var(--text-color-secondary);
  font-style: italic;
}

/* Debug info */
.debug-info {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.debug-info h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #495057;
}

.debug-info pre {
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
  font-size: 0.85rem;
}
</style> 