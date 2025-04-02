import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'

// Type declaration for window.__APP_STATE__
declare global {
  interface Window {
    __APP_STATE__?: {
      isAuthenticated?: boolean;
    };
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
          title: 'Dashboard',
          requiresAuth: true
        }
      },
      // Finance routes
      {
        path: 'finance',
        children: [
          {
            path: '',
            name: 'Finance',
            component: () => import('../views/finance/FinancialDashboard.vue'),
            meta: {
              title: 'Finance',
              requiresAuth: true
            }
          },
          {
            path: 'dashboard',
            name: 'FinancialDashboard',
            component: () => import('../views/finance/FinancialDashboard.vue'),
            meta: {
              title: 'Financial Dashboard',
              requiresAuth: true
            }
          },
          {
            path: 'reports',
            name: 'FinancialReports',
            component: () => import('../views/finance/FinancialReports.vue'),
            meta: {
              title: 'Financial Reports',
              requiresAuth: true
            }
          },
          {
            path: 'accounts-receivable',
            name: 'AccountsReceivable',
            component: () => import('../views/finance/AccountsReceivable.vue'),
            meta: {
              title: 'Accounts Receivable',
              requiresAuth: true
            }
          },
          {
            path: 'invoices/:id',
            name: 'SalesInvoiceDetails',
            component: () => import('../views/finance/SalesInvoiceDetails.vue'),
            props: true,
            meta: {
              title: 'Invoice Details',
              requiresAuth: true
            }
          },
          {
            path: 'customers/:id',
            name: 'CustomerDetails',
            component: () => import('../views/finance/CustomerDetails.vue'),
            props: true,
            meta: {
              title: 'Customer Details',
              requiresAuth: true
            }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: 'Login',
      guest: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '404 Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation guard
router.beforeEach((to, from, next) => {
  // Set document title
  document.title = to.meta.title ? `${to.meta.title} | TritonV3` : 'TritonV3'
  
  console.log(`[Router] Navigating from "${from.path}" to "${to.path}"`);
  console.log(`[Router] Route requires auth:`, to.meta.requiresAuth);
  console.log(`[Router] Route meta:`, to.meta);
  
  // Check for authenticated state from token
  const hasToken = !!localStorage.getItem('auth_token');
  const isAuthenticated = window.__APP_STATE__?.isAuthenticated || hasToken;
  
  console.log(`[Router Guard] hasToken:`, hasToken);
  console.log(`[Router Guard] isAuthenticated from state:`, window.__APP_STATE__?.isAuthenticated);
  console.log(`[Router Guard] final isAuthenticated:`, isAuthenticated);
  
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {    
    console.log(`[Router Guard] Route "${to.path}" requires authentication`);
    
    if (!isAuthenticated) {
      console.warn(`[Router Guard] User not authenticated, redirecting to login`);
      
      // Redirect to login page with return URL
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    } else {
      console.log(`[Router Guard] User is authenticated, proceeding to ${to.path}`);
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    // For guest-only routes, check if already authenticated
    if (isAuthenticated) {
      console.log(`[Router Guard] Authenticated user trying to access guest route, redirecting to dashboard`);
      next({ path: '/' });
      return;
    }
  }
  
  // Proceed with navigation
  next();
})

export default router 