<template>
  <div class="accounts-receivable p-4">
    <div class="flex align-items-center justify-content-between mb-4">
      <h1 class="text-2xl font-semibold m-0">Accounts Receivable</h1>
      
      <div class="flex align-items-center">
        <Dropdown
          v-model="filters.company"
          :options="companies"
          optionLabel="displayName"
          optionValue="id"
          placeholder="Select Company"
          class="w-full md:w-14rem mr-2"
          @change="handleCompanyChange"
        />
        
        <Button 
          label="Export" 
          icon="pi pi-download" 
          class="p-button-outlined"
          @click="openExportDialog"
        />
      </div>
    </div>
    
    <TabView v-model:activeIndex="activeTabIndex">
      <TabPanel header="Sales Invoices">
        <div class="ar-filters mb-4">
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-3 mb-2">
              <span class="p-float-label">
                <Calendar 
                  v-model="filters.dateRange" 
                  selectionMode="range"
                  dateFormat="mm/dd/yy"
                  class="w-full"
                  inputId="date-range"
                />
                <label for="date-range">Date Range</label>
              </span>
            </div>
            
            <div class="col-12 md:col-6 lg:col-3 mb-2">
              <span class="p-float-label">
                <Dropdown
                  v-model="filters.status"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full"
                  inputId="status-filter"
                />
                <label for="status-filter">Status</label>
              </span>
            </div>
            
            <div class="col-12 md:col-6 lg:col-3 mb-2">
              <span class="p-float-label p-input-icon-right">
                <i class="pi pi-search" />
                <InputText 
                  v-model="filters.searchTerm" 
                  class="w-full" 
                  id="search-term"
                  @keyup.enter="loadInvoices"
                />
                <label for="search-term">Search Customer/Invoice</label>
              </span>
            </div>
            
            <div class="col-12 md:col-6 lg:col-3 mb-2 flex align-items-end">
              <Button 
                label="Apply Filters" 
                icon="pi pi-filter" 
                class="p-button-primary mr-2"
                @click="loadInvoices"
              />
              <Button 
                icon="pi pi-refresh" 
                class="p-button-outlined"
                @click="resetFilters"
              />
            </div>
          </div>
        </div>
        
        <div class="grid">
          <div class="col-12 lg:col-3 mb-3 lg:mb-0 order-2 lg:order-1">
            <div class="grid">
              <div class="col-6 lg:col-12">
                <Card class="mb-3">
                  <template #title>Total Outstanding</template>
                  <template #content>
                    <span class="text-2xl font-semibold text-primary">
                      {{ formatCurrency(invoiceSummary.totalOutstanding) }}
                    </span>
                    <div class="mt-2 text-sm">
                      <span :class="getPercentageClass(invoiceSummary.changePercentage)">
                        <i :class="getPercentageIcon(invoiceSummary.changePercentage)"></i>
                        {{ invoiceSummary.changePercentage }}%
                      </span>
                      <span class="text-color-secondary ml-2">vs last period</span>
                    </div>
                  </template>
                </Card>
              </div>
              
              <div class="col-6 lg:col-12">
                <Card class="mb-3">
                  <template #title>Overdue Amount</template>
                  <template #content>
                    <span class="text-2xl font-semibold text-danger">
                      {{ formatCurrency(invoiceSummary.overdueAmount) }}
                    </span>
                    <div class="mt-2 text-sm">
                      <span>{{ invoiceSummary.overduePercentage }}% of total outstanding</span>
                    </div>
                  </template>
                </Card>
              </div>
              
              <div class="col-12">
                <Card>
                  <template #title>Quick Filters</template>
                  <template #content>
                    <div class="quick-filter-buttons">
                      <Button 
                        label="All Invoices" 
                        class="p-button-text p-button-sm mb-2 w-full text-left"
                        :class="{ 'active-filter': filters.status === '' }"
                        @click="quickFilter('all')"
                      />
                      <Button 
                        label="Open Invoices" 
                        class="p-button-text p-button-sm mb-2 w-full text-left"
                        :class="{ 'active-filter': filters.status === 'Open' }"
                        @click="quickFilter('open')"
                      />
                      <Button 
                        label="Overdue" 
                        class="p-button-text p-button-sm mb-2 w-full text-left"
                        :class="{ 'active-filter': filters.status === 'Overdue' }"
                        @click="quickFilter('overdue')"
                      />
                      <Button 
                        label="Paid Invoices" 
                        class="p-button-text p-button-sm mb-2 w-full text-left"
                        :class="{ 'active-filter': filters.status === 'Paid' }"
                        @click="quickFilter('paid')"
                      />
                      <Button 
                        label="Last 30 Days" 
                        class="p-button-text p-button-sm mb-2 w-full text-left"
                        :class="{ 'active-filter': isLast30DaysActive }"
                        @click="quickFilter('last30days')"
                      />
                    </div>
                  </template>
                </Card>
              </div>
            </div>
          </div>
          
          <div class="col-12 lg:col-9 order-1 lg:order-2">
            <Card>
              <template #content>
                <SalesInvoicesList 
                  :invoices="invoices" 
                  :isLoading="isLoading"
                  @view-invoice="viewInvoice"
                  @record-payment="recordPayment"
                  @send-reminder="sendReminder"
                />
                
                <Paginator 
                  v-if="invoices.length > 0"
                  :rows="pageSize" 
                  :totalRecords="totalRecords"
                  v-model:first="first"
                  :rowsPerPageOptions="[10, 25, 50]"
                  @page="onPage"
                  class="mt-3"
                ></Paginator>
                
                <div v-else-if="!isLoading" class="text-center py-6">
                  <i class="pi pi-inbox text-5xl text-color-secondary mb-4"></i>
                  <h3 class="m-0 mb-2">No invoices found</h3>
                  <p class="text-color-secondary">Try adjusting your filters to find what you're looking for.</p>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </TabPanel>
      
      <TabPanel header="Aging">
        <ArAgingTable 
          :agingData="arAging.customers" 
          :isLoading="isLoadingAging"
          @view-customer="viewCustomer"
          @send-reminder="showSendReminderDialog"
        />
      </TabPanel>
      
      <TabPanel header="Customers">
        <div class="grid">
          <div class="col-12 lg:col-5">
            <Card>
              <template #content>
                <CustomersList
                  :preselected-customer-id="selectedCustomerId"
                  @customer-selected="onCustomerSelected"
                  @view-invoices="viewCustomerInvoices"
                />
              </template>
            </Card>
          </div>
          
          <div class="col-12 lg:col-7">
            <CustomerDetailsCard
              :customer-id="selectedCustomerId"
              @view-all-invoices="viewCustomerInvoices"
              @edit-customer="showEditCustomerDialog"
              @view-invoice="viewInvoice"
              @record-payment="recordPayment"
              @send-reminder="sendReminder"
            />
          </div>
        </div>
      </TabPanel>
    </TabView>
    
    <!-- Dialogs will be added later -->
    <Dialog 
      v-model:visible="viewInvoiceDialogVisible" 
      header="View Invoice" 
      :style="{width: '80vw'}"
      modal
    >
      <div v-if="selectedInvoice" class="p-4">
        <p class="mb-4">This is where the invoice details would be displayed.</p>
        <div class="grid">
          <div class="col-6">
            <p><strong>Invoice Number:</strong> {{ selectedInvoice.invoiceNumber }}</p>
            <p><strong>Customer:</strong> {{ selectedInvoice.customerName }}</p>
            <p><strong>Date:</strong> {{ formatDate(selectedInvoice.date) }}</p>
            <p><strong>Due Date:</strong> {{ formatDate(selectedInvoice.dueDate) }}</p>
          </div>
          <div class="col-6">
            <p><strong>Amount:</strong> {{ formatCurrency(selectedInvoice.amount) }}</p>
            <p><strong>Remaining:</strong> {{ formatCurrency(selectedInvoice.remainingAmount) }}</p>
            <p><strong>Status:</strong> {{ selectedInvoice.status }}</p>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useFinanceApi } from '@/composables/finance/useFinanceApi.ts';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Card from 'primevue/card';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';
import SalesInvoicesList from '@/components/finance/accountsReceivable/SalesInvoicesList.vue';
import ArAgingTable from '@/components/finance/accountsReceivable/ArAgingTable.vue';
import CustomersList from '@/components/finance/accountsReceivable/CustomersList.vue';
import CustomerDetailsCard from '@/components/finance/accountsReceivable/CustomerDetailsCard.vue';

const { 
  isLoading, 
  error, 
  fetchCompanies, 
  fetchSalesInvoices, 
  fetchArAging 
} = useFinanceApi();

// State variables
const companies = ref([]);
const invoices = ref([]);
const arAging = ref({ customers: [] });
const activeTabIndex = ref(0);
const first = ref(0);
const pageSize = ref(10);
const totalRecords = ref(0);
const isLoadingAging = ref(false);
const selectedCustomerId = ref('');
const selectedInvoice = ref(null);
const viewInvoiceDialogVisible = ref(false);

// Filter options
const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Open', value: 'Open' },
  { label: 'Overdue', value: 'Overdue' },
  { label: 'Paid', value: 'Paid' }
];

// Filter state
const filters = reactive({
  company: '',
  dateRange: null,
  status: '',
  searchTerm: ''
});

// Computed summary data
const invoiceSummary = computed(() => {
  return {
    totalOutstanding: 75000,
    overdueAmount: 28000,
    overduePercentage: 37,
    changePercentage: -5.4
  };
});

const isLast30DaysActive = computed(() => {
  if (!filters.dateRange) return false;
  
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const startDate = new Date(filters.dateRange[0]);
  const endDate = filters.dateRange[1] ? new Date(filters.dateRange[1]) : null;
  
  return startDate.toDateString() === thirtyDaysAgo.toDateString() && 
         endDate && endDate.toDateString() === today.toDateString();
});

// Utility methods
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getPercentageClass(value) {
  if (value > 0) return 'text-green-500';
  if (value < 0) return 'text-red-500';
  return 'text-gray-500';
}

function getPercentageIcon(value) {
  if (value > 0) return 'pi pi-arrow-up';
  if (value < 0) return 'pi pi-arrow-down';
  return 'pi pi-minus';
}

// Data loading methods
async function loadCompanies() {
  try {
    companies.value = await fetchCompanies();
    if (companies.value.length > 0 && !filters.company) {
      filters.company = companies.value[0].id;
    }
  } catch (err) {
    console.error('Error loading companies:', err);
  }
}

async function loadInvoices() {
  first.value = 0; // Reset to first page when filters change
  
  const params = {
    $orderby: 'date desc',
    $skip: first.value,
    $top: pageSize.value
  };
  
  // Build filter string
  const filterParts = [];
  
  if (filters.status) {
    filterParts.push(`status eq '${filters.status}'`);
  }
  
  if (filters.dateRange && filters.dateRange[0]) {
    const startDate = new Date(filters.dateRange[0]).toISOString().split('T')[0];
    let endDate;
    
    if (filters.dateRange[1]) {
      endDate = new Date(filters.dateRange[1]).toISOString().split('T')[0];
    } else {
      endDate = startDate;
    }
    
    filterParts.push(`date ge ${startDate} and date le ${endDate}`);
  }
  
  if (filterParts.length > 0) {
    params.$filter = filterParts.join(' and ');
  }
  
  try {
    const result = await fetchSalesInvoices(params);
    invoices.value = result.value || [];
    totalRecords.value = result['@odata.count'] || 0;
  } catch (err) {
    console.error('Error loading invoices:', err);
  }
}

async function loadArAging() {
  isLoadingAging.value = true;
  
  try {
    arAging.value = await fetchArAging(filters.company);
  } catch (err) {
    console.error('Error loading AR aging data:', err);
  } finally {
    isLoadingAging.value = false;
  }
}

// Event handlers
function handleCompanyChange() {
  loadInvoices();
  loadArAging();
}

function onPage(event) {
  first.value = event.first;
  pageSize.value = event.rows;
  loadInvoices();
}

function resetFilters() {
  filters.dateRange = null;
  filters.status = '';
  filters.searchTerm = '';
  loadInvoices();
}

function quickFilter(filterType) {
  switch (filterType) {
    case 'all':
      filters.status = '';
      filters.dateRange = null;
      break;
    case 'open':
      filters.status = 'Open';
      filters.dateRange = null;
      break;
    case 'overdue':
      filters.status = 'Overdue';
      filters.dateRange = null;
      break;
    case 'paid':
      filters.status = 'Paid';
      filters.dateRange = null;
      break;
    case 'last30days':
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      filters.dateRange = [thirtyDaysAgo, today];
      filters.status = '';
      break;
  }
  
  loadInvoices();
}

function viewInvoice(invoice) {
  selectedInvoice.value = invoice;
  viewInvoiceDialogVisible.value = true;
}

function recordPayment(invoice) {
  // This would open a dialog to record a payment
  // For now, just log to console
  console.log('Record payment for invoice:', invoice.invoiceNumber);
}

function sendReminder(invoice) {
  // This would open a dialog to send a reminder
  // For now, just log to console
  console.log('Send reminder for invoice:', invoice.invoiceNumber);
}

function viewCustomer(customer) {
  selectedCustomerId.value = customer.id;
  activeTabIndex.value = 2; // Switch to Customers tab
}

function onCustomerSelected(customer) {
  selectedCustomerId.value = customer ? customer.id : '';
}

function viewCustomerInvoices(customer) {
  // Switch to Invoices tab and filter by customer
  activeTabIndex.value = 0;
  filters.searchTerm = customer.name;
  loadInvoices();
}

function showEditCustomerDialog(customer) {
  // This would open a dialog to edit customer details
  // For now, just log to console
  console.log('Edit customer:', customer.name);
}

function showSendReminderDialog(customer) {
  // This would open a dialog to send a reminder to customer
  // For now, just log to console
  console.log('Send reminder to customer:', customer.name);
}

function openExportDialog() {
  // This would open a dialog to export data
  // For now, just log to console
  console.log('Open export dialog');
}

// Watch for tab changes
watch(() => activeTabIndex.value, (newIndex) => {
  if (newIndex === 0) {
    loadInvoices();
  } else if (newIndex === 1) {
    loadArAging();
  }
});

// Initialize data
onMounted(async () => {
  await loadCompanies();
  loadInvoices();
});
</script>

<style scoped>
.accounts-receivable :deep(.p-tabview-nav) {
  border-bottom: 1px solid var(--surface-border);
}

.accounts-receivable :deep(.p-tabview-nav li .p-tabview-nav-link) {
  padding: 1rem;
}

.active-filter {
  font-weight: bold !important;
  color: var(--primary-color) !important;
  background-color: var(--primary-50) !important;
}

.quick-filter-buttons :deep(.p-button-label) {
  flex-grow: 1;
  text-align: left;
}
</style> 