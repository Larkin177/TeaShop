import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../api';
import { useCartStore, useStoreSelectionStore, useUserStore } from '../store';
import type { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import CartBadge from '../components/CartBadge';
import Loading from '../components/Loading';

const categoryEmojis: Record<string, string> = {
  '当季限定': '🥭', '超人气': '👑', '招牌必喝': '🧋', '奶茶': '🧋',
  '果茶': '🍹', '咖啡': '☕', '酸奶': '🥛', '纯茶': '🍵',
};

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const fetchCart = useCartStore((s) => s.fetchCart);
  const addItem = useCartStore((s) => s.addItem);
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const selectedStoreName = useStoreSelectionStore((s) => s.selectedStoreName);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState<'self' | 'delivery'>('self');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.getCategories(),
          api.getProducts(),
        ]);
        const cats = (catRes as any).data || [];
        const prods = (prodRes as any).data || [];
        setCategories(cats);
        setProducts(prods);
        if (categoryId) {
          setActiveCategory(Number(categoryId));
        } else if (cats.length > 0) {
          setActiveCategory(cats[0].id);
        }
      } catch (e) { /* ignore */ }
      setLoading(false);
    };
    loadData();
    if (isLoggedIn) fetchCart();
  }, [categoryId]);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category_id === activeCategory)
    : products;

  const handleQuickAdd = async (product: Product) => {
    try {
      await addItem({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image || '',
        specs: {},
        toppings: [],
        quantity: 1,
        unit_price: product.base_price,
      });
    } catch {}
  };

  if (loading) return <Loading text="加载菜单中..." />;

  return (
    <div className="flex flex-col h-full">
      {/* Store header */}
      <div className="px-4 py-2.5 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4a9e4d, #3d8a40)' }}
          >
            <span className="text-white text-sm">🏪</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-gray-800 truncate">{selectedStoreName || '武林广场店'}</div>
            <div className="text-[11px] text-gray-400">距您500m · 前方3杯制作中</div>
          </div>
        </div>
      </div>

      {/* Order type toggle */}
      <div className="flex items-center justify-center py-2 px-4 bg-white border-b border-gray-50 shrink-0">
        <div className="flex items-center bg-gray-100 rounded-full p-0.5">
          {(['self', 'delivery'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className="px-4 py-1 rounded-full text-[12px] font-medium transition-colors"
              style={{
                background: orderType === type ? '#4a9e4d' : 'transparent',
                color: orderType === type ? '#fff' : '#999',
              }}
            >
              {type === 'self' ? '自取' : '外卖'}
            </button>
          ))}
        </div>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div
          className="w-[90px] overflow-y-auto shrink-0 scrollbar-thin"
          style={{ background: '#f5f0e8' }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex flex-col items-center py-3 w-full transition-colors relative"
                style={{
                  background: isActive ? '#fff' : 'transparent',
                  borderLeft: isActive ? '3px solid #4a9e4d' : '3px solid transparent',
                }}
              >
                <span className="text-base mb-0.5">{categoryEmojis[cat.name] || cat.icon || '🍵'}</span>
                <span
                  className="text-[11px]"
                  style={{ color: isActive ? '#4a9e4d' : '#666', fontWeight: isActive ? 600 : 400 }}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right product list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 bg-cream">
          <div className="flex flex-col gap-2.5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/product/${product.id}`)}
                onAdd={() => handleQuickAdd(product)}
              />
            ))}
            {filteredProducts.length === 0 && (
              <div className="text-center text-gray-400 text-[13px] py-10">该分类暂无商品</div>
            )}
          </div>
        </div>
      </div>

      <CartBadge />
    </div>
  );
};

export default Menu;