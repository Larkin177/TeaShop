import React from 'react';
import type { Coupon } from '../types';

interface CouponCardProps {
  coupon: Coupon;
  onClaim?: () => void;
  onUse?: () => void;
  mode?: 'available' | 'mine';
  disabled?: boolean;
}

const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  onClaim,
  onUse,
  mode = 'available',
  disabled = false,
}) => {
  const isPercent = coupon.type === 'percent';
  const displayValue = isPercent ? `${coupon.value / 10}折` : `¥${coupon.value}`;
  const isUsed = coupon.is_used === 1;
  const isExpired = new Date(coupon.end_time) < new Date();

  return (
    <div
      className="flex rounded-xl overflow-hidden shrink-0"
      style={{
        width: 260,
        height: 90,
        opacity: disabled || isUsed || isExpired ? 0.6 : 1,
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Left colored portion */}
      <div
        className="flex flex-col items-center justify-center px-4"
        style={{
          background: isUsed || isExpired ? '#ccc' : 'linear-gradient(135deg, #4a9e4d, #3d8a40)',
          minWidth: 80,
        }}
      >
        <span className="text-white text-[22px] font-bold leading-none">{displayValue}</span>
        {coupon.min_amount > 0 && (
          <span className="text-white/80 text-[10px] mt-1">满{coupon.min_amount}可用</span>
        )}
      </div>
      {/* Right info */}
      <div className="flex-1 flex flex-col justify-between py-2 px-3">
        <div>
          <div className="text-[13px] font-semibold text-gray-800 line-clamp-1">{coupon.name}</div>
          <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{coupon.description}</div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            {coupon.end_time?.slice(0, 10)}到期
          </span>
          {mode === 'available' && (
            <button
              onClick={onClaim}
              disabled={disabled}
              className="px-2.5 py-0.5 rounded-full text-[11px] text-white"
              style={{ background: disabled ? '#ccc' : '#ff7a2e' }}
            >
              领取
            </button>
          )}
          {mode === 'mine' && (
            <button
              onClick={onUse}
              disabled={isUsed || isExpired}
              className="px-2.5 py-0.5 rounded-full text-[11px] text-white"
              style={{ background: isUsed || isExpired ? '#ccc' : '#ff7a2e' }}
            >
              {isUsed ? '已使用' : isExpired ? '已过期' : '去使用'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponCard;