import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../api';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { getProductGradient, getProductEmoji } from '../components/ProductCard';
import type { Order } from '../types';

const statusConfig: Record<number, { label: string; bg: string; text: string }> = {
  0: { label: '待付款', bg: 'gradient-brand', text: 'text-white' },
  1: { label: '制作中', bg: 'bg-blue-500', text: 'text-white' },
  2: { label: '可取餐', bg: 'bg-green-500', text: 'text-white' },
  3: { label: '已完成', bg: 'bg-gray-400', text: 'text-white' },
  4: { label: '已取消', bg: 'bg-red-400', text: 'text-white' },
};

const OrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res: any = await api.getOrderDetail(Number(id));
        setOrder(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    try {
      await api.cancelOrder(order.id);
      const res: any = await api.getOrderDetail(order.id);
      setOrder(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePay = async () => {
    if (!order) return;
    try {
      await api.payOrder(order.id);
      const res: any = await api.getOrderDetail(order.id);
      setOrder(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleComplete = async () => {
    if (!order) return;
    try {
      await api.completeOrder(order.id);
      const res: any = await api.getOrderDetail(order.id);
      setOrder(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) return <Loading fullScreen text="加载中..." />;
  if (!order) return <div className="p-4 text-center text-guming-sub">订单不存在</div>;

  const status = statusConfig[order.status] || statusConfig[3];

  return (
    <div className="pb-20 bg-guming-bg min-h-screen">
      <Header title="订单详情" />

      {/* Status Banner */}
      <div className={`${status.bg} px-4 py-6`}>
        <h2 className={`text-xl font-bold ${status.text}`}>{status.label}</h2>
        <p className={`text-sm ${status.text} opacity-80 mt-1`}>
          {order.status === 0 && '请尽快完成支付'}
          {order.status === 1 && '您的饮品正在制作中'}
          {order.status === 2 && '请尽快到店取餐'}
          {order.status === 3 && '感谢您的光临'}
          {order.status === 4 && '订单已取消'}
        </p>
      </div>

      {/* Order Info */}
      <div className="mx-4 mt-3 bg-white rounded-xl shadow-card p-4">
        <h3 className="text-sm font-medium text-guming-text mb-3">订单信息</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-guming-sub">订单编号</span>
            <span className="text-guming-text">{order.order_no}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-guming-sub">下单时间</span>
            <span className="text-guming-text">{formatDate(order.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-guming-sub">门店</span>
            <span className="text-guming-text">{order.store_name}</span>
          </div>
          {order.paid_at && (
            <div className="flex justify-between">
              <span className="text-guming-sub">支付时间</span>
              <span className="text-guming-text">{formatDate(order.paid_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="mx-4 mt-3 bg-white rounded-xl shadow-card p-4">
        <h3 className="text-sm font-medium text-guming-text mb-3">商品清单</h3>
        <div className="space-y-3">
          {order.items.map((item) => {
            const gradient = getProductGradient();
            const emoji = getProductEmoji();
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xl">{emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-guming-text text-ellipsis-1">{item.product_name}</h4>
                  <p className="text-[11px] text-guming-sub text-ellipsis-1">
                    {Object.values(item.specs).join('/')}
                    {item.toppings.length > 0 && `/${item.toppings.map((t) => t.name).join('/')}`}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm text-guming-text">x{item.quantity}</span>
                  <p className="text-sm text-guming-price font-medium">¥{item.total_price.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="mx-4 mt-3 bg-white rounded-xl shadow-card p-4">
        <h3 className="text-sm font-medium text-guming-text mb-3">费用明细</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-guming-sub">商品小计</span>
            <span className="text-guming-text">¥{order.total_price.toFixed(2)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between">
              <span className="text-guming-sub">优惠</span>
              <span className="text-guming-price">-¥{order.discount_amount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-guming-border pt-2 flex justify-between">
            <span className="font-medium text-guming-text">实付</span>
            <span className="text-guming-price font-bold text-lg">¥{order.pay_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Remark */}
      {order.remark && (
        <div className="mx-4 mt-3 bg-white rounded-xl shadow-card p-4">
          <h3 className="text-sm font-medium text-guming-text mb-2">备注</h3>
          <p className="text-sm text-guming-sub">{order.remark}</p>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-guming-border safe-bottom z-10">
        <div className="max-w-[450px] mx-auto flex items-center justify-end gap-3 px-4 py-3">
          {order.status === 0 && (
            <>
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-full border border-gray-200 text-sm text-guming-sub active:bg-gray-50"
              >
                取消订单
              </button>
              <button
                onClick={handlePay}
                className="px-5 py-2.5 rounded-full gradient-brand text-sm text-white active:opacity-90"
              >
                去支付
              </button>
            </>
          )}
          {order.status === 2 && (
            <button
              onClick={handleComplete}
              className="px-5 py-2.5 rounded-full gradient-brand text-sm text-white active:opacity-90"
            >
              确认收货
            </button>
          )}
          {order.status === 3 && (
            <button
              onClick={() => navigate('/menu')}
              className="px-5 py-2.5 rounded-full border border-brand-200 text-sm text-brand-500 active:bg-brand-50"
            >
              再来一单
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;