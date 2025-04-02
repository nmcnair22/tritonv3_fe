<template>
  <div class="customer-details p-3">
    <div v-if="isLoading" class="flex justify-content-center align-items-center" style="min-height: 200px">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="!customer" class="flex justify-content-center align-items-center" style="min-height: 200px">
      <div class="text-center">
        <i class="pi pi-exclamation-circle text-xl mb-3 text-blue-500"></i>
        <p>No customer selected. Please select a customer to view details.</p>
      </div>
    </div>
    
    <div v-else class="customer-profile">
      <div class="flex align-items-start justify-content-between mb-4">
        <div>
          <h2 class="text-xl font-bold m-0">{{ customer.name }}</h2>
          <p class="text-color-secondary mt-1 mb-2">{{ customer.id }}</p>
          
          <div class="flex align-items-center mt-3">
            <Tag 
              :severity="customer.status === 'Active' ? 'success' : 'danger'" 
              :value="customer.status"
              class="mr-2"
            />
            <Tag 
              v-if="customer.balance > customer.creditLimit * 0.8" 
              severity="warning" 
              value="Near Credit Limit"
            />
          </div>
        </div>
        
        <div class="text-right">
          <Button 
            icon="pi pi-envelope" 
            class="p-button-text" 
            v-tooltip="'Email Customer'"
            @click="emailCustomer"
          />
          <Button 
            icon="pi pi-file-edit" 
            class="p-button-text" 
            v-tooltip="'Edit Customer'"
            @click="editCustomer"
          />
        </div>
      </div>
      
      <Divider />
      
      <div class="grid">
        <div class="col-12 md:col-6">
          <Card class="mb-3">
            <template #title>Contact Information</template>
            <template #content>
              <ul class="list-none p-0 m-0">
                <li class="mb-2">
                  <span class="font-semibold">Contact:</span> {{ customer.contact }}
                </li>
                <li class="mb-2">
                  <span class="font-semibold">Email:</span> 
                  <a :href="`mailto:${customer.email}`" class="text-primary">{{ customer.email }}</a>
                </li>
                <li>
                  <span class="font-semibold">Phone:</span> {{ customer.phone }}
                </li>
              </ul>
            </template>
          </Card>
        </div>
        
        <div class="col-12 md:col-6">
          <Card class="mb-3">
            <template #title>Financial Overview</template>
            <template #content>
              <ul class="list-none p-0 m-0">
                <li class="mb-2">
                  <span class="font-semibold">Current Balance:</span> 
                  <span :class="{'text-danger': customer.balance > 0}">
                    {{ formatCurrency(customer.balance) }}
                  </span>
                </li>
                <li class="mb-2">
                  <span class="font-semibold">Credit Limit:</span> {{ formatCurrency(customer.creditLimit) }}
                </li>
                <li>
                  <span class="font-semibold">Credit Utilization:</span>
                  <ProgressBar 
                    :value="creditUtilizationPercentage" 
                    :class="creditUtilizationClass"
                    class="mt-2"
                  />
                </li>
              </ul>
            </template>
          </Card>
        </div>
      </div>
      
      <Card class="mt-3">
        <template #title>Recent Invoices</template>
        <template #content>
          <div v-if="isLoadingInvoices" class="flex justify-content-center p-3">
            <ProgressSpinner style="width: 40px; height: 40px" />
          </div>
          <div v-else-if="customerInvoices.length === 0" class="p-3 text-center text-color-secondary">
            No recent invoices found
          </div>
          <SalesInvoicesList 
            v-else
            :invoices="customerInvoices" 
            :is-loading="isLoadingInvoices"
            :is-compact="true"
            @view-invoice="viewInvoice"
            @record-payment="recordPayment"
            @send-reminder="sendReminder"
          />
        </template>
      </Card>
      
      <div class="flex justify-content-end mt-4">
        <Button 
          label="View All Invoices" 
          icon="pi pi-external-link" 
          class="p-button-outlined"
          @click="viewAllInvoices"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useFinanceApi } from '@/composables/finance/useFinanceApi.ts';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import SalesInvoicesList from './SalesInvoicesList.vue';

const props = defineProps({
  customerId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['view-all-invoices', 'edit-customer', 'view-invoice', 'record-payment', 'send-reminder']);

const { isLoading, error, fetchCustomers, fetchSalesInvoices } = useFinanceApi();
const customer = ref(null);
const customerInvoices = ref([]);
const isLoadingInvoices = ref(false);

const creditUtilizationPercentage = computed(() => {
  if (!customer.value || customer.value.creditLimit === 0) return 0;
  return Math.min(Math.round((customer.value.balance / customer.value.creditLimit) * 100), 100);
});

const creditUtilizationClass = computed(() => {
  const percentage = creditUtilizationPercentage.value;
  if (percentage > 80) return 'customer-progress-danger';
  if (percentage > 60) return 'customer-progress-warning';
  return 'customer-progress-success';
});

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
}

async function loadCustomerDetails() {
  if (!props.customerId) {
    customer.value = null;
    return;
  }
  
  try {
    const result = await fetchCustomers({
      $filter: `id eq '${props.customerId}'`
    });
    
    if (result.value && result.value.length > 0) {
      customer.value = result.value[0];
      await loadCustomerInvoices();
    } else {
      customer.value = null;
    }
  } catch (err) {
    console.error('Error loading customer details:', err);
  }
}

async function loadCustomerInvoices() {
  if (!customer.value) return;
  
  isLoadingInvoices.value = true;
  
  try {
    const result = await fetchSalesInvoices({
      $filter: `customerId eq '${customer.value.id}'`,
      $orderby: 'date desc',
      $top: 5
    });
    
    customerInvoices.value = result.value || [];
  } catch (err) {
    console.error('Error loading customer invoices:', err);
  } finally {
    isLoadingInvoices.value = false;
  }
}

function viewAllInvoices() {
  emit('view-all-invoices', customer.value);
}

function editCustomer() {
  emit('edit-customer', customer.value);
}

function emailCustomer() {
  if (customer.value && customer.value.email) {
    window.location.href = `mailto:${customer.value.email}`;
  }
}

function viewInvoice(invoice) {
  emit('view-invoice', invoice);
}

function recordPayment(invoice) {
  emit('record-payment', invoice);
}

function sendReminder(invoice) {
  emit('send-reminder', invoice);
}

watch(() => props.customerId, (newId) => {
  if (newId) {
    loadCustomerDetails();
  } else {
    customer.value = null;
  }
});

onMounted(() => {
  if (props.customerId) {
    loadCustomerDetails();
  }
});
</script>

<style scoped>
.customer-progress-success .p-progressbar-value {
  background-color: var(--green-500);
}

.customer-progress-warning .p-progressbar-value {
  background-color: var(--yellow-500);
}

.customer-progress-danger .p-progressbar-value {
  background-color: var(--red-500);
}
</style> 