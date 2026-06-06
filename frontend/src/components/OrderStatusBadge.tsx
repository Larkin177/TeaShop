import React from 'react';

interface OrderStatusBadgeProps {
  status: number;
}

const statusConfig: Record<number, { label: string; bg: string; text: string }> = {
  0: { label: '待付款', bg: 'bg-orange-50', text: 'text-brand-500' },
  1: { label: '制作中', bg: 'bg-blue-50', text: 'text-blue-500' },
  2: { label: '可取餐', bg: 'bg-green-50', text: 'text-green-500' },
  3: { label: '已完成', bg: 'bg-gray-50', text: 'text-gray-500' },
  4: { label: '已取消', bg: 'bg-red-50', text: 'text-red-400' },
};

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig[3];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;