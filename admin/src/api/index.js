import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000
})

export const adminApi = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Products
  getProducts: () => api.get('/admin/products'),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put('/admin/products/' + id, data),
  deleteProduct: (id) => api.delete('/admin/products/' + id),
  
  // Categories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put('/admin/categories/' + id, data),
  deleteCategory: (id) => api.delete('/admin/categories/' + id),
  
  // Orders
  getOrders: (status) => api.get('/admin/orders', { params: status !== undefined ? { status } : {} }),
  updateOrderStatus: (id, status) => api.put('/admin/orders/' + id + '/status', { status }),
  
  // Users
  getUsers: () => api.get('/admin/users'),
  
  // Banners
  getBanners: () => api.get('/admin/banners'),
  createBanner: (data) => api.post('/admin/banners', data),
  updateBanner: (id, data) => api.put('/admin/banners/' + id, data),
  deleteBanner: (id) => api.delete('/admin/banners/' + id),
  
  // Coupons
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  deleteCoupon: (id) => api.delete('/admin/coupons/' + id),
  
  // Stores
  getStores: () => api.get('/admin/stores'),
  createStore: (data) => api.post('/admin/stores', data),
  updateStore: (id, data) => api.put('/admin/stores/' + id, data),
  deleteStore: (id) => api.delete('/admin/stores/' + id),
  
  // Toppings
  getToppings: () => api.get('/admin/toppings'),
}

export default api
