import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import type { Order } from '../types';
import Header from '../components/Header';
import OrderStatusBadge from '../components/OrderStatusBadge';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';

const tabs = [
  { key: -1, label: '全部' },
  { key: 0, label: '待付款' },
  { key: 2, label: '制作中' },
  { key: 3, label: '已完成' },
];

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(-1);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res: any = await api.getOrders();
      setOrders(res.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const filtered = activeTab === -1 ? orders : orders.filter((o) => o.status === activeTab);

  if (loading) return <><Header title="我的订单" showBack={false} /><Loading /></>;

  return (
    <div className="flex flex-col h-full bg-cream">
      <Header title="我的订单" showBack={false} />

      {/* Tabs */}
      <div className="flex items-center bg-white px-2 shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2.5 text-[13px] font-medium relative"
              style={{ color: isActive ? '#ff7a2e' : '#666' }}
            >
              {tab.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                  style={{ background: '#ff7a2e' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Order list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {filtered.length === 0 ? (
          <EmptyState icon="📋" text="暂无订单" action={{ label: '去点单', onClick: () => navigate('/menu') }} />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((order) => (
              <button
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="bg-white rounded-xl p-3.5 text-left"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-medium text-gray-800">{order.store_name || '门店'}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex flex-col gap-1.5 mb-2">
                  {order.items?.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-[12px]">
                      <span className="text-gray-600 truncate flex-1">{item.product_name} × {item.quantity}</span>
                      <span className="text-gray-800 ml-2">¥{item.total_price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-[11px] text-gray-400">{order.created_at?.slice(0, 16)}</span>
                  <span className="text-[14px] font-bold" style={{ color: '#e85c3a' }}>
                    ¥{order.pay_amount.toFixed(2)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;