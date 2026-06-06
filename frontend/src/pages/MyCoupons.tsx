import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import Header from '../components/Header';
import CouponCard from '../components/CouponCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import type { Coupon } from '../types';

const tabItems = [
  { key: 'available', label: '可使用' },
  { key: 'used', label: '已使用' },
  { key: 'expired', label: '已过期' },
];

const MyCoupons: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    const load = async () => {
      try {
        const res: any = await api.getMyCoupons();
        setCoupons(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const now = new Date();

  const filteredCoupons = coupons.filter((c) => {
    const isExpired = new Date(c.end_time) < now;
    const isUsed = c.is_used === 1;
    if (activeTab === 'available') return !isUsed && !isExpired;
    if (activeTab === 'used') return isUsed;
    return isExpired;
  });

  if (loading) return <Loading fullScreen text="加载优惠券..." />;

  return (
    <div className="h-full flex flex-col bg-guming-bg">
      <Header title="我的优惠券" />

      {/* Tabs */}
      <div className="flex-shrink-0 bg-white border-b border-guming-border">
        <div className="flex">
          {tabItems.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                className={`flex-1 py-3 text-sm relative transition-colors ${
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

      {/* Coupon List */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {filteredCoupons.length === 0 ? (
          <EmptyState
            emoji="🎫"
            message={activeTab === 'available' ? '暂无可用优惠券' : activeTab === 'used' ? '暂无已使用优惠券' : '暂无过期优惠券'}
            actionText={activeTab === 'available' ? '去领券' : undefined}
            onAction={activeTab === 'available' ? () => navigate('/coupon-center') : undefined}
          />
        ) : (
          <div className="space-y-3">
            {filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                action={activeTab === 'available' ? 'use' : 'none'}
                onAction={() => navigate('/menu')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoupons;