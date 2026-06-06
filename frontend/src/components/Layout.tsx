import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore, useTabStore } from '../store';

const tabs = [
  { key: 'home' as const, label: '首页', path: '/', icon: '🏠', activeIcon: '🏠' },
  { key: 'menu' as const, label: '点单', path: '/menu', icon: '🍵', activeIcon: '🍵' },
  { key: 'orders' as const, label: '订单', path: '/orders', icon: '📋', activeIcon: '📋' },
  { key: 'mine' as const, label: '我的', path: '/mine', icon: '👤', activeIcon: '👤' },
];

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setActiveTab = useTabStore((s) => s.setActiveTab);
  const totalCount = useCartStore((s) => s.totalCount);

  const currentTab = tabs.find((t) => {
    if (t.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(t.path);
  })?.key || 'home';

  const handleTabClick = (tab: typeof tabs[number]) => {
    setActiveTab(tab.key);
    navigate(tab.path);
  };

  const isProductDetail = location.pathname.startsWith('/product/');
  const isCart = location.pathname === '/cart';
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';
  const hideTabBar = isProductDetail || isCart || isLogin || isRegister;

  return (
    <div className="flex flex-col h-full bg-cream">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      {!hideTabBar && (
        <nav className="flex items-center bg-white border-t border-gray-100 safe-bottom shrink-0" style={{ height: 50 }}>
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab)}
                className="flex-1 flex flex-col items-center justify-center h-full relative"
                style={isActive ? { borderTop: '2px solid #ff7a2e' } : {}}
              >
                <span className="text-lg leading-none">{tab.icon}</span>
                <span
                  className="text-[10px] mt-0.5"
                  style={{ color: isActive ? '#ff7a2e' : '#999', fontWeight: isActive ? 600 : 400 }}
                >
                  {tab.label}
                </span>
                {tab.key === 'menu' && totalCount > 0 && (
                  <span
                    className="absolute -top-0.5 right-1/4 min-w-[16px] h-4 px-1 rounded-full text-[10px] text-white flex items-center justify-center"
                    style={{ background: '#ff7a2e' }}
                  >
                    {totalCount > 99 ? '99+' : totalCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default Layout;