<template>
  <div class="customers-list">
    <div class="flex flex-column md:flex-row mb-3 align-items-center">
      <div class="p-inputgroup mb-3 md:mb-0 md:mr-3" style="max-width: 300px">
        <span class="p-inputgroup-addon">
          <i class="pi pi-search"></i>
        </span>
        <InputText 
          v-model="filters.searchTerm" 
          placeholder="Search customers..."
          @keyup.enter="loadCustomers"
        />
        <Button 
          icon="pi pi-search" 
          @click="loadCustomers"
        />
      </div>
      
      <div class="flex align-items-center">
        <Dropdown
          v-model="filters.status"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="All Statuses"
          class="md:w-12rem mr-2"
          @change="loadCustomers"
        />
        
        <Dropdown
          v-model="filters.sortBy"
          :options="sortOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Sort By"
          class="md:w-12rem"
          @change="loadCustomers"
        />
      </div>
    </div>
    
    <DataTable 
      :value="customers" 
      :loading="isLoading"
      class="p-datatable-sm"
      removableSort
      v-model:selection="selectedCustomer"
      selectionMode="single"
      dataKey="id"
      :paginator="true"
      :rows="pageSize"
      :totalRecords="totalRecords"
      :rowsPerPageOptions="[10, 25, 50]"
      v-model:first="first"
      @page="onPage"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="{first} to {last} of {totalRecords} customers"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      responsiveLayout="scroll"
      stripedRows
    >
      <Column field="id" header="ID" sortable></Column>
      <Column field="name" header="Customer Name" sortable></Column>
      <Column field="contact" header="Contact Person"></Column>
      <Column field="balance" header="Balance" sortable>
        <template #body="slotProps">
          <span :class="{'text-danger': slotProps.data.balance > 0}">
            {{ formatCurrency(slotProps.data.balance) }}
          </span>
        </template>
      </Column>
      <Column field="status" header="Status">
        <template #body="slotProps">
          <Tag 
            :severity="slotProps.data.status === 'Active' ? 'success' : 'danger'" 
            :value="slotProps.data.status"
          />
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <div class="flex">
            <Button 
              icon="pi pi-eye" 
              class="p-button-text p-button-rounded p-button-sm" 
              v-tooltip="'View Details'"
              @click="viewCustomer(slotProps.data)"
            />
            <Button 
              icon="pi pi-file-invoice" 
              class="p-button-text p-button-rounded p-button-sm" 
              v-tooltip="'View Invoices'"
              @click="viewInvoices(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

const props = defineProps({
  preselectedCustomerId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['customer-selected', 'view-invoices']);

const { isLoading, error, fetchCustomers } = useFinanceApi();
const customers = ref([]);
const selectedCustomer = ref(null);
const totalRecords = ref(0);
const first = ref(0);
const pageSize = ref(10);

const filters = reactive({
  searchTerm: '',
  status: '',
  sortBy: 'name'
});

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
];

const sortOptions = [
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Name (Z-A)', value: 'name desc' },
  { label: 'Balance (Low-High)', value: 'balance' },
  { label: 'Balance (High-Low)', value: 'balance desc' }
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
}

async function loadCustomers() {
  const params = {
    $orderby: filters.sortBy,
    $skip: first.value,
    $top: pageSize.value
  };
  
  // Build filter string
  const filterParts = [];
  
  if (filters.searchTerm) {
    filterParts.push(`contains(name, '${filters.searchTerm}') or contains(id, '${filters.searchTerm}')`);
  }
  
  if (filters.status) {
    filterParts.push(`status eq '${filters.status}'`);
  }
  
  if (filterParts.length > 0) {
    params.$filter = filterParts.join(' and ');
  }
  
  try {
    const result = await fetchCustomers(params);
    customers.value = result.value || [];
    totalRecords.value = result['@odata.count'] || 0;
    
    // If preselectedCustomerId is provided, select that customer
    if (props.preselectedCustomerId && customers.value.length > 0) {
      selectedCustomer.value = customers.value.find(c => c.id === props.preselectedCustomerId) || null;
    }
  } catch (err) {
    console.error('Error loading customers:', err);
  }
}

function onPage(event) {
  first.value = event.first;
  pageSize.value = event.rows;
  loadCustomers();
}

function onRowSelect(event) {
  emit('customer-selected', event.data);
}

function onRowUnselect() {
  emit('customer-selected', null);
}

function viewCustomer(customer) {
  selectedCustomer.value = customer;
  emit('customer-selected', customer);
}

function viewInvoices(customer) {
  emit('view-invoices', customer);
}

watch(() => props.preselectedCustomerId, (newId) => {
  if (newId && (!selectedCustomer.value || selectedCustomer.value.id !== newId)) {
    // If the customer is not in the current page, we might need to fetch it
    const customerInCurrentPage = customers.value.find(c => c.id === newId);
    if (customerInCurrentPage) {
      selectedCustomer.value = customerInCurrentPage;
    } else {
      // Reset page and load with the new customer ID
      first.value = 0;
      loadCustomers();
    }
  }
});

onMounted(() => {
  loadCustomers();
});
</script>

<style scoped>
.customers-list :deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}
</style> 