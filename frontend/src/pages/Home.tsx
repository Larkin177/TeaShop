import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useStoreSelectionStore, useCartStore, useUserStore } from '../store';
import type { Product, Category, Coupon, Banner } from '../types';
import CartBadge from '../components/CartBadge';

const categoryEmojis: Record<string, string> = {
  '当季限定': '🥭', '超人气': '👑', '招牌必喝': '🧋', '奶茶': '🧋',
  '果茶': '🍹', '咖啡': '☕', '酸奶': '🥛', '纯茶': '🍵',
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const selectedStoreName = useStoreSelectionStore((s) => s.selectedStoreName);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const addItem = useCartStore((s) => s.addItem);
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);

  const [categories, setCategories] = useState<Category[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orderType, setOrderType] = useState<'self' | 'delivery'>('self');

  useEffect(() => {
    api.getCategories().then((res: any) => setCategories(res.data || [])).catch(() => {});
    api.getRecommendedProducts().then((res: any) => setRecommended(res.data || [])).catch(() => {});
    api.getBanners().then((res: any) => setBanners(res.data || [])).catch(() => {});
    api.getAvailableCoupons().then((res: any) => setCoupons(res.data || [])).catch(() => {});
    if (isLoggedIn) fetchCart();
  }, [isLoggedIn]);

  const handleClaimCoupon = async (id: number) => {
    try { await api.claimCoupon(id); } catch {}
  };

  const handleQuickAdd = async (product: Product) => {
    try {
      await addItem({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image || '',
        specs: {},
        toppings: [],
        quantity: 1,
        unit_price: product.base_price,
      });
    } catch {}
  };

  return (
    <div className="pb-4">
      {/* Header gradient */}
      <div
        className="px-4 pt-3 pb-4"
        style={{ background: 'linear-gradient(135deg, #4a9e4d, #3d8a40)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-white text-[20px] font-bold">🍵 古茗茶饮</span>
          <button
            onClick={() => navigate('/store-select')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px]"
            style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}
          >
            🏪 {selectedStoreName || '选择门店'} ▾
          </button>
        </div>
        {/* Search bar */}
        <button
          onClick={() => navigate('/menu')}
          className="flex items-center w-full h-9 rounded-full px-3 gap-2"
          style={{ background: 'rgba(255,255,255,0.9)' }}
        >
          <span>🔍</span>
          <span className="text-[13px] text-gray-400">搜索饮品</span>
        </button>
      </div>

      {/* Order type toggle */}
      <div className="flex items-center justify-center py-3 px-4">
        <div className="flex items-center bg-white rounded-full p-0.5 shadow-sm">
          {(['self', 'delivery'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className="px-5 py-1.5 rounded-full text-[13px] font-medium transition-colors"
              style={{
                background: orderType === type ? '#4a9e4d' : 'transparent',
                color: orderType === type ? '#fff' : '#999',
              }}
            >
              {type === 'self' ? '自取' : '外卖'}
            </button>
          ))}
        </div>
      </div>

      {/* Banner area */}
      <div className="px-4 mb-4 overflow-x-auto hide-scrollbar">
        <div className="flex gap-3" style={{ minWidth: banners.length > 0 ? 'max-content' : '100%' }}>
          {banners.length > 0 ? banners.map((b) => (
            <div key={b.id} className="w-[280px] h-[120px] rounded-xl overflow-hidden shrink-0" style={{ background: 'linear-gradient(135deg, #fce4d6, #f8d5c0)' }}>
              <div className="w-full h-full flex items-center justify-center text-3xl">🍵</div>
            </div>
          )) : (
            <>
              <div className="flex-1 h-[120px] rounded-xl" style={{ background: 'linear-gradient(135deg, #fce4d6, #f8d5c0)' }}>
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  <span className="text-2xl">🥭</span>
                  <span className="text-[13px] text-orange-700 font-medium">当季限定</span>
                </div>
              </div>
              <div className="flex-1 h-[120px] rounded-xl" style={{ background: 'linear-gradient(135deg, #d4e8d0, #c0ddbb)' }}>
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  <span className="text-2xl">👑</span>
                  <span className="text-[13px] text-green-700 font-medium">超人气推荐</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Category grid */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/menu/${cat.id}`)}
              className="flex flex-col items-center py-2.5 rounded-xl bg-white gap-1"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <span className="text-xl">{categoryEmojis[cat.name] || cat.icon || '🍵'}</span>
              <span className="text-[12px] text-gray-700 font-medium">{cat.name}</span>
            </button>
          ))}
          {categories.length === 0 && ['当季限定', '超人气', '招牌必喝', '奶茶', '果茶', '咖啡', '酸奶', '纯茶'].map((name) => (
            <button
              key={name}
              onClick={() => navigate('/menu')}
              className="flex flex-col items-center py-2.5 rounded-xl bg-white gap-1"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <span className="text-xl">{categoryEmojis[name] || '🍵'}</span>
              <span className="text-[12px] text-gray-700 font-medium">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Coupon section */}
      {coupons.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between px-4 mb-2">
            <span className="text-[15px] font-bold text-gray-800">🎫 优惠券</span>
            <button onClick={() => navigate('/coupon-center')} className="text-[12px] text-brand">更多 {'>'}</button>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar">
            {coupons.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="flex flex-col shrink-0 p-3 rounded-xl text-white"
                style={{
                  width: 140,
                  background: 'linear-gradient(135deg, #4a9e4d, #3d8a40)',
                }}
              >
                <span className="text-[20px] font-bold">
                  {c.type === 'percent' ? `${c.value / 10}折` : `¥${c.value}`}
                </span>
                <span className="text-[11px] opacity-80 mt-1">
                  {c.min_amount > 0 ? `满${c.min_amount}可用` : '无门槛'}
                </span>
                <button
                  onClick={() => handleClaimCoupon(c.id)}
                  className="mt-2 px-2 py-0.5 rounded-full text-[11px] self-start"
                  style={{ background: 'rgba(255,255,255,0.3)' }}
                >
                  领取
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended products */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[15px] font-bold text-gray-800">⭐ 为你推荐</span>
          <button onClick={() => navigate('/menu')} className="text-[12px] text-brand">更多 {'>'}</button>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {recommended.map((p) => (
            <div
              key={p.id}
              className="shrink-0 rounded-xl overflow-hidden bg-white cursor-pointer"
              style={{ width: 140, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <div
                className="h-[120px] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #fce4d6, #f8d5c0)' }}
              >
                <span className="text-3xl">🧋</span>
              </div>
              <div className="p-2">
                <div className="text-[13px] font-bold text-gray-800 truncate">{p.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[14px] font-bold" style={{ color: '#e85c3a' }}>¥{p.base_price.toFixed(2)}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleQuickAdd(p); }}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                    style={{ background: '#ff7a2e', fontSize: 16, lineHeight: 1 }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
          {recommended.length === 0 && (
            <div className="text-[13px] text-gray-400 py-4">暂无推荐</div>
          )}
        </div>
      </div>

      <CartBadge />
    </div>
  );
};

export default Home;