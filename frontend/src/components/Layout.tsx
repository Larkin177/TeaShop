import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTabStore, useCartStore, useStoreSelectionStore } from '../store';
import { Home, HomeFill, Menu, MenuFill, Order, OrderFill, Mine, MineFill } from './Icons';

type TabType = 'home' | 'menu' | 'orders' | 'mine';

interface TabItem {
  key: TabType;
  label: string;
  path: string;
  icon: React.FC<{ size?: number; color?: string }>;
  activeIcon: React.FC<{ size?: number; color?: string }>;
}

const tabs: TabItem[] = [
  { key: 'home', label: '首页', path: '/', icon: Home, activeIcon: HomeFill },
  { key: 'menu', label: '点单', path: '/menu', icon: Menu, activeIcon: MenuFill },
  { key: 'orders', label: '订单', path: '/orders', icon: Order, activeIcon: OrderFill },
  { key: 'mine', label: '我的', path: '/mine', icon: Mine, activeIcon: MineFill },
];

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTab, setActiveTab } = useTabStore();
  const { totalCount, fetchCart } = useCartStore();
  const { loadStore } = useStoreSelectionStore();

  useEffect(() => {
    loadStore();
    fetchCart();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path.startsWith('/menu')) setActiveTab('menu');
    else if (path.startsWith('/orders')) setActiveTab('orders');
    else if (path.startsWith('/mine')) setActiveTab('mine');
  }, [location.pathname]);

  const isTabVisible = ['/', '/menu', '/orders', '/mine'].includes(location.pathname);
  const isProductDetail = location.pathname.startsWith('/product/');
  const isFullscreen = ['/login', '/register', '/store-select'].includes(location.pathname) || isProductDetail;

  const handleTabClick = (tab: TabItem) => {
    setActiveTab(tab.key);
    navigate(tab.path);
  };

  return (
    <div className="h-full flex flex-col bg-guming-bg">
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>

      {!isFullscreen && isTabVisible && (
        <nav className="flex-shrink-0 bg-white border-t border-guming-border safe-bottom">
          <div className="flex items-center h-14">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const IconComp = isActive ? tab.activeIcon : tab.icon;
              const showBadge = tab.key === 'menu' && totalCount > 0;

              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab)}
                  className="flex-1 flex flex-col items-center justify-center h-full relative transition-colors"
                >
                  {isActive && (
                    <span className="absolute top-0 w-5 h-0.5 rounded-full bg-brand-500" />
                  )}
                  <div className="relative">
                    <IconComp size={22} color={isActive ? '#FF7A2E' : '#999'} />
                    {showBadge && (
                      <span className="absolute -top-1.5 -right-3 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                        {totalCount > 99 ? '99+' : totalCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      isActive ? 'text-brand-500 font-medium' : 'text-guming-sub'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;