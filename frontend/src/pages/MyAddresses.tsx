import React, { useEffect, useState, useCallback } from 'react';
import * as api from '../api';
import Header from '../components/Header';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { Edit, Delete } from '../components/Icons';

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  is_default: number;
}

const MyAddresses: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [saving, setSaving] = useState(false);

  const loadAddresses = useCallback(async () => {
    try {
      const res: any = await api.getAddresses();
      setAddresses(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const resetForm = () => {
    setEditId(null);
    setFormName('');
    setFormPhone('');
    setFormAddress('');
    setShowForm(false);
  };

  const handleEdit = (addr: Address) => {
    setEditId(addr.id);
    setFormName(addr.name);
    setFormPhone(addr.phone);
    setFormAddress(addr.address);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteAddress(id);
      loadAddresses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!formName.trim() || !formPhone.trim() || !formAddress.trim()) return;
    setSaving(true);
    try {
      const data = { name: formName, phone: formPhone, address: formAddress };
      if (editId) {
        await api.updateAddress(editId, data);
      } else {
        await api.addAddress(data);
      }
      resetForm();
      loadAddresses();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullScreen text="加载地址..." />;

  return (
    <div className="h-full flex flex-col bg-guming-bg">
      <Header title="收货地址" />

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {addresses.length === 0 && !showForm ? (
          <EmptyState emoji="📍" message="暂无地址" />
        ) : (
          <div className="space-y-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white rounded-xl shadow-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-guming-text">{addr.name}</span>
                      <span className="text-xs text-guming-sub">{addr.phone}</span>
                      {addr.is_default === 1 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-500">默认</span>
                      )}
                    </div>
                    <p className="text-xs text-guming-sub mt-1">{addr.address}</p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button onClick={() => handleEdit(addr)} className="p-1">
                      <Edit size={16} color="#999" />
                    </button>
                    <button onClick={() => handleDelete(addr.id)} className="p-1">
                      <Delete size={16} color="#999" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mt-3 bg-white rounded-xl shadow-card p-4">
            <h3 className="text-sm font-medium text-guming-text mb-3">
              {editId ? '编辑地址' : '新增地址'}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="姓名"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-guming-text placeholder:text-guming-sub"
              />
              <input
                type="tel"
                placeholder="手机号"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-guming-text placeholder:text-guming-sub"
              />
              <input
                type="text"
                placeholder="详细地址"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-guming-text placeholder:text-guming-sub"
              />
              <div className="flex gap-2">
                <button
                  onClick={resetForm}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-guming-sub"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-lg gradient-brand text-sm text-white disabled:opacity-60"
                >
                  {saving ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!showForm && (
        <div className="flex-shrink-0 bg-white border-t border-guming-border safe-bottom px-4 py-3">
          <button
            onClick={() => setShowForm(true)}
            className="w-full gradient-brand text-white font-medium py-3 rounded-full active:opacity-90 transition-opacity"
          >
            新增地址
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAddresses;