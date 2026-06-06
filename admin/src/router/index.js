import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  {
    path: '/', component: () => import('../layouts/AdminLayout.vue'), redirect: '/dashboard',
    children: [
      { path: 'dashboard', component: () => import('../views/Dashboard.vue'), meta: { label: 'dashboard' } },
      { path: 'products', component: () => import('../views/Products.vue'), meta: { label: 'products' } },
      { path: 'categories', component: () => import('../views/Categories.vue'), meta: { label: 'categories' } },
      { path: 'orders', component: () => import('../views/Orders.vue'), meta: { label: 'orders' } },
      { path: 'users', component: () => import('../views/Users.vue'), meta: { label: 'users' } },
      { path: 'banners', component: () => import('../views/Banners.vue'), meta: { label: 'banners' } },
      { path: 'coupons', component: () => import('../views/Coupons.vue'), meta: { label: 'coupons' } },
      { path: 'stores', component: () => import('../views/Stores.vue'), meta: { label: 'stores' } },
    ]
  }
]
export default createRouter({ history: createWebHistory(), routes })