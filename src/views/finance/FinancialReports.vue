<template>
  <div class="financial-reports">
    <h1 class="page-title">Financial Reports</h1>
    
    <div class="report-filters">
      <div class="filter-group">
        <label for="reportType">Report Type:</label>
        <select id="reportType" v-model="filters.reportType">
          <option value="balanceSheet">Balance Sheet</option>
          <option value="incomeStatement">Income Statement</option>
          <option value="cashFlow">Cash Flow</option>
          <option value="retainedEarnings">Retained Earnings</option>
          <option value="trialBalance">Trial Balance</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="dateRange">Period:</label>
        <select id="dateRange" v-model="filters.dateRange">
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="ytd">Year to Date</option>
          <option value="fiscal">Fiscal Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>
      
      <div v-if="filters.dateRange === 'custom'" class="filter-group date-range">
        <label>Custom Range:</label>
        <div class="date-inputs">
          <input type="date" v-model="filters.startDate" />
          <span>to</span>
          <input type="date" v-model="filters.endDate" />
        </div>
      </div>
      
      <div class="filter-group">
        <label for="company">Company:</label>
        <select id="company" v-model="filters.companyId">
          <option v-for="company in companies" :key="company.id" :value="company.id">
            {{ company.displayName }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="comparison">Comparison:</label>
        <select id="comparison" v-model="filters.comparison">
          <option value="none">None</option>
          <option value="previous">Previous Period</option>
          <option value="budget">Budget</option>
          <option value="yoy">Year over Year</option>
        </select>
      </div>
      
      <button @click="generateReport" class="btn-primary" :disabled="isLoading">
        {{ isLoading ? 'Generating...' : 'Generate Report' }}
      </button>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div class="report-actions" v-if="reportData">
      <button @click="printReport" class="btn-icon">
        <span class="icon">print</span>
        <span>Print</span>
      </button>
      <button @click="exportPdf" class="btn-icon">
        <span class="icon">file_download</span>
        <span>Export PDF</span>
      </button>
      <button @click="exportExcel" class="btn-icon">
        <span class="icon">table_view</span>
        <span>Export Excel</span>
      </button>
    </div>
    
    <div class="report-container" v-if="reportData">
      <!-- Dynamic report component based on selected report type -->
      <component 
        :is="reportComponent" 
        :reportData="reportData" 
        :filters="filters"
        :isLoading="isLoading"
      ></component>
    </div>
    
    <div class="no-data" v-else-if="!isLoading && !error">
      Select parameters and click "Generate Report" to view financial data.
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useFinanceApi } from '@/composables/finance/useFinanceApi';
import BalanceSheetReport from '@/components/finance/reports/BalanceSheetReport.vue';
import IncomeStatementReport from '@/components/finance/reports/IncomeStatementReport.vue';
import CashFlowReport from '@/components/finance/reports/CashFlowReport.vue';
import TrialBalanceReport from '@/components/finance/reports/TrialBalanceReport.vue';
import RetainedEarningsReport from '@/components/finance/reports/RetainedEarningsReport.vue';


const {
  isLoading,
  error,
  fetchCompanies,
  fetchIncomeStatementData,
  fetchBalanceSheet,
  fetchCashFlowStatement,
  fetchRetainedEarnings,
  fetchTrialBalance
} = useFinanceApi();

// Log available functions
console.log('Available API functions:', {
  fetchCompanies: !!fetchCompanies,
  fetchIncomeStatementData: !!fetchIncomeStatementData,
  fetchBalanceSheet: !!fetchBalanceSheet,
  fetchCashFlowStatement: !!fetchCashFlowStatement,
  fetchRetainedEarnings: !!fetchRetainedEarnings,
  fetchTrialBalance: !!fetchTrialBalance
});

// State
const companies = ref([]);
const reportData = ref(null);

const filters = reactive({
  reportType: 'balanceSheet',
  dateRange: 'month',
  startDate: '',
  endDate: '',
  companyId: '',
  comparison: 'none'
});

// Computed properties
const reportComponent = computed(() => {
  switch (filters.reportType) {
    case 'balanceSheet':
      return BalanceSheetReport;
    case 'incomeStatement':
      return IncomeStatementReport;
    case 'cashFlow':
      return CashFlowReport;
    case 'retainedEarnings':
      return RetainedEarningsReport;
    case 'trialBalance':
      return TrialBalanceReport;
    default:
      return null;
  }
});

// Initialize date range
function initializeDateRange() {
  const today = new Date();
  
  // Set end date to today
  const endDate = today.toISOString().split('T')[0];
  filters.endDate = endDate;
  
  // Set start date based on selected date range
  const startDate = new Date(today);
  
  switch (filters.dateRange) {
    case 'month':
      startDate.setDate(1); // First day of current month
      break;
    case 'quarter':
      const quarter = Math.floor(today.getMonth() / 3);
      startDate.setMonth(quarter * 3, 1); // First day of current quarter
      break;
    case 'ytd':
      startDate.setMonth(0, 1); // January 1st of current year
      break;
    case 'fiscal': // Assuming fiscal year starts April 1
      if (today.getMonth() < 3) { // Jan, Feb, Mar
        startDate.setFullYear(startDate.getFullYear() - 1, 3, 1); // April 1st of previous year
      } else {
        startDate.setMonth(3, 1); // April 1st of current year
      }
      break;
    default:
      startDate.setDate(today.getDate() - 30); // Default to last 30 days
  }
  
  filters.startDate = startDate.toISOString().split('T')[0];
}

// Methods
async function loadCompanies() {
  try {
    companies.value = await fetchCompanies();
    if (companies.value.length > 0) {
      filters.companyId = companies.value[0].id;
    }
  } catch (err) {
    console.error('Error loading companies:', err);
  }
}

async function generateReport() {
  try {
    // Use the specific API functions based on the report type
    switch (filters.reportType) {
      case 'balanceSheet':
        reportData.value = await fetchBalanceSheet(
          filters.endDate, 
          filters.companyId
        );
        break;
      case 'incomeStatement':
        reportData.value = await fetchIncomeStatementData(
          filters.startDate, 
          filters.endDate, 
          filters.companyId
        );
        break;
      case 'cashFlow':
        reportData.value = await fetchCashFlowStatement(
          filters.startDate, 
          filters.endDate, 
          filters.companyId
        );
        break;
      case 'retainedEarnings':
        reportData.value = await fetchRetainedEarnings(
          filters.endDate, 
          filters.companyId
        );
        break;
      case 'trialBalance':
        reportData.value = await fetchTrialBalance(
          filters.endDate, 
          filters.companyId
        );
        break;
      default:
        throw new Error(`Unsupported report type: ${filters.reportType}`);
    }
    
    console.log(`Generated ${filters.reportType} report:`, reportData.value);
  } catch (err) {
    console.error(`Error generating ${filters.reportType}:`, err);
    error.value = `Failed to generate ${filters.reportType} report: ${err.message}`;
  }
}

function printReport() {
  window.print();
}

function exportPdf() {
  // Implementation for PDF export would go here
  alert('PDF export functionality needs to be implemented');
}

function exportExcel() {
  // Implementation for Excel export would go here
  alert('Excel export functionality needs to be implemented');
}

// Watchers
watch(
  () => filters.dateRange,
  () => {
    initializeDateRange();
  }
);

// Lifecycle hooks
onMounted(async () => {
  await loadCompanies();
  initializeDateRange();
});
</script>

<style scoped>
.financial-reports {
  padding: 1.5rem;
}

.page-title {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.report-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--surface-color);
  border-radius: 0.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.report-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background-color: var(--surface-color);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-icon:hover {
  background-color: var(--surface-hover-color);
}

.report-container {
  background-color: var(--surface-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-message {
  background-color: var(--error-bg-color, #ffebee);
  color: var(--error-color, #c62828);
  padding: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary-color);
  font-style: italic;
}

@media (max-width: 768px) {
  .report-filters {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
}
</style> 