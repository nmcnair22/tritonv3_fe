<template>
  <div class="cash-flow-report">
    <div class="report-header">
      <h2>Cash Flow Statement</h2>
      <p class="report-period">{{ formattedDateRange }}</p>
    </div>
    
    <div v-if="isLoading" class="loading-indicator">
      <p>Loading cash flow data...</p>
    </div>
    
    <div v-else-if="!reportData" class="no-data">
      <p>No cash flow data available.</p>
    </div>
    
    <div v-else class="report-content">
      <div class="line-items">
        <!-- Map through the items, using the array data structure directly -->
        <div 
          v-for="item in reportData" 
          :key="item.id" 
          class="line-item"
          :class="{
            'header': item.lineType === 'header',
            'indented-1': item.indentation === 1,
            'indented-2': item.indentation === 2,
            'indented-3': item.indentation === 3,
            'total': item.display.toLowerCase().includes('total') || item.lineType === 'total'
          }"
        >
          <span class="item-name">{{ item.display }}</span>
          <span class="item-amount" v-if="item.lineType !== 'header'">{{ formatCurrency(item.netChange) }}</span>
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
    type: Array,
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

// Format the date range from filters or reportData
const formattedDateRange = computed(() => {
  if (props.reportData?.[0]?.dateFilter) {
    const dateFilter = props.reportData[0].dateFilter;
    return `For the period ending ${formatDate(dateFilter)}`;
  }
  
  if (props.filters.startDate && props.filters.endDate) {
    return `${formatDate(props.filters.startDate)} - ${formatDate(props.filters.endDate)}`;
  }
  
  return props.filters.endDate ? `Period ending ${formatDate(props.filters.endDate)}` : 'Current Period';
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
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}
</script>

<style scoped>
.cash-flow-report {
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

.report-period {
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

.line-items {
  margin: 0 1rem;
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

.header {
  font-weight: bold;
  color: var(--primary-color);
  margin-top: 1rem;
  border-bottom: 2px solid var(--primary-color);
}

.indented-1 {
  margin-left: 1rem;
}

.indented-2 {
  margin-left: 2rem;
}

.indented-3 {
  margin-left: 3rem;
}

.item-name {
  flex: 1;
}

.item-amount {
  text-align: right;
  min-width: 150px;
}

.total {
  font-weight: bold;
  background-color: var(--surface-c);
}

@media print {
  .cash-flow-report {
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