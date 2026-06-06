import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../api';
import type { Order } from '../types';
import Header from '../components/Header';
import OrderStatusBadge from '../components/OrderStatusBadge';
import Loading from '../components/Loading';

const OrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getOrderDetail(Number(id))
      .then((res: any) => setOrder(res.data))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    try {
      await api.cancelOrder(order.id);
      setOrder({ ...order, status: 4 });
    } catch {}
  };

  const handlePay = async () => {
    if (!order) return;
    try {
      await api.payOrder(order.id);
      setOrder({ ...order, status: 1, paid_at: new Date().toISOString() });
    } catch {}
  };

  if (loading) return <><Header title="订单详情" /><Loading /></>;
  if (!order) return null;

  return (
    <div className="flex flex-col h-full bg-cream">
      <Header title="订单详情" />

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* Status */}
        <div className="bg-white rounded-xl p-4 mb-3 text-center">
          <OrderStatusBadge status={order.status} />
          <div className="text-[11px] text-gray-400 mt-2">订单号: {order.order_no}</div>
        </div>

        {/* Store */}
        <div className="bg-white rounded-xl p-3 mb-3 flex items-center gap-2">
          <span className="text-lg">🏪</span>
          <div>
            <div className="text-[14px] font-semibold text-gray-800">{order.store_name}</div>
            <div className="text-[11px] text-gray-400">{order.created_at?.slice(0, 16)}</div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl p-3 mb-3">
          <div className="text-[13px] font-semibold text-gray-800 mb-2">商品明细</div>
          {order.items?.map((item) => {
            const specsText = Object.entries(item.specs).map(([k, v]) => `${k}:${v}`).join(' / ');
            return (
              <div key={item.id} className="flex items-start justify-between py-2" style={{ borderBottom: '1px solid #f8f8f8' }}>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-gray-800">{item.product_name}</div>
                  {specsText && <div className="text-[11px] text-gray-400 mt-0.5">{specsText}</div>}
                  {item.toppings.length > 0 && (
                    <div className="text-[11px] text-gray-400">加料: {item.toppings.map((t) => t.name).join('、')}</div>
                  )}
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-[13px] font-medium text-gray-800">¥{item.total_price.toFixed(2)}</div>
                  <div className="text-[11px] text-gray-400">×{item.quantity}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Remark */}
        {order.remark && (
          <div className="bg-white rounded-xl p-3 mb-3">
            <div className="text-[13px] font-semibold text-gray-800 mb-1">备注</div>
            <div className="text-[12px] text-gray-500">{order.remark}</div>
          </div>
        )}

        {/* Price */}
        <div className="bg-white rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between text-[13px] mb-1">
            <span className="text-gray-500">商品合计</span>
            <span className="text-gray-800">¥{order.total_price.toFixed(2)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex items-center justify-between text-[13px] mb-1">
              <span className="text-gray-500">优惠减免</span>
              <span style={{ color: '#4a9e4d' }}>-¥{order.discount_amount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-[15px] font-bold mt-1 pt-1 border-t border-gray-100">
            <span className="text-gray-800">实付</span>
            <span style={{ color: '#e85c3a' }}>¥{order.pay_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      {order.status === 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-t border-gray-100 shrink-0 safe-bottom">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 rounded-full text-[14px] font-medium border text-gray-500"
            style={{ borderColor: '#ddd' }}
          >
            取消订单
          </button>
          <button
            onClick={handlePay}
            className="flex-1 py-2.5 rounded-full text-[14px] font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #ff7a2e, #ff9651)' }}
          >
            去支付
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;