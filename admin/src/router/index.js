import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    component: () => import('../layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue'), meta: { title: 'Dashboard' } },
      { path: 'products', name: 'Products', component: () => import('../views/Products.vue'), meta: { title: 'Products' } },
      { path: 'categories', name: 'Categories', component: () => import('../views/Categories.vue'), meta: { title: 'Categories' } },
      { path: 'orders', name: 'Orders', component: () => import('../views/Orders.vue'), meta: { title: 'Orders' } },
      { path: 'users', name: 'Users', component: () => import('../views/Users.vue'), meta: { title: 'Users' } },
      { path: 'banners', name: 'Banners', component: () => import('../views/Banners.vue'), meta: { title: 'Banners' } },
      { path: 'coupons', name: 'Coupons', component: () => import('../views/Coupons.vue'), meta: { title: 'Coupons' } },
      { path: 'stores', name: 'Stores', component: () => import('../views/Stores.vue'), meta: { title: 'Stores' } },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
