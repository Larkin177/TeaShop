import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === 0 || res.code === 200) {
      return res;
    }
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const get = (url: string, params?: any, config?: AxiosRequestConfig) =>
  instance.get(url, { params, ...config }) as any;

const post = (url: string, data?: any, config?: AxiosRequestConfig) =>
  instance.post(url, data, config) as any;

const put = (url: string, data?: any, config?: AxiosRequestConfig) =>
  instance.put(url, data, config) as any;

const del = (url: string, config?: AxiosRequestConfig) =>
  instance.delete(url, config) as any;

// Auth
export const login = (phone: string, password: string) =>
  post('/auth/login', { phone, password });
export const register = (phone: string, password: string, nickname?: string) =>
  post('/auth/register', { phone, password, nickname });
export const getProfile = () => get('/auth/profile');
export const updateProfile = (data: any) => put('/auth/profile', data);

// Products
export const getCategories = () => get('/categories');
export const getProducts = (params?: any) => get('/products', params);
export const getRecommendedProducts = () => get('/products/recommended');
export const getProductDetail = (id: number) => get(`/products/${id}`);

// Stores
export const getStores = () => get('/stores');
export const getStoreDetail = (id: number) => get(`/stores/${id}`);

// Cart
export const getCart = () => get('/cart');
export const addToCart = (data: any) => post('/cart', data);
export const updateCartItem = (id: number, quantity: number) =>
  put(`/cart/${id}`, { quantity });
export const removeCartItem = (id: number) => del(`/cart/${id}`);
export const clearCart = () => del('/cart');

// Orders
export const createOrder = (data: any) => post('/orders', data);
export const getOrders = (params?: any) => get('/orders', params);
export const getOrderDetail = (id: number) => get(`/orders/${id}`);
export const cancelOrder = (id: number) => put(`/orders/${id}/cancel`);
export const payOrder = (id: number) => put(`/orders/${id}/pay`);
export const completeOrder = (id: number) => put(`/orders/${id}/complete`);

// Coupons
export const getAvailableCoupons = () => get('/coupons/available');
export const claimCoupon = (id: number) => post(`/coupons/${id}/claim`);
export const getMyCoupons = () => get('/coupons/my');

// User
export const getUserInfo = () => get('/user/info');
export const getAddresses = () => get('/user/addresses');
export const addAddress = (data: any) => post('/user/addresses', data);
export const updateAddress = (id: number, data: any) =>
  put(`/user/addresses/${id}`, data);
export const deleteAddress = (id: number) => del(`/user/addresses/${id}`);

// Banners
export const getBanners = () => get('/banners');

export default instance;