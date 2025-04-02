<template>
  <div class="trial-balance-report">
    <div class="report-header">
      <h2>Trial Balance</h2>
      <p class="as-of-date">As of {{ formattedDate }}</p>
    </div>
    
    <div v-if="isLoading" class="loading-indicator">
      <p>Loading trial balance data...</p>
    </div>
    
    <div v-else-if="!reportData" class="no-data">
      <p>No trial balance data available.</p>
    </div>
    
    <div v-else class="report-content">
      <div class="table-controls">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Search accounts..." 
            class="search-input"
          />
        </div>
        
        <div class="filter-options">
          <label class="filter-option">
            <input type="checkbox" v-model="showZeroBalances" />
            Show accounts with zero balance
          </label>
        </div>
      </div>
      
      <div class="trial-balance-table">
        <div class="table-header">
          <div class="column acct-number">Account No.</div>
          <div class="column acct-name">Account Name</div>
          <div class="column debit">Debit</div>
          <div class="column credit">Credit</div>
        </div>
        
        <div class="table-body">
          <div 
            v-for="item in filteredItems" 
            :key="item.accountId" 
            class="table-row"
            :class="{
              'header': item.accountType === 'Begin_x002D_Total',
              'total': item.number.includes('999')
            }"
          >
            <div class="column acct-number">{{ item.number }}</div>
            <div class="column acct-name">{{ item.display }}</div>
            <div class="column debit">{{ formatCurrencyFromString(item.balanceAtDateDebit) }}</div>
            <div class="column credit">{{ formatCurrencyFromString(item.balanceAtDateCredit) }}</div>
          </div>
        </div>
        
        <div class="table-footer">
          <div class="column acct-number"></div>
          <div class="column acct-name">Totals</div>
          <div class="column debit">{{ formatCurrency(calculateTotalDebit()) }}</div>
          <div class="column credit">{{ formatCurrency(calculateTotalCredit()) }}</div>
        </div>
      </div>
      
      <div class="balance-status" :class="{ 'balanced': isBalanced, 'unbalanced': !isBalanced }">
        <span v-if="isBalanced">✓ Balanced</span>
        <span v-else>✗ Not Balanced (Difference: {{ formatCurrency(balanceDifference) }})</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Define props
const props = defineProps({
  reportData: {
    type: Object,
    required: true
  },
  filters: {
    type: Object,
    default: () => ({})
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

// Local state
const searchTerm = ref('');
const showZeroBalances = ref(false);

// Format the date from reportData
const formattedDate = computed(() => {
  if (props.reportData?.value?.[0]?.dateFilter) {
    const dateFilter = props.reportData.value[0].dateFilter;
    return formatDate(dateFilter);
  }
  return props.filters.endDate ? formatDate(props.filters.endDate) : 'N/A';
});

// Helper function to format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Helper function to format currency
function formatCurrency(value) {
  if (!value || value === 0) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Helper function to format currency from string (with commas)
function formatCurrencyFromString(value) {
  if (!value || value === '') return '';
  
  // If the value already has a currency symbol, return it as is
  if (value.includes('$')) return value;
  
  // If the value is "0.00", return empty string to match the expected behavior
  if (value === '0.00') return '';
  
  // Otherwise format it consistently
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(parseFloat(value.replace(/,/g, '')));
}

// Parse numeric value from string with commas
function parseNumericValue(value) {
  if (!value || value === '') return 0;
  return parseFloat(value.replace(/,/g, '')) || 0;
}

// Calculate total debits
function calculateTotalDebit() {
  if (!props.reportData?.value) return 0;
  
  return props.reportData.value.reduce((sum, item) => {
    if (item.balanceAtDateDebit && item.balanceAtDateDebit !== '' && item.balanceAtDateDebit !== '0.00') {
      return sum + parseNumericValue(item.balanceAtDateDebit);
    }
    return sum;
  }, 0);
}

// Calculate total credits
function calculateTotalCredit() {
  if (!props.reportData?.value) return 0;
  
  return props.reportData.value.reduce((sum, item) => {
    if (item.balanceAtDateCredit && item.balanceAtDateCredit !== '' && item.balanceAtDateCredit !== '0.00') {
      return sum + parseNumericValue(item.balanceAtDateCredit);
    }
    return sum;
  }, 0);
}

// Filtered items
const filteredItems = computed(() => {
  if (!props.reportData?.value) return [];
  
  return props.reportData.value.filter(item => {
    // Filter by search term
    const matchesSearch = 
      item.number.toLowerCase().includes(searchTerm.value.toLowerCase()) || 
      item.display.toLowerCase().includes(searchTerm.value.toLowerCase());
    
    // Filter by zero balances
    const hasDebit = item.balanceAtDateDebit && item.balanceAtDateDebit !== '' && item.balanceAtDateDebit !== '0.00';
    const hasCredit = item.balanceAtDateCredit && item.balanceAtDateCredit !== '' && item.balanceAtDateCredit !== '0.00';
    const showAccount = showZeroBalances.value || hasDebit || hasCredit;
    
    return matchesSearch && showAccount;
  });
});

// Check if the trial balance is balanced
const isBalanced = computed(() => {
  return Math.abs(calculateTotalDebit() - calculateTotalCredit()) < 0.01; // Account for rounding errors
});

const balanceDifference = computed(() => {
  return Math.abs(calculateTotalDebit() - calculateTotalCredit());
});
</script>

<style scoped>
.trial-balance-report {
  font-family: var(--font-family);
  color: var(--text-color);
}

.report-header {
  margin-bottom: 2rem;
  text-align: center;
}

.report-header h2 {
  margin-bottom: 0.5rem;
}

.as-of-date {
  font-style: italic;
  color: var(--text-secondary-color);
}

.loading-indicator, .no-data {
  text-align: center;
  padding: 2rem;
  background-color: var(--surface-b);
  border-radius: 4px;
  margin: 1rem 0;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  gap: 1rem;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--surface-d);
  border-radius: 4px;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.trial-balance-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  display: flex;
  background-color: var(--surface-c);
  font-weight: bold;
  border-bottom: 2px solid var(--primary-color);
}

.table-body {
  max-height: 500px;
  overflow-y: auto;
}

.table-row {
  display: flex;
  border-bottom: 1px solid var(--surface-d);
}

.table-row.header {
  font-weight: bold;
  color: var(--primary-color);
  background-color: var(--surface-b);
}

.table-row.total {
  font-weight: bold;
  background-color: var(--surface-c);
}

.table-footer {
  display: flex;
  font-weight: bold;
  border-top: 2px solid var(--primary-color);
  background-color: var(--surface-c);
}

.column {
  padding: 0.75rem 0.5rem;
}

.acct-number {
  flex: 0 0 15%;
}

.acct-name {
  flex: 1;
}

.debit, .credit {
  flex: 0 0 20%;
  text-align: right;
}

.balance-status {
  text-align: right;
  font-weight: 700;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
}

.balanced {
  color: var(--primary-color, #4caf50);
}

.unbalanced {
  color: var(--error-color, #f44336);
}

/* Print styles */
@media print {
  .trial-balance-report {
    padding: 1rem;
  }
  
  .report-header h2 {
    font-size: 1.5rem;
  }
  
  .table-row {
    font-size: 0.9rem;
  }
  
  .column {
    padding: 0.5rem;
  }
  
  .table-controls {
    display: none;
  }
  
  .trial-balance-table {
    page-break-inside: avoid;
  }
}

/* Responsive styles */
@media (max-width: 768px) {
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .trial-balance-table {
    font-size: 0.9rem;
  }
  
  .table-header, .table-row, .table-footer {
    grid-template-columns: 0.8fr 1.5fr 0.8fr 1fr 1fr;
    padding: 0.5rem;
  }
  
  .acct-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 576px) {
  .table-header, .table-row, .table-footer {
    grid-template-columns: 0.6fr 1.2fr 0.6fr 0.8fr 0.8fr;
    font-size: 0.8rem;
  }
}
</style> 