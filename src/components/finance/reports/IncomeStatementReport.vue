<template>
  <div class="income-statement-report">
    <div class="text-center mb-4">
      <h2 class="text-2xl font-bold mb-2">Income Statement</h2>
      <p class="text-color-secondary">{{ formattedDateRange }}</p>
    </div>
    
    <ProgressSpinner v-if="isLoading" class="w-8rem h-8rem" strokeWidth="4" fill="var(--surface-ground)" />
    
    <div v-else-if="!reportData" class="surface-ground p-4 border-round text-center">
      <i class="pi pi-exclamation-circle text-xl mb-3"></i>
      <p>No income statement data available.</p>
    </div>
    
    <div v-else class="report-content">
      <DataTable :value="reportData" class="p-datatable-sm" showGridlines>
        <Column field="display" header="Account">
          <template #body="{ data }">
            <div :class="{
              'font-bold': data.lineType === 'header',
              'pl-3': data.indentation === 1,
              'pl-5': data.indentation === 2,
              'pl-7': data.indentation === 3
            }">
              {{ data.display }}
            </div>
          </template>
        </Column>
        
        <Column field="netChange" header="Amount" :sortable="true">
          <template #body="{ data }">
            <div v-if="data.lineType !== 'header'" :class="{
              'font-bold': data.display.toLowerCase().includes('total') || data.lineType === 'total',
              'text-right': true
            }">
              {{ formatCurrency(data.netChange) }}
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';

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

<style>
.income-statement-report {
  font-family: var(--font-family);
}

@media print {
  .income-statement-report {
    padding: 1rem;
  }
  
  .p-datatable {
    font-size: 0.9rem;
  }
  
  .p-datatable .p-datatable-thead > tr > th {
    background-color: #f8f9fa !important;
    color: #000 !important;
  }
  
  .p-datatable .p-datatable-tbody > tr > td {
    border-color: #dee2e6 !important;
  }
}
</style> 