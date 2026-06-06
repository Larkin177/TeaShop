import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useUserStore, useStoreSelectionStore } from '../store';
import * as api from '../api';
import type { Coupon } from '../types';
import Header from '../components/Header';
import QuantityStepper from '../components/QuantityStepper';
import EmptyState from '../components/EmptyState';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const selectedStoreId = useStoreSelectionStore((s) => s.selectedStoreId);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCart();
    if (isLoggedIn) {
      api.getMyCoupons().then((res: any) => setCoupons(res.data || [])).catch(() => {});
    }
  }, [isLoggedIn]);

  const selectedCoupon = coupons.find((c) => c.id === selectedCouponId);
  const discountAmount = selectedCoupon
    ? selectedCoupon.type === 'percent'
      ? totalPrice * (1 - selectedCoupon.value / 100)
      : selectedCoupon.value
    : 0;
  const payAmount = Math.max(0, totalPrice - discountAmount);

  const handleCheckout = async () => {
    if (items.length === 0 || submitting) return;
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      const res: any = await api.createOrder({
        store_id: selectedStoreId || 1,
        coupon_id: selectedCouponId,
        remark,
      });
      navigate(`/orders/${res.data.id}`);
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col h-full bg-cream">
      <Header title="购物车" />

      {items.length === 0 ? (
        <EmptyState
          icon="🛒"
          text="购物车是空的"
          action={{ label: '去点单', onClick: () => navigate('/menu') }}
        />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {/* Cart items */}
            <div className="flex flex-col gap-2.5 mb-4">
              {items.map((item) => {
                const specsText = Object.entries(item.specs)
                  .map(([k, v]) => `${k}:${v}`)
                  .join(' / ');
                const toppingsText = item.toppings.map((t) => t.name).join('、');
                return (
                  <div key={item.id} className="bg-white rounded-xl p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-bold text-gray-800">{item.product_name}</div>
                        {specsText && <div className="text-[11px] text-gray-400 mt-0.5">{specsText}</div>}
                        {toppingsText && <div className="text-[11px] text-gray-400">加料: {toppingsText}</div>}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[18px] text-gray-300 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[14px] font-bold" style={{ color: '#e85c3a' }}>
                        ¥{(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                      <QuantityStepper
                        value={item.quantity}
                        size="sm"
                        onChange={(v) => updateQuantity(item.id, v)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon selector */}
            {coupons.length > 0 && (
              <div className="bg-white rounded-xl p-3 mb-3">
                <div className="text-[13px] font-semibold text-gray-800 mb-2">🎫 优惠券</div>
                <div className="flex flex-col gap-2">
                  {coupons.filter((c) => !c.is_used).map((c) => {
                    const isSelected = selectedCouponId === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCouponId(isSelected ? null : c.id)}
                        className="flex items-center justify-between p-2 rounded-lg transition-colors"
                        style={{
                          background: isSelected ? '#e8f5e9' : '#f8f8f8',
                          border: isSelected ? '1px solid #4a9e4d' : '1px solid transparent',
                        }}
                      >
                        <div className="text-left">
                          <div className="text-[12px] font-medium text-gray-800">{c.name}</div>
                          <div className="text-[11px] text-gray-400">
                            {c.type === 'percent' ? `${c.value / 10}折` : `减¥${c.value}`}
                            {c.min_amount > 0 ? ` · 满${c.min_amount}可用` : ''}
                          </div>
                        </div>
                        <span
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{
                            borderColor: isSelected ? '#4a9e4d' : '#ddd',
                            background: isSelected ? '#4a9e4d' : 'transparent',
                          }}
                        >
                          {isSelected && <span className="text-white text-[10px]">✓</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Remark */}
            <div className="bg-white rounded-xl p-3 mb-3">
              <div className="text-[13px] font-semibold text-gray-800 mb-2">备注</div>
              <input
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="如少冰、多糖等"
                className="w-full text-[13px] bg-gray-50 rounded-lg px-3 py-2 border-none"
              />
            </div>

            {/* Price summary */}
            <div className="bg-white rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between text-[13px] mb-1">
                <span className="text-gray-500">商品合计</span>
                <span className="text-gray-800">¥{totalPrice.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-[13px] mb-1">
                  <span className="text-gray-500">优惠减免</span>
                  <span style={{ color: '#4a9e4d' }}>-¥{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[15px] font-bold mt-1 pt-1 border-t border-gray-100">
                <span className="text-gray-800">应付</span>
                <span style={{ color: '#e85c3a' }}>¥{payAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center px-4 py-2.5 bg-white border-t border-gray-100 shrink-0 safe-bottom">
            <div className="flex-1">
              <span className="text-[12px] text-gray-500">合计 </span>
              <span className="text-[18px] font-bold" style={{ color: '#e85c3a' }}>¥{payAmount.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={submitting}
              className="px-6 py-2.5 rounded-full text-white text-[14px] font-semibold"
              style={{ background: 'linear-gradient(135deg, #ff7a2e, #ff9651)' }}
            >
              {submitting ? '提交中...' : '去结算'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;