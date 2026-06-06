import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useStoreSelectionStore } from '../store';
import Header from '../components/Header';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { Check, Search } from '../components/Icons';
import type { Store } from '../types';

const StoreSelect: React.FC = () => {
  const navigate = useNavigate();
  const { selectedStoreId, setStore } = useStoreSelectionStore();
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res: any = await api.getStores();
        setStores(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = search.trim()
    ? stores.filter(
        (s) =>
          s.name.includes(search.trim()) || s.address.includes(search.trim())
      )
    : stores;

  const handleSelect = (store: Store) => {
    setStore(store.id, store.name);
    navigate(-1);
  };

  if (loading) return <Loading fullScreen text="加载门店..." />;

  return (
    <div className="h-full flex flex-col bg-guming-bg">
      <Header title="选择门店" />

      {/* Search */}
      <div className="flex-shrink-0 bg-white px-4 py-2 border-b border-guming-border">
        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2">
          <Search size={16} color="#999" />
          <input
            type="text"
            placeholder="搜索门店"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-guming-text placeholder:text-guming-sub outline-none"
          />
        </div>
      </div>

      {/* Store List */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {filtered.length === 0 ? (
          <EmptyState emoji="🏪" message="暂无门店" />
        ) : (
          <div className="space-y-2">
            {filtered.map((store) => {
              const isSelected = selectedStoreId === store.id;
              return (
                <button
                  key={store.id}
                  onClick={() => handleSelect(store)}
                  className={`w-full text-left bg-white rounded-xl shadow-card p-4 flex items-center gap-3 active:bg-gray-50 transition-colors ${
                    isSelected ? 'ring-2 ring-brand-500' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-medium text-guming-text">{store.name}</h3>
                    <p className="text-xs text-guming-sub mt-1 text-ellipsis-1">{store.address}</p>
                    <p className="text-[11px] text-guming-sub mt-0.5">营业时间: {store.business_hours}</p>
                  </div>
                  {isSelected && (
                    <Check size={20} color="#FF7A2E" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreSelect;