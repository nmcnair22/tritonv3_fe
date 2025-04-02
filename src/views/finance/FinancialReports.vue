// For debugging - at the top of the file
console.log('[FINANCE REPORTS] File parsed');

// Very first script
console.log('<<<< FINANCE REPORTS LOADED >>>>');

<template>
  <div class="financial-reports">
    <h1 class="page-title">Financial Reports</h1>
    
    <!-- Simple status display -->
    <div class="status-panel">
      <h3>Status</h3>
      <div>Loading: {{ financeStore.isLoading }}</div>
      <div>Companies: {{ financeStore.companies.length || 0 }}</div>
      <div>Has Report Data: {{ !!financeStore.reportData }}</div>
      <div v-if="financeStore.error" class="error">Error: {{ financeStore.error }}</div>
    </div>
    
    <!-- Simple control panel -->
    <div class="control-panel">
      <div class="form-group">
        <label>Company:</label>
        <select v-model="selectedCompanyId">
          <option v-for="company in financeStore.companies" :key="company.id" :value="company.id">
            {{ company.displayName || company.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Report Type:</label>
        <select v-model="reportType">
          <option value="balanceSheet">Balance Sheet</option>
          <option value="incomeStatement">Income Statement</option>
          <option value="cashFlow">Cash Flow Statement</option>
          <option value="retainedEarnings">Retained Earnings</option>
          <option value="trialBalance">Trial Balance</option>
        </select>
      </div>

      <div class="form-group">
        <label>As of Date:</label>
        <input type="date" v-model="asOfDate">
      </div>

      <div class="actions">
        <button @click="loadCompanies" :disabled="financeStore.isLoading">
          Load Companies
        </button>
        <button @click="generateReport" :disabled="!selectedCompanyId || financeStore.isLoading">
          Generate Report
        </button>
      </div>
    </div>
    
    <!-- API Call Logs -->
    <div class="api-logs">
      <h3>API Call Logs</h3>
      <div v-for="(log, index) in apiLogs" :key="index" class="log-entry">
        <div class="log-time">{{ log.time }}</div>
        <div :class="'log-message ' + (log.isError ? 'error' : '')">{{ log.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFinanceStore } from '@/stores/finance';

console.log('[FINANCE REPORTS] Script setup starting');

// Store initialization
const financeStore = useFinanceStore();
console.log('[FINANCE REPORTS] Finance store initialized');

// Component state
const selectedCompanyId = ref(null);
const reportType = ref('balanceSheet');
const asOfDate = ref(new Date().toISOString().split('T')[0]);
const apiLogs = ref([]);

// Log helper
function addLog(message, isError = false) {
  const time = new Date().toLocaleTimeString();
  apiLogs.value.unshift({ time, message, isError });
  console.log(`[FINANCE REPORTS] ${isError ? 'ERROR' : 'LOG'}: ${message}`);
}

// Load companies
async function loadCompanies() {
  addLog('Loading companies...');
  try {
    const companies = await financeStore.fetchCompanies();
    addLog(`Loaded ${companies.length} companies`);
    
    if (companies.length > 0 && !selectedCompanyId.value) {
      selectedCompanyId.value = companies[0].id;
      addLog(`Selected company: ${companies[0].name} (${companies[0].id})`);
    }
  } catch (err) {
    addLog(`Error loading companies: ${err.message}`, true);
  }
}

// Generate report
async function generateReport() {
  if (!selectedCompanyId.value) {
    addLog('No company selected', true);
    return;
  }
  
  addLog(`Generating ${reportType.value} report for company ${selectedCompanyId.value}`);
  
  try {
    let result;
    
    switch (reportType.value) {
      case 'balanceSheet':
        addLog(`Calling fetchBalanceSheet(${selectedCompanyId.value}, ${asOfDate.value})`);
        result = await financeStore.fetchBalanceSheet(selectedCompanyId.value, asOfDate.value);
        break;
      case 'incomeStatement':
        addLog('Calling fetchIncomeStatement');
        result = await financeStore.fetchIncomeStatement(
          selectedCompanyId.value, 
          asOfDate.value,
          asOfDate.value
        );
        break;
      case 'cashFlow':
        addLog('Calling fetchCashFlowStatement');
        result = await financeStore.fetchCashFlowStatement(
          selectedCompanyId.value,
          asOfDate.value,
          asOfDate.value
        );
        break;
      case 'retainedEarnings':
        addLog('Calling fetchRetainedEarnings');
        result = await financeStore.fetchRetainedEarnings(
          selectedCompanyId.value,
          asOfDate.value,
          asOfDate.value
        );
        break;
      case 'trialBalance':
        addLog('Calling fetchTrialBalance');
        result = await financeStore.fetchTrialBalance(
          selectedCompanyId.value,
          asOfDate.value
        );
        break;
    }
    
    addLog(`Report API call complete. Has data: ${!!result}`);
  } catch (err) {
    addLog(`Error generating report: ${err.message}`, true);
  }
}

// Setup
onMounted(async () => {
  console.log('[FINANCE REPORTS] Component mounted');
  addLog('Component mounted');
  
  // Load companies automatically
  await loadCompanies();
});
</script>

<style scoped>
.financial-reports {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
}

.status-panel,
.control-panel,
.api-logs {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.actions {
  margin-top: 20px;
}

button {
  background: #297FB7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.log-entry {
  padding: 5px;
  border-bottom: 1px solid #dee2e6;
}

.log-time {
  font-size: 0.8em;
  color: #6c757d;
}

.error {
  color: #dc3545;
}

.api-logs {
  max-height: 300px;
  overflow-y: auto;
}
</style> 