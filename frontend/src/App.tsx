import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from './store';
import Layout from './components/Layout';
import Loading from './components/Loading';

const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Mine = lazy(() => import('./pages/Mine'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const MyCoupons = lazy(() => import('./pages/MyCoupons'));
const MyAddresses = lazy(() => import('./pages/MyAddresses'));
const StoreSelect = lazy(() => import('./pages/StoreSelect'));
const CouponCenter = lazy(() => import('./pages/CouponCenter'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Suspense fallback={<Loading fullScreen text="加载中..." />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="menu/:categoryId" element={<Menu />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route path="mine" element={<Mine />} />
          <Route
            path="mine/coupons"
            element={
              <ProtectedRoute>
                <MyCoupons />
              </ProtectedRoute>
            }
          />
          <Route
            path="mine/addresses"
            element={
              <ProtectedRoute>
                <MyAddresses />
              </ProtectedRoute>
            }
          />
          <Route path="store-select" element={<StoreSelect />} />
          <Route path="coupon-center" element={<CouponCenter />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;