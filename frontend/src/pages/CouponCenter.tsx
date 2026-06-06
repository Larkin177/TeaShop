import React, { useEffect, useState } from 'react';
import * as api from '../api';
import type { Coupon } from '../types';
import Header from '../components/Header';
import CouponCard from '../components/CouponCard';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';

const CouponCenter: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimedIds, setClaimedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    api.getAvailableCoupons()
      .then((res: any) => setCoupons(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleClaim = async (id: number) => {
    try {
      await api.claimCoupon(id);
      setClaimedIds((prev) => new Set(prev).add(id));
    } catch {}
  };

  if (loading) return <><Header title="领券中心" /><Loading /></>;

  return (
    <div className="flex flex-col h-full bg-cream">
      <Header title="领券中心" />
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {coupons.length === 0 ? (
          <EmptyState icon="🎫" text="暂无可领取的优惠券" />
        ) : (
          <div className="flex flex-col gap-3">
            {coupons.map((c) => (
              <CouponCard
                key={c.id}
                coupon={c}
                mode="available"
                disabled={claimedIds.has(c.id)}
                onClaim={() => handleClaim(c.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponCenter;