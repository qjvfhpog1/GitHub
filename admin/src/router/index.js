import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'merchants',
        name: 'Merchants',
        component: () => import('../views/Merchants.vue')
      },
      {
        path: 'warehouses',
        name: 'Warehouses',
        component: () => import('../views/Warehouses.vue')
      },
      {
        path: 'regions',
        name: 'Regions',
        component: () => import('../views/Regions.vue')
      },
      {
        path: 'warehouse-admins',
        name: 'WarehouseAdmins',
        component: () => import('../views/WarehouseAdmins.vue')
      },
      {
        path: 'region-admins',
        name: 'RegionAdmins',
        component: () => import('../views/RegionAdmins.vue')
      },
      {
        path: 'fee-config',
        name: 'FeeConfig',
        component: () => import('../views/FeeConfig.vue')
      },
      {
        path: 'finance',
        name: 'Finance',
        component: () => import('../views/Finance.vue')
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('../views/Statistics.vue')
      },
      {
        path: 'system',
        name: 'System',
        component: () => import('../views/System.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('adminToken')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
