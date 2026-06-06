import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../api';
import { useStoreSelectionStore } from '../store';
import ProductCard from '../components/ProductCard';
import CartBadge from '../components/CartBadge';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { Search, Location, ArrowRight } from '../components/Icons';
import type { Category, Product } from '../types';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { selectedStoreId, selectedStoreName } = useStoreSelectionStore();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const tabScrollRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    try {
      const [catRes, prodRes] = await Promise.allSettled([
        api.getCategories(),
        api.getProducts(),
      ]);
      const cats = catRes.status === 'fulfilled' ? (catRes.value as any).data || [] : [];
      const prods = prodRes.status === 'fulfilled' ? (prodRes.value as any).data || [] : [];
      setCategories(cats);
      setProducts(prods);

      if (categoryId) {
        setActiveCategoryId(Number(categoryId));
      } else if (cats.length > 0) {
        setActiveCategoryId(cats[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
    } else if (activeCategoryId) {
      filtered = filtered.filter((p) => p.category_id === activeCategoryId);
    }
    return filtered;
  }, [products, activeCategoryId, searchQuery]);

  const handleCategoryClick = (catId: number) => {
    setActiveCategoryId(catId);
    setSearchQuery('');
    navigate(`/menu/${catId}`, { replace: true });
  };

  if (loading) return <Loading fullScreen text="加载菜单..." />;

  return (
    <div className="h-full flex flex-col bg-guming-bg">
      {/* Search Bar */}
      <div className="flex-shrink-0 bg-white px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2">
          <Search size={16} color="#999" />
          <input
            type="text"
            placeholder="搜索饮品"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-guming-text placeholder:text-guming-sub outline-none"
          />
        </div>
      </div>

      {/* Store Info */}
      <div className="flex-shrink-0 bg-white px-4 py-2 border-t border-guming-border">
        <button
          className="flex items-center gap-1 text-xs text-guming-sub"
          onClick={() => navigate('/store-select')}
        >
          <Location size={12} />
          <span>当前门店: {selectedStoreName || '未选择'}</span>
          <ArrowRight size={10} />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex-shrink-0 bg-white border-b border-guming-border">
        <div ref={tabScrollRef} className="flex overflow-x-auto hide-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id && !searchQuery;
            return (
              <button
                key={cat.id}
                className={`flex-shrink-0 px-4 py-3 text-sm transition-colors relative whitespace-nowrap ${
                  isActive ? 'text-brand-500 font-medium' : 'text-guming-sub'
                }`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.name}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-brand-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} layout="horizontal" />
          ))
        ) : (
          <EmptyState
            emoji="🔍"
            message={searchQuery ? `没有找到"${searchQuery}"相关饮品` : '该分类暂无饮品'}
            actionText={searchQuery ? '清除搜索' : '查看全部'}
            onAction={() => {
              setSearchQuery('');
              if (!activeCategoryId && categories.length > 0) {
                setActiveCategoryId(categories[0].id);
              }
            }}
          />
        )}
      </div>

      <CartBadge />
    </div>
  );
};

export default Menu;