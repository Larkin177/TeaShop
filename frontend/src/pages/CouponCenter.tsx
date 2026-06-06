import React, { useEffect, useState } from 'react';
import * as api from '../api';
import Header from '../components/Header';
import CouponCard from '../components/CouponCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import type { Coupon } from '../types';

const CouponCenter: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [claimedIds, setClaimedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const res: any = await api.getAvailableCoupons();
        setCoupons(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleClaim = async (coupon: Coupon) => {
    try {
      await api.claimCoupon(coupon.id);
      setClaimedIds((prev) => new Set(prev).add(coupon.id));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <Loading fullScreen text="加载优惠券..." />;

  return (
    <div className="h-full flex flex-col bg-guming-bg">
      <Header title="领券中心" />

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {coupons.length === 0 ? (
          <EmptyState emoji="🎫" message="暂无可领取的优惠券" />
        ) : (
          <div className="space-y-3">
            {coupons.map((coupon) => {
              const claimed = claimedIds.has(coupon.id) || !!coupon.received_at;
              return (
                <div key={coupon.id} className="bg-white rounded-xl shadow-card overflow-hidden">
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
                        {coupon.description && (
                          <p className="text-xs text-guming-sub mt-0.5 text-ellipsis-1">{coupon.description}</p>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => !claimed && handleClaim(coupon)}
                          disabled={claimed}
                          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            claimed
                              ? 'bg-gray-100 text-guming-sub cursor-not-allowed'
                              : 'bg-brand-500 text-white active:bg-brand-600'
                          }`}
                        >
                          {claimed ? '已领取' : '领取'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponCenter;