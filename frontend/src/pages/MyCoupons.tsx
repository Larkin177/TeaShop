import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import type { Coupon } from '../types';
import Header from '../components/Header';
import CouponCard from '../components/CouponCard';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';

const MyCoupons: React.FC = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyCoupons()
      .then((res: any) => setCoupons(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Header title="我的优惠券" /><Loading /></>;

  return (
    <div className="flex flex-col h-full bg-cream">
      <Header title="我的优惠券" />
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {coupons.length === 0 ? (
          <EmptyState
            icon="🎫"
            text="暂无优惠券"
            action={{ label: '去领券', onClick: () => navigate('/coupon-center') }}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {coupons.map((c) => (
              <CouponCard key={c.id} coupon={c} mode="mine" onUse={() => navigate('/menu')} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoupons;