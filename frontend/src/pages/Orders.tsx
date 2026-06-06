import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import Header from '../components/Header';
import OrderStatusBadge from '../components/OrderStatusBadge';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import type { Order } from '../types';

const tabs = [
  { key: 'all', label: '全部', status: undefined },
  { key: 'pending', label: '待付款', status: 0 },
  { key: 'making', label: '制作中', status: 1 },
  { key: 'completed', label: '已完成', status: 3 },
];

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const loadOrders = useCallback(async () => {
    try {
      const res: any = await api.getOrders();
      setOrders(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.status === tabs.find((t) => t.key === activeTab)?.status);

  const handleCancel = async (orderId: number) => {
    try {
      await api.cancelOrder(orderId);
      loadOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const handlePay = async (orderId: number) => {
    try {
      await api.payOrder(orderId);
      loadOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleComplete = async (orderId: number) => {
    try {
      await api.completeOrder(orderId);
      loadOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}.${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) return <Loading fullScreen text="加载订单..." />;

  return (
    <div className="h-full flex flex-col bg-guming-bg">
      <Header title="我的订单" showBack={false} />

      {/* Tab Bar */}
      <div className="flex-shrink-0 bg-white border-b border-guming-border">
        <div className="flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                className={`flex-shrink-0 px-5 py-3 text-sm relative whitespace-nowrap transition-colors ${
                  isActive ? 'text-brand-500 font-medium' : 'text-guming-sub'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-brand-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Order List */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {filteredOrders.length === 0 ? (
          <EmptyState emoji="📋" message="暂无订单" actionText="去点单" onAction={() => navigate('/menu')} />
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-card overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-guming-border">
                  <span className="text-sm font-medium text-guming-text">{order.store_name}</span>
                  <OrderStatusBadge status={order.status} />
                </div>

                {/* Items */}
                <div className="px-4 py-3" onClick={() => navigate(`/orders/${order.id}`)}>
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-1">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-guming-text text-ellipsis-1">
                          {item.product_name}
                          <span className="text-guming-sub ml-1">x{item.quantity}</span>
                        </span>
                        {Object.keys(item.specs).length > 0 && (
                          <p className="text-[11px] text-guming-sub text-ellipsis-1">
                            {Object.values(item.specs).join('/')}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-guming-text ml-2">¥{item.total_price.toFixed(2)}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-guming-sub mt-1">等{order.items.length}件商品</p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-guming-border bg-gray-50/50">
                  <div>
                    <span className="text-guming-price font-bold">¥{order.pay_amount.toFixed(2)}</span>
                    <span className="text-[11px] text-guming-sub ml-2">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex gap-2">
                    {order.status === 0 && (
                      <>
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="px-3 py-1.5 rounded-full border border-gray-200 text-xs text-guming-sub active:bg-gray-50"
                        >
                          取消订单
                        </button>
                        <button
                          onClick={() => handlePay(order.id)}
                          className="px-3 py-1.5 rounded-full gradient-brand text-xs text-white active:opacity-90"
                        >
                          去支付
                        </button>
                      </>
                    )}
                    {order.status === 2 && (
                      <button
                        onClick={() => handleComplete(order.id)}
                        className="px-3 py-1.5 rounded-full gradient-brand text-xs text-white active:opacity-90"
                      >
                        确认收货
                      </button>
                    )}
                    {order.status === 3 && (
                      <button
                        onClick={() => navigate('/menu')}
                        className="px-3 py-1.5 rounded-full border border-brand-200 text-xs text-brand-500 active:bg-brand-50"
                      >
                        再来一单
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="px-3 py-1.5 rounded-full border border-gray-200 text-xs text-guming-sub active:bg-gray-50"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;