import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useStoreSelectionStore } from '../store';
import type { Store } from '../types';
import Header from '../components/Header';
import Loading from '../components/Loading';

const StoreSelect: React.FC = () => {
  const navigate = useNavigate();
  const { setStore } = useStoreSelectionStore();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStores()
      .then((res: any) => setStores(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (store: Store) => {
    setStore(store.id, store.name);
    navigate(-1);
  };

  if (loading) return <><Header title="选择门店" /><Loading /></>;

  return (
    <div className="flex flex-col h-full bg-cream">
      <Header title="选择门店" />
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-3">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => handleSelect(store)}
              className="bg-white rounded-xl p-3.5 flex items-start gap-3 text-left"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #4a9e4d, #3d8a40)' }}
              >
                <span className="text-white text-lg">🏪</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-gray-800">{store.name}</div>
                <div className="text-[11px] text-gray-400 mt-0.5 truncate">{store.address}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  📞 {store.phone} · 🕐 {store.business_hours}
                </div>
              </div>
              <span className="text-gray-300 text-lg mt-2">›</span>
            </button>
          ))}
          {stores.length === 0 && (
            <div className="text-center text-gray-400 text-[13px] py-10">暂无门店</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreSelect;