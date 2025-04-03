<!-- src/components/finance/dashboard/DateRangeFilter.vue -->
<template>
  <div class="filter-container p-3 mb-3 surface-section border-round">
    <div class="p-field">
      <h3 class="m-0 mb-2">Dashboard Filters</h3>
      <div class="grid">
        <div class="col-12 md:col-8">
          <label for="dateRange" class="block mb-2">Date Range:</label>
          <DatePicker 
            id="dateRange" 
            v-model="dateRange" 
            selectionMode="range" 
            :manualInput="false" 
            :showButtonBar="true"
            placeholder="Select Date Range"
            class="w-full"
          />
        </div>
        <div class="col-12 md:col-4">
          <label for="quickSelect" class="block mb-2">Quick Select:</label>
          <Dropdown
            id="quickSelect"
            v-model="selectedQuickOption"
            :options="quickSelectOptions"
            optionLabel="label"
            placeholder="Select Period"
            class="w-full"
            @change="applyQuickSelect"
          />
        </div>
      </div>
      <div class="flex justify-content-end mt-3">
        <Button 
          icon="pi pi-refresh" 
          label="Update Dashboard" 
          @click="updateDashboard"
          :disabled="!dateRangeValid"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useFinanceStore } from '../../../stores/finance';
import DatePicker from 'primevue/datepicker';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

const financeStore = useFinanceStore();
const selectedQuickOption = ref(null);

// Define quick selection options
const quickSelectOptions = [
  { label: 'Current Month', value: 'current_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 3 Months', value: 'last_3_months' },
  { label: 'Last 6 Months', value: 'last_6_months' },
  { label: 'Year to Date', value: 'ytd' },
  { label: 'Last Year', value: 'last_year' }
];

// Computed for two-way binding with the store
const dateRange = computed({
  get: () => financeStore.dateRange,
  set: (value) => financeStore.setDateRange(value),
});

// Validate date range
const dateRangeValid = computed(() => {
  return dateRange.value && 
         dateRange.value[0] !== null && 
         dateRange.value[1] !== null;
});

// Initialize with default date range (last 30 days)
function initDefaultDateRange() {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  financeStore.setDateRange([thirtyDaysAgo, today]);
  console.log('[DateRangeFilter] Initialized with default date range:', [thirtyDaysAgo, today]);
}

// Apply quick select option
function applyQuickSelect() {
  if (!selectedQuickOption.value) return;
  
  const today = new Date();
  let startDate = new Date();
  let endDate = new Date();
  
  switch (selectedQuickOption.value.value) {
    case 'current_month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = today;
      break;
    case 'last_month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case 'last_3_months':
      startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      endDate = today;
      break;
    case 'last_6_months':
      startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);
      endDate = today;
      break;
    case 'ytd':
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = today;
      break;
    case 'last_year':
      startDate = new Date(today.getFullYear() - 1, 0, 1);
      endDate = new Date(today.getFullYear() - 1, 11, 31);
      break;
  }
  
  financeStore.setDateRange([startDate, endDate]);
  console.log(`[DateRangeFilter] Applied quick select: ${selectedQuickOption.value.label}`, [startDate, endDate]);
}

// Manually trigger dashboard update
function updateDashboard() {
  if (dateRangeValid.value) {
    console.log('[DateRangeFilter] Manually updating dashboard with date range:', dateRange.value);
    financeStore.fetchAllData();
  }
}

// Watch for date range changes
watch(dateRange, () => {
  console.log('[DateRangeFilter] Date range changed to:', dateRange.value);
  // Reset quick select when dates are changed manually
  selectedQuickOption.value = null;
}, { deep: true });

// Initialize with default date range on component mount
onMounted(() => {
  console.log('[DateRangeFilter] Component mounted');
  if (!dateRangeValid.value) {
    initDefaultDateRange();
  } else {
    console.log('[DateRangeFilter] Using existing date range:', dateRange.value);
  }
  // Fetch data on initial load
  financeStore.fetchAllData();
});
</script>

<style scoped>
.filter-container {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
}
</style>