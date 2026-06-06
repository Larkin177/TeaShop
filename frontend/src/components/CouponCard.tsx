import React from 'react';
import type { Coupon } from '../types';

interface CouponCardProps {
  coupon: Coupon;
  action?: 'claim' | 'use' | 'none';
  onAction?: (coupon: Coupon) => void;
  variant?: 'default' | 'compact';
}

const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  action = 'none',
  onAction,
  variant = 'default',
}) => {
  const isExpired = new Date(coupon.end_time) < new Date();
  const isUsed = coupon.is_used === 1;

  const getActionButton = () => {
    if (action === 'claim') {
      return (
        <button
          onClick={() => onAction?.(coupon)}
          className="px-4 py-1.5 rounded-full text-xs font-medium bg-white text-brand-500 active:bg-gray-50"
        >
          领取
        </button>
      );
    }
    if (action === 'use' && !isUsed && !isExpired) {
      return (
        <button
          onClick={() => onAction?.(coupon)}
          className="px-4 py-1.5 rounded-full text-xs font-medium bg-white text-brand-500 active:bg-gray-50"
        >
          去使用
        </button>
      );
    }
    return null;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}.${d.getDate()}`;
  };

  if (variant === 'compact') {
    return (
      <div className="flex-shrink-0 w-[280px] rounded-xl overflow-hidden shadow-card">
        <div className="flex">
          <div className="gradient-brand flex flex-col items-center justify-center px-5 py-4 min-w-[90px]">
            <span className="text-white text-xs">¥</span>
            <span className="text-white text-2xl font-bold leading-none">{coupon.value}</span>
            {coupon.min_amount > 0 && (
              <span className="text-white/80 text-[10px] mt-1">满{coupon.min_amount}可用</span>
            )}
          </div>
          <div className="flex-1 bg-white p-3 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-guming-text text-ellipsis-1">{coupon.name}</p>
              <p className="text-xs text-guming-sub mt-1">
                {formatDate(coupon.start_time)} - {formatDate(coupon.end_time)}
              </p>
            </div>
            <div className="flex justify-end">{getActionButton()}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden shadow-card ${isUsed || isExpired ? 'opacity-60' : ''}`}>
      <div className="flex">
        <div className="gradient-brand flex flex-col items-center justify-center px-5 py-4 min-w-[100px]">
          <div className="flex items-baseline">
            <span className="text-white text-xs">¥</span>
            <span className="text-white text-3xl font-bold leading-none">{coupon.value}</span>
          </div>
          {coupon.min_amount > 0 && (
            <span className="text-white/80 text-xs mt-1">满{coupon.min_amount}可用</span>
          )}
        </div>
        <div className="flex-1 bg-white p-3 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-guming-text text-ellipsis-1">{coupon.name}</p>
            <p className="text-xs text-guming-sub mt-1">
              {formatDate(coupon.start_time)} - {formatDate(coupon.end_time)}
            </p>
            {coupon.description && (
              <p className="text-[11px] text-guming-sub mt-0.5 text-ellipsis-1">{coupon.description}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            {isUsed && <span className="text-xs text-guming-sub">已使用</span>}
            {isExpired && !isUsed && <span className="text-xs text-guming-sub">已过期</span>}
            {!isUsed && !isExpired && getActionButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;