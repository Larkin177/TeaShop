import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useStoreSelectionStore } from '../store';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { Location, ArrowRight, Search } from '../components/Icons';
import type { Category, Product, Banner, Coupon } from '../types';

const categoryIcons: Record<string, string> = {
  '当季限定': '🔥',
  '超人气': '👑',
  '招牌必喝': '🏆',
  '奶茶': '🧋',
  '果茶': '🍹',
  '咖啡': '☕',
  '茶拿铁': '🍵',
  '小料': '🥣',
};

const bannerGradients = [
  'from-brand-400 to-brand-600',
  'from-pink-400 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
];

const bannerTexts = [
  { title: '夏日限定新品', subtitle: '清爽果茶系列 焕新上市' },
  { title: '会员专享福利', subtitle: '积分兑换 好礼不停' },
  { title: '第二杯半价', subtitle: '邀好友一起 甜蜜加倍' },
  { title: '古茗茶饮', subtitle: '好茶好料好味道' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { selectedStoreId, selectedStoreName } = useStoreSelectionStore();
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orderType, setOrderType] = useState<'self' | 'delivery'>('self');
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerTimerRef = useRef<ReturnType<typeof setInterval>>();

  const loadData = useCallback(async () => {
    try {
      const [catRes, prodRes, bannerRes, couponRes] = await Promise.allSettled([
        api.getCategories(),
        api.getRecommendedProducts(),
        api.getBanners(),
        api.getAvailableCoupons(),
      ]);
      if (catRes.status === 'fulfilled') setCategories((catRes.value as any).data || []);
      if (prodRes.status === 'fulfilled') setRecommended((prodRes.value as any).data || []);
      if (bannerRes.status === 'fulfilled') setBanners((bannerRes.value as any).data || []);
      if (couponRes.status === 'fulfilled') setCoupons((couponRes.value as any).data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    bannerTimerRef.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % Math.max(banners.length || bannerGradients.length, 1));
    }, 3000);
    return () => clearInterval(bannerTimerRef.current);
  }, [banners.length]);

  const handleClaimCoupon = async (coupon: Coupon) => {
    try {
      await api.claimCoupon(coupon.id);
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, is_used: 0, received_at: new Date().toISOString() } : c))
      );
    } catch {
      // ignore
    }
  };

  if (loading) return <Loading fullScreen text="加载中..." />;

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="gradient-brand px-4 pt-10 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-xl font-bold">古茗茶饮</h1>
          </div>
          <button
            onClick={() => navigate('/store-select')}
            className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1.5"
          >
            <Location size={14} color="white" />
            <span className="text-white text-xs max-w-[100px] text-ellipsis-1">
              {selectedStoreName || '选择门店'}
            </span>
            <ArrowRight size={12} color="white" />
          </button>
        </div>

        {/* Search */}
        <button
          onClick={() => navigate('/menu')}
          className="w-full flex items-center gap-2 bg-white/90 rounded-full px-4 py-2.5"
        >
          <Search size={16} color="#999" />
          <span className="text-guming-sub text-sm">搜索饮品</span>
        </button>
      </div>

      {/* Order Type Toggle */}
      <div className="px-4 -mt-3 mb-3">
        <div className="bg-white rounded-xl shadow-card p-1.5 flex">
          {(['self', 'delivery'] as const).map((type) => (
            <button
              key={type}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                orderType === type
                  ? 'gradient-brand text-white'
                  : 'text-guming-sub'
              }`}
              onClick={() => setOrderType(type)}
            >
              {type === 'self' ? '自取' : '外卖'}
            </button>
          ))}
        </div>
      </div>

      {/* Banner Carousel */}
      <div className="px-4 mb-4">
        <div className="relative h-36 rounded-xl overflow-hidden">
          {(banners.length > 0 ? bannerGradients.slice(0, banners.length) : bannerGradients).map((gradient, index) => {
            const textData = bannerTexts[index % bannerTexts.length];
            return (
              <div
                key={index}
                className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl flex items-center transition-opacity duration-500 ${
                  index === currentBanner % (banners.length || bannerGradients.length) ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="px-6">
                  <h2 className="text-white text-xl font-bold mb-1">{textData.title}</h2>
                  <p className="text-white/80 text-sm">{textData.subtitle}</p>
                </div>
              </div>
            );
          })}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {(banners.length > 0 ? bannerGradients.slice(0, banners.length) : bannerGradients).map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentBanner % (banners.length || bannerGradients.length) ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="grid grid-cols-4 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                onClick={() => navigate(`/menu/${cat.id}`)}
              >
                <span className="text-2xl">{categoryIcons[cat.name] || cat.icon || '🍵'}</span>
                <span className="text-xs text-guming-text">{cat.name}</span>
              </button>
            ))}
            {categories.length === 0 &&
              Object.entries(categoryIcons).map(([name, emoji], i) => (
                <button
                  key={i}
                  className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                  onClick={() => navigate('/menu')}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs text-guming-text">{name}</span>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Coupons */}
      {coupons.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-base font-bold text-guming-text">优惠券</h2>
            <button
              className="text-xs text-guming-sub flex items-center gap-0.5"
              onClick={() => navigate('/coupon-center')}
            >
              更多 <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar">
            {coupons.slice(0, 5).map((coupon) => (
              <div
                key={coupon.id}
                className="flex-shrink-0 w-[240px] rounded-xl overflow-hidden shadow-card cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => handleClaimCoupon(coupon)}
              >
                <div className="flex">
                  <div className="gradient-brand flex flex-col items-center justify-center px-4 py-3 min-w-[80px]">
                    <span className="text-white text-[10px]">¥</span>
                    <span className="text-white text-xl font-bold leading-none">{coupon.value}</span>
                    {coupon.min_amount > 0 && (
                      <span className="text-white/70 text-[10px] mt-1">满{coupon.min_amount}可用</span>
                    )}
                  </div>
                  <div className="flex-1 bg-white p-3 flex flex-col justify-between">
                    <p className="text-xs font-medium text-guming-text text-ellipsis-1">{coupon.name}</p>
                    <span className="text-[10px] text-brand-500 mt-1">点击领取</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-guming-text">推荐饮品</h2>
          <button
            className="text-xs text-guming-sub flex items-center gap-0.5"
            onClick={() => navigate('/menu')}
          >
            查看全部 <ArrowRight size={12} />
          </button>
        </div>

        {recommended.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {recommended.map((product) => {
              const gradientMap: Record<string, string> = {
                '奶茶': 'from-orange-100 to-amber-200',
                '果茶': 'from-green-200 to-teal-200',
                '咖啡': 'from-amber-300 to-yellow-300',
                '茶拿铁': 'from-emerald-200 to-green-200',
              };
              const emojiMap: Record<string, string> = {
                '奶茶': '🧋',
                '果茶': '🍹',
                '咖啡': '☕',
                '茶拿铁': '🍵',
              };
              const g = gradientMap[product.category_name || ''] || 'from-orange-100 to-amber-100';
              const e = emojiMap[product.category_name || ''] || '🍵';

              return (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-36 bg-white rounded-xl shadow-card overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className={`h-32 bg-gradient-to-br ${g} flex items-center justify-center`}>
                    <span className="text-4xl">{e}</span>
                  </div>
                  <div className="p-2.5">
                    <h3 className="text-sm font-medium text-guming-text text-ellipsis-1">{product.name}</h3>
                    <p className="text-[10px] text-guming-sub mt-0.5">月售 {product.monthly_sales}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-guming-price font-bold text-sm">
                        ¥{product.base_price}
                        <span className="text-[10px] font-normal ml-0.5">起</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                        className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-card p-8 text-center">
            <span className="text-3xl">🍵</span>
            <p className="text-sm text-guming-sub mt-2">暂无推荐</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;