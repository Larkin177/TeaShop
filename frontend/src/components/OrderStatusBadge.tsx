import React from 'react';

interface OrderStatusBadgeProps {
  status: number;
}

const statusMap: Record<number, { label: string; bg: string; color: string }> = {
  0: { label: '待付款', bg: '#fff3e0', color: '#ff7a2e' },
  1: { label: '待制作', bg: '#e8f5e9', color: '#4a9e4d' },
  2: { label: '制作中', bg: '#e3f2fd', color: '#1976d2' },
  3: { label: '已完成', bg: '#f5f5f5', color: '#999' },
  4: { label: '已取消', bg: '#f5f5f5', color: '#999' },
};

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const s = statusMap[status] || statusMap[3];
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-[11px]"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
};

export default OrderStatusBadge;