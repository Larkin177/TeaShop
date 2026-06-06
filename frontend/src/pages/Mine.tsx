import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';
import { ArrowRight } from '../components/Icons';

const menuItems = [
  { icon: '📋', label: '我的订单', path: '/orders' },
  { icon: '🎫', label: '我的优惠券', path: '/mine/coupons' },
  { icon: '📍', label: '收货地址', path: '/mine/addresses' },
  { icon: '⭐', label: '积分明细', path: '' },
  { icon: 'ℹ️', label: '关于我们', path: '' },
];

const Mine: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, fetchProfile, logout } = useUserStore();

  useEffect(() => {
    if (isLoggedIn) fetchProfile();
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getMembershipLabel = (level: number) => {
    const labels = ['普通会员', '银卡会员', '金卡会员', '黑金会员'];
    return labels[level] || '普通会员';
  };

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="gradient-brand px-4 pt-12 pb-8">
        {isLoggedIn && user ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-white/50 bg-white/20 flex items-center justify-center">
              <span className="text-3xl">😊</span>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-lg font-bold">{user.nickname || '茶友'}</h2>
              <p className="text-white/70 text-xs mt-0.5">{user.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-medium">
                {getMembershipLabel(user.membership_level)}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-white/50 bg-white/20 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <button
                onClick={() => navigate('/login')}
                className="text-white text-lg font-bold"
              >
                登录/注册
              </button>
              <p className="text-white/70 text-xs mt-0.5">登录后享受更多权益</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="-mt-4 mx-4 bg-white rounded-xl shadow-card p-4">
        <div className="grid grid-cols-3 divide-x divide-guming-border">
          {[
            { value: 0, label: '订单' },
            { value: 0, label: '优惠券' },
            { value: user?.points || 0, label: '积分' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-xl font-bold text-guming-text">{stat.value}</span>
              <span className="text-xs text-guming-sub mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="mx-4 mt-3 bg-white rounded-xl shadow-card overflow-hidden">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            onClick={() => item.path && navigate(item.path)}
            className={`flex items-center w-full px-4 py-3.5 active:bg-gray-50 transition-colors ${
              index < menuItems.length - 1 ? 'border-b border-guming-border' : ''
            }`}
          >
            <span className="text-lg mr-3">{item.icon}</span>
            <span className="flex-1 text-sm text-guming-text text-left">{item.label}</span>
            <ArrowRight size={16} color="#ccc" />
          </button>
        ))}
      </div>

      {/* Logout */}
      {isLoggedIn && (
        <div className="mx-4 mt-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl border border-gray-200 text-sm text-guming-sub font-medium active:bg-gray-50 transition-colors"
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  );
};

export default Mine;