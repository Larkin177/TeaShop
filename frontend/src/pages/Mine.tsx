import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';

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

  const menuItems = [
    { icon: '📋', label: '我的订单', path: '/orders' },
    { icon: '🎫', label: '我的优惠券', path: '/mine/coupons' },
    { icon: '📍', label: '我的地址', path: '/mine/addresses' },
    { icon: '🎁', label: '领券中心', path: '/coupon-center' },
    { icon: '📞', label: '联系客服', path: '' },
    { icon: '⚙️', label: '设置', path: '' },
  ];

  return (
    <div className="pb-4">
      {/* Green gradient header */}
      <div
        className="px-4 pt-8 pb-6"
        style={{ background: 'linear-gradient(135deg, #4a9e4d, #3d8a40)' }}
      >
        {isLoggedIn && user ? (
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div className="flex-1">
              <div className="text-white text-[18px] font-bold">{user.nickname || '茶友'}</div>
              <div className="text-white/70 text-[12px] mt-0.5">{user.phone}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                  {user.membership_level === 1 ? '普通会员' : user.membership_level === 2 ? '银卡会员' : '金卡会员'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <button onClick={() => navigate('/login')} className="text-white text-[18px] font-bold">
              点击登录 →
            </button>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="flex items-center bg-white mx-4 -mt-4 rounded-xl shadow-sm overflow-hidden">
        {[
          { value: user ? '...' : '0', label: '订单' },
          { value: user ? '...' : '0', label: '优惠券' },
          { value: user?.points ?? 0, label: '积分' },
        ].map((item, i) => (
          <button
            key={item.label}
            onClick={() => i === 0 ? navigate('/orders') : i === 1 ? navigate('/mine/coupons') : undefined}
            className="flex-1 flex flex-col items-center py-3"
          >
            <span className="text-[18px] font-bold text-gray-800">{item.value}</span>
            <span className="text-[11px] text-gray-400 mt-0.5">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Menu list */}
      <div className="mx-4 mt-4 bg-white rounded-xl overflow-hidden">
        {menuItems.map((item, i) => (
          <button
            key={item.label}
            onClick={() => item.path && navigate(item.path)}
            className="flex items-center w-full px-4 py-3.5"
            style={{ borderBottom: i < menuItems.length - 1 ? '1px solid #f5f5f5' : 'none' }}
          >
            <span className="text-lg mr-3">{item.icon}</span>
            <span className="flex-1 text-[14px] text-gray-700 text-left">{item.label}</span>
            <span className="text-gray-300 text-sm">›</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      {isLoggedIn && (
        <div className="mx-4 mt-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl text-[14px] font-medium text-center bg-white"
            style={{ color: '#e85c3a' }}
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  );
};

export default Mine;