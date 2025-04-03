<template>
  <div class="financial-dashboard">
    <h1 class="page-title">Financial Dashboard</h1>
    
    <!-- Debug Panel -->
    <div class="debug-panel">
      <h3>Debug Information</h3>
      <p>Loading Companies: {{ isLoadingCompanies }}</p>
      <p>Loading Dashboard: {{ isLoadingDashboard }}</p>
      <p>Error: {{ error }}</p>
      <p>Companies loaded: {{ companies.length }}</p>
      <p>Selected Company: {{ filters.companyId }}</p>
      <button @click="logDebugInfo" class="btn-primary">Log Debug Info</button>
      <button @click="testDirectCall" class="btn-secondary">Test Direct API Call</button>
      <div v-if="directCallResult" class="direct-call-result">
        <h4>Direct Call Result:</h4>
        <p>Success: {{ directCallResult.success }}</p>
        <p v-if="directCallResult.success">Status: {{ directCallResult.status }}</p>
        <p v-if="!directCallResult.success">Error: {{ directCallResult.error }}</p>
      </div>
    </div>
    
    <div class="dashboard-filters">
      <div class="filter-group">
        <label for="dateRange">Date Range:</label>
        <select id="dateRange" v-model="filters.dateRange">
          <option value="30">Last 30 Days</option>
          <option value="90">Last Quarter</option>
          <option value="180">Last 6 Months</option>
          <option value="365">Last Year</option>
          <option value="custom">Custom Range</option>
        </select>
        
        <div v-if="filters.dateRange === 'custom'" class="custom-date-range">
          <input type="date" v-model="filters.startDate" />
          <span>to</span>
          <input type="date" v-model="filters.endDate" />
        </div>
      </div>
      
      <div class="filter-group">
        <label for="company">Company:</label>
        <select id="company" v-model="filters.companyId">
          <option v-for="company in companies" :key="company.id" :value="company.id">
            {{ company.name || company.displayName }}
          </option>
        </select>
      </div>
      
      <button @click="applyFilters" class="btn-primary">Apply Filters</button>
    </div>
    
    <!-- Loading Indicator -->
    <div v-if="isLoadingDashboard" class="loading-indicator">
      Loading dashboard data...
    </div>
    
    <!-- Error Message -->
    <div v-else-if="error" class="error-message">
      <h3>Error Loading Data</h3>
      <p>{{ error }}</p>
      <button @click="retryLoading" class="btn-primary">Retry</button>
    </div>
    
    <!-- Dashboard Content -->
    <div v-else>
      <div class="dashboard-metrics">
        <FinancialSummaryCard 
          title="Revenue" 
          :value="dashboardData.revenue" 
          :trend="dashboardData.revenueTrend" 
          icon="trending-up"
        />
        <FinancialSummaryCard 
          title="Expenses" 
          :value="dashboardData.expenses" 
          :trend="dashboardData.expensesTrend" 
          icon="credit-card"
        />
        <FinancialSummaryCard 
          title="Profit" 
          :value="dashboardData.profit" 
          :trend="dashboardData.profitTrend" 
          icon="dollar-sign"
        />
        <FinancialSummaryCard 
          title="AR Outstanding" 
          :value="dashboardData.arOutstanding" 
          :trend="dashboardData.arTrend" 
          icon="alert-circle"
        />
      </div>
      
      <div class="dashboard-charts">
        <div class="chart-container">
          <h2>Revenue & Expenses</h2>
          <RevenueChart :data="revenueChartData" />
        </div>
        
        <div class="chart-container">
          <h2>AI Financial Insights</h2>
          <AiInsightsPanel :insights="aiInsights" />
        </div>
      </div>
      
      <div class="dashboard-tables">
        <div class="table-container">
          <h2>Recent Sales Invoices</h2>
          <SalesInvoicesList :invoices="recentInvoices" :isCompact="true" />
          <router-link to="/finance/accounts-receivable" class="view-all-link">
            View All Invoices
          </router-link>
        </div>
        
        <div class="table-container">
          <h2>AR Aging</h2>
          <ArAgingTable :agingData="arAgingData" :isCompact="true" />
          <router-link to="/finance/accounts-receivable" class="view-all-link">
            View Full Aging Report
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useFinanceStore } from '../../stores/finance';
import { useAiInsights } from '../../composables/finance/useAiInsights';
import FinancialSummaryCard from '../../components/finance/dashboard/FinancialSummaryCard.vue';
import RevenueChart from '../../components/finance/dashboard/RevenueChart.vue';
import AiInsightsPanel from '../../components/finance/dashboard/AiInsightsPanel.vue';
import SalesInvoicesList from '../../components/finance/accountsReceivable/SalesInvoicesList.vue';
import ArAgingTable from '../../components/finance/accountsReceivable/ArAgingTable.vue';

const financeStore = useFinanceStore();
const { getFinancialInsights } = useAiInsights();

// State
const companies = ref([]);
const isLoadingCompanies = ref(true);
const isLoadingDashboard = ref(true);
const error = ref(null);
const directCallResult = ref(null);

const filters = reactive({
  dateRange: '30',
  startDate: '',
  endDate: '',
  companyId: ''
});

const dashboardData = ref({
  revenue: 0,
  expenses: 0,
  profit: 0,
  arOutstanding: 0,
  revenueTrend: 0,
  expensesTrend: 0,
  profitTrend: 0,
  arTrend: 0
});

const revenueChartData = ref([]);
const aiInsights = ref([]);
const recentInvoices = ref([]);
const arAgingData = ref([]);

// Computed date range for API calls
const dateRange = computed(() => {
  if (filters.dateRange === 'custom') {
    return {
      startDate: filters.startDate,
      endDate: filters.endDate
    };
  }
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(filters.dateRange));
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
});

// Debug function to log information
function logDebugInfo() {
  console.log({
    isLoadingDashboard: isLoadingDashboard.value,
    error: error.value,
    filters: filters,
    dashboardData: dashboardData.value,
    dateRange: dateRange.value,
    revenueChartData: revenueChartData.value,
    aiInsights: aiInsights.value,
    recentInvoices: recentInvoices.value,
    arAgingData: arAgingData.value
  });
}

// Methods
async function loadDashboardData() {
  console.log("Loading dashboard data with date range:", dateRange.value);
  
  isLoadingDashboard.value = true;
  error.value = null;
  
  try {
    // Fetch income statement data
    console.log("Fetching income statement data...");
    const incomeData = await financeStore.fetchIncomeStatement(
      dateRange.value.startDate, 
      dateRange.value.endDate
    );
    
    console.log("Income data received:", incomeData);
    
    // Update dashboard metrics
    dashboardData.value = {
      revenue: incomeData?.totalRevenue || 0,
      expenses: incomeData?.totalExpenses || 0,
      profit: incomeData?.netIncome || 0,
      arOutstanding: incomeData?.arBalance || 0,
      revenueTrend: incomeData?.revenueTrend || 0,
      expensesTrend: incomeData?.expensesTrend || 0,
      profitTrend: incomeData?.profitTrend || 0,
      arTrend: incomeData?.arTrend || 0
    };
    
    // Update chart data
    revenueChartData.value = incomeData.monthlyData || [];
    
    // Fetch AR aging data
    console.log("Fetching AR aging data...");
    arAgingData.value = await financeStore.fetchArAging();
    
    console.log("AR aging data received:", arAgingData.value);
    
    // Get AI insights
    console.log("Getting AI insights...");
    aiInsights.value = await getFinancialInsights(dashboardData.value);
    
    console.log("AI insights received:", aiInsights.value);
    
  } catch (err) {
    console.error("Error loading dashboard data:", err);
    error.value = err.message || 'Failed to load dashboard data';
  } finally {
    isLoadingDashboard.value = false;
  }
}

async function loadCompanies() {
  isLoadingCompanies.value = true;
  error.value = null;
  
  try {
    console.log("Fetching companies...");
    companies.value = await financeStore.fetchCompanies();
    console.log("Companies received:", companies.value);
    
    if (companies.value && companies.value.length > 0) {
      filters.companyId = companies.value[0].id;
      console.log("Selected first company:", filters.companyId);
    } else {
      console.warn("No companies returned from API");
    }
  } catch (err) {
    console.error('Error loading companies:', err);
    error.value = err.message || 'Failed to load companies';
  } finally {
    isLoadingCompanies.value = false;
  }

}

function applyFilters() {
  console.log("Applying filters:", filters);
  loadDashboardData();
}

function retryLoading() {
  console.log("Retrying data load...");
  loadCompanies().then(() => loadDashboardData());
}

// Add test direct call method
async function testDirectCall() {
  console.log("[DASHBOARD] Testing direct API call...");
  const { testDirectApiCall } = useFinanceStore();
  directCallResult.value = await testDirectApiCall();
  console.log("[DASHBOARD] Direct call result:", directCallResult.value);
}

// Lifecycle hooks
onMounted(() => {
  console.log("=== FINANCIAL DASHBOARD MOUNTED ===");
  console.log("Are API modules loaded?", {
    useFinanceStore: !!useFinanceStore,
    useAiInsights: !!useAiInsights,
    fetchCompanies: !!financeStore.fetchCompanies,
    fetchIncomeStatementData: !!financeStore.fetchIncomeStatement
  });
  
  // Check if we have auth token
  const token = localStorage.getItem('auth_token');
  console.log("Auth token exists:", !!token);
  if (token) {
    console.log("Token value (first 10 chars):", token.substring(0, 10) + "...");
  }
  
  // Load companies first
  console.log("Starting company data load...");
  loadCompanies().then(() => {
    console.log("Companies load completed, companies count:", companies.value.length);
    if (!error.value) {
      console.log("No errors, starting dashboard data load...");
      loadDashboardData();
    } else {
      console.error("Error detected, skipping dashboard data load:", error.value);
    }
  }).catch(err => {
    console.error("Unexpected error in companies load promise chain:", err);
  });
});
</script>

<style scoped>
.financial-dashboard {
  padding: 1.5rem;
}

.page-title {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.debug-panel {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-family: monospace;
  font-size: 0.85rem;
  color: #333;
}

.dashboard-filters {
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
  align-items: center;
  gap: 0.5rem;
}

.custom-date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.dashboard-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.dashboard-tables {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 1.5rem;
}

.chart-container, .table-container {
  background-color: var(--surface-color);
  border-radius: 0.5rem;
  padding: 1rem;
}

.view-all-link {
  display: block;
  text-align: right;
  margin-top: 0.5rem;
  color: var(--primary-color);
  font-weight: 500;
}

.loading-indicator, .error-message {
  padding: 2rem;
  background-color: var(--surface-color);
  border-radius: 0.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.error-message {
  color: #e74c3c;
  border: 1px solid #e74c3c;
}

.direct-call-result {
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.direct-call-result h4 {
  margin-top: 0;
  color: #2196F3;
  font-size: 14px;
}

.btn-secondary {
  background-color: #673AB7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #5E35B1;
}

@media (max-width: 768px) {
  .dashboard-charts, .dashboard-tables {
    grid-template-columns: 1fr;
  }
}
</style> 