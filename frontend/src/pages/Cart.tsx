import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useStoreSelectionStore } from '../store';
import Header from '../components/Header';
import QuantityStepper from '../components/QuantityStepper';
import EmptyState from '../components/EmptyState';
import { Close } from '../components/Icons';
import * as api from '../api';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, totalCount, updateQuantity, removeItem, clearCart } = useCartStore();
  const { selectedStoreId, selectedStoreName } = useStoreSelectionStore();
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formatSpecs = (specs: Record<string, string>, toppings: Array<{ name: string }>) => {
    const parts: string[] = [];
    Object.values(specs).forEach((v) => parts.push(v));
    toppings.forEach((t) => parts.push(t.name));
    return parts.join('/');
  };

  const handleSubmit = async () => {
    if (!selectedStoreId || items.length === 0) return;
    setSubmitting(true);
    try {
      const orderData = {
        store_id: selectedStoreId,
        remark,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          specs: item.specs,
          toppings: item.toppings,
          unit_price: item.unit_price,
        })),
      };
      const res: any = await api.createOrder(orderData);
      await clearCart();
      navigate(`/orders/${res.data.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-guming-bg">
      <Header title="购物车" />

      {!selectedStoreId ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            emoji="🏪"
            message="请先选择门店"
            actionText="选择门店"
            onAction={() => navigate('/store-select')}
          />
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            emoji="🛒"
            message="购物车空空如也"
            actionText="去点单"
            onAction={() => navigate('/menu')}
          />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {/* Store */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-guming-text font-medium">{selectedStoreName}</span>
              <button onClick={clearCart} className="text-xs text-guming-sub">清空购物车</button>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-card p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-medium text-guming-text text-ellipsis-1">
                        {item.product_name}
                      </h3>
                      <p className="text-xs text-guming-sub mt-0.5 text-ellipsis-1">
                        {formatSpecs(item.specs, item.toppings)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-2 w-6 h-6 flex items-center justify-center text-guming-sub"
                    >
                      <Close size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <QuantityStepper
                      value={item.quantity}
                      min={1}
                      max={99}
                      onChange={(q) => updateQuantity(item.id, q)}
                      size="sm"
                    />
                    <span className="text-guming-price font-bold">
                      ¥{(item.unit_price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Remark */}
            <div className="mt-4 bg-white rounded-xl shadow-card p-3">
              <label className="text-sm text-guming-text font-medium block mb-2">备注</label>
              <input
                type="text"
                placeholder="请输入备注信息"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm text-guming-text placeholder:text-guming-sub"
              />
            </div>

            {/* Price Summary */}
            <div className="mt-3 bg-white rounded-xl shadow-card p-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-guming-sub">商品小计</span>
                <span className="text-guming-text">¥{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-guming-sub">优惠</span>
                <span className="text-guming-price">-¥0.00</span>
              </div>
              <div className="border-t border-guming-border pt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-guming-text">合计</span>
                <span className="text-guming-price font-bold text-lg">¥{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex-shrink-0 bg-white border-t border-guming-border safe-bottom">
            <div className="px-4 py-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full gradient-brand text-white font-medium py-3.5 rounded-full text-center active:opacity-90 transition-opacity disabled:opacity-60"
              >
                去结算 ({totalCount}件)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;