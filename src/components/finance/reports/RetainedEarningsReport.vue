<template>
  <div class="retained-earnings-report">
    <div class="report-header">
      <h2>Retained Earnings Statement</h2>
      <p class="as-of-date">As of {{ formattedDate }}</p>
    </div>
    
    <div v-if="isLoading" class="loading-indicator">
      <p>Loading retained earnings data...</p>
    </div>
    
    <div v-else-if="!reportData" class="no-data">
      <p>No retained earnings data available.</p>
    </div>
    
    <div v-else class="report-content">
      <div class="report-section">
        <div class="line-items">
          <!-- Map through the items, using the value field data structure we got from our API test -->
          <div v-for="item in reportData.value" :key="item.id" class="line-item" :class="{ 'indented': item.indentation > 0 }">
            <span class="item-name">{{ item.display }}</span>
            <span class="item-amount" v-if="item.lineType !== 'header'">{{ formatCurrency(item.netChange) }}</span>
          </div>
          
          <!-- Manually render the grand total if it's not included in the API response -->
          <div v-if="!hasTotal(reportData.value)" class="line-item total">
            <span class="item-name">Total Retained Earnings</span>
            <span class="item-amount">{{ formatCurrency(calculateTotal()) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Helper function to check if there's already a total in the data
function hasTotal(items) {
  return items.some(item => 
    item.lineType === 'total' || 
    item.display.toLowerCase().includes('total') ||
    item.display.toLowerCase().includes('earnings, period end')
  );
}

// Calculate total if needed
function calculateTotal() {
  if (!props.reportData?.value) return 0;
  
  return props.reportData.value.reduce((sum, item) => {
    // Only sum detail lines, not headers
    if (item.lineType === 'detail') {
      return sum + (item.netChange || 0);
    }
    return sum;
  }, 0);
}
</script>

<style scoped>
.retained-earnings-report {
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

.report-section {
  margin-bottom: 2rem;
}

.line-items {
  margin-left: 1rem;
}

.line-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--surface-d);
}

.line-item:last-child {
  border-bottom: none;
}

.indented {
  margin-left: 2rem;
}

.item-name {
  flex: 1;
  font-weight: normal;
}

.item-amount {
  text-align: right;
  min-width: 150px;
}

.subtotal {
  font-weight: bold;
  background-color: var(--surface-c);
}

.total {
  font-weight: bold;
  font-size: 1.1em;
  border-top: 2px solid var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  padding: 0.75rem 0;
  margin-top: 1rem;
}

.grand-total {
  font-weight: bold;
  font-size: 1.2em;
  border-top: 2px solid var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  padding: 0.75rem 0;
  margin-top: 1rem;
}

@media print {
  .retained-earnings-report {
    padding: 1rem;
  }
  
  .report-header h2 {
    font-size: 1.5rem;
  }
  
  .line-item {
    font-size: 0.9rem;
    padding: 0.25rem 0;
  }
}
</style> 