import React, { useEffect, useState } from 'react';
import * as api from '../api';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  is_default: number;
}

const MyAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = () => {
    setLoading(true);
    api.getAddresses()
      .then((res: any) => setAddresses(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除该地址？')) return;
    try {
      await api.deleteAddress(id);
      loadAddresses();
    } catch {}
  };

  if (loading) return <><Header title="我的地址" /><Loading /></>;

  return (
    <div className="flex flex-col h-full bg-cream">
      <Header title="我的地址" />
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {addresses.length === 0 ? (
          <EmptyState icon="📍" text="暂无地址" />
        ) : (
          <div className="flex flex-col gap-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white rounded-xl p-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[14px] font-bold text-gray-800">{addr.name}</span>
                      <span className="text-[12px] text-gray-400">{addr.phone}</span>
                      {addr.is_default === 1 && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{ background: '#e8f5e9', color: '#4a9e4d' }}
                        >
                          默认
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-gray-500">{addr.address}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-[18px] text-gray-300 ml-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAddresses;