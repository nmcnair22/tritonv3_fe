// Very first script
console.log('<<<< BALANCE SHEET REPORT COMPONENT LOADED >>>>');

<template>
  <div class="balance-sheet-report">
    <div class="report-header mb-4">
      <h2>Balance Sheet</h2>
      <p class="text-500">As of {{ formatDate(filters.endDate) }}</p>
    </div>

    <div v-if="isLoading" class="flex justify-content-center">
      <ProgressSpinner />
    </div>

    <div v-else-if="reportData" class="report-content">
      <!-- Assets Section -->
      <div class="section mb-4">
        <h3 class="section-title">Assets</h3>
        <div class="section-content">
          <div v-for="line in assetLines" :key="line.id" 
               :class="['line-item', getLineClass(line)]"
               :style="{ paddingLeft: `${line.indentation * 20}px` }">
            <span class="line-label">{{ line.display }}</span>
            <span class="line-amount" :class="{ 'font-bold': line.lineType === 'total' }">
              {{ formatAmount(line.balance) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Liabilities Section -->
      <div class="section mb-4">
        <h3 class="section-title">Liabilities</h3>
        <div class="section-content">
          <div v-for="line in liabilityLines" :key="line.id" 
               :class="['line-item', getLineClass(line)]"
               :style="{ paddingLeft: `${line.indentation * 20}px` }">
            <span class="line-label">{{ line.display }}</span>
            <span class="line-amount" :class="{ 'font-bold': line.lineType === 'total' }">
              {{ formatAmount(line.balance) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Equity Section -->
      <div class="section mb-4">
        <h3 class="section-title">Equity</h3>
        <div class="section-content">
          <div v-for="line in equityLines" :key="line.id" 
               :class="['line-item', getLineClass(line)]"
               :style="{ paddingLeft: `${line.indentation * 20}px` }">
            <span class="line-label">{{ line.display }}</span>
            <span class="line-amount" :class="{ 'font-bold': line.lineType === 'total' }">
              {{ formatAmount(line.balance) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Total Liabilities & Equity -->
      <div class="section total-section">
        <div class="line-item total-line">
          <span class="line-label">Total Liabilities & Equity</span>
          <span class="line-amount font-bold">{{ formatAmount(totalLiabilitiesAndEquity) }}</span>
        </div>
      </div>
    </div>

    <div v-else class="text-center p-4">
      <p class="text-500">No balance sheet data available</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps({
  reportData: {
    type: Array,
    required: true
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

// Format date for display
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format amount for display
function formatAmount(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Get CSS class for line item based on type
function getLineClass(line) {
  return {
    'header-line': line.lineType === 'header',
    'detail-line': line.lineType === 'detail',
    'total-line': line.lineType === 'total',
    'spacer-line': line.lineType === 'spacer'
  };
}

// Filter and sort lines by section
const assetLines = computed(() => {
  return props.reportData?.filter(line => 
    line.lineNumber >= 10000 && line.lineNumber < 30000
  ) || [];
});

const liabilityLines = computed(() => {
  return props.reportData?.filter(line => 
    line.lineNumber >= 320000 && line.lineNumber < 380000
  ) || [];
});

const equityLines = computed(() => {
  return props.reportData?.filter(line => 
    line.lineNumber >= 380000 && line.lineNumber < 440000
  ) || [];
});

// Calculate total liabilities and equity
const totalLiabilitiesAndEquity = computed(() => {
  const totalLiabilities = props.reportData?.find(line => 
    line.lineNumber === 360000
  )?.balance || 0;
  
  const totalEquity = props.reportData?.find(line => 
    line.lineNumber === 420000
  )?.balance || 0;
  
  return totalLiabilities + totalEquity;
});
</script>

<style scoped>
.balance-sheet-report {
  font-family: var(--font-family);
}

.report-header {
  text-align: center;
  margin-bottom: 2rem;
}

.report-header h2 {
  margin: 0;
  color: var(--text-color);
}

.section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--surface-border);
}

.section-content {
  margin-left: 1rem;
}

.line-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.9rem;
}

.header-line {
  font-weight: 600;
  color: var(--text-color);
}

.detail-line {
  color: var(--text-color-secondary);
}

.total-line {
  font-weight: 600;
  color: var(--text-color);
  border-top: 1px solid var(--surface-border);
  margin-top: 0.5rem;
  padding-top: 0.5rem;
}

.spacer-line {
  height: 1rem;
}

.line-label {
  flex: 1;
}

.line-amount {
  margin-left: 2rem;
  text-align: right;
  min-width: 120px;
}

.total-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid var(--surface-border);
}

.font-bold {
  font-weight: 600;
}

@media print {
  .balance-sheet-report {
    padding: 0;
  }

  .line-item {
    page-break-inside: avoid;
  }

  .total-line {
    page-break-before: avoid;
  }
}
</style> 