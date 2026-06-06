import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../api';
import { useCartStore, useUserStore } from '../store';
import type { Product, SpecGroup } from '../types';
import SpecSelector from '../components/SpecSelector';
import ToppingSelector from '../components/ToppingSelector';
import QuantityStepper from '../components/QuantityStepper';
import Loading from '../components/Loading';
import Header from '../components/Header';

const categoryGradients: Record<string, { bg: string; emoji: string }> = {
  '当季限定': { bg: 'linear-gradient(135deg, #fce4d6, #f8d5c0)', emoji: '🥭' },
  '超人气': { bg: 'linear-gradient(135deg, #d4e8d0, #c0ddbb)', emoji: '👑' },
  '招牌必喝': { bg: 'linear-gradient(135deg, #fce4c0, #f8d8a0)', emoji: '🧋' },
  '奶茶': { bg: 'linear-gradient(135deg, #fce4d6, #f8d5c0)', emoji: '🧋' },
  '果茶': { bg: 'linear-gradient(135deg, #e8d0f8, #dcc0f0)', emoji: '🍹' },
  '咖啡': { bg: 'linear-gradient(135deg, #d4c4b0, #c0b0a0)', emoji: '☕' },
};
const defaultGrad = { bg: 'linear-gradient(135deg, #fce4d6, #f8d5c0)', emoji: '🍵' };

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const addItem = useCartStore((s) => s.addItem);
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const fetchCart = useCartStore((s) => s.fetchCart);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  const [selectedToppingIds, setSelectedToppingIds] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getProductDetail(Number(id))
      .then((res: any) => {
        const p = res.data;
        setProduct(p);
        // Set default specs
        const defaults: Record<string, string> = {};
        p.spec_groups?.forEach((g: SpecGroup) => {
          const def = g.options.find((o) => o.is_default === 1);
          if (def) defaults[g.group_name] = def.name;
          else if (g.options.length > 0) defaults[g.group_name] = g.options[0].name;
        });
        setSelectedSpecs(defaults);
      })
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
    if (isLoggedIn) fetchCart();
  }, [id]);

  const extraPrice = useMemo(() => {
    if (!product) return 0;
    let extra = 0;
    product.spec_groups?.forEach((g) => {
      const selected = selectedSpecs[g.group_name];
      const opt = g.options.find((o) => o.name === selected);
      if (opt) extra += opt.extra_price;
    });
    product.toppings?.forEach((t) => {
      if (selectedToppingIds.includes(t.id)) extra += t.price;
    });
    return extra;
  }, [product, selectedSpecs, selectedToppingIds]);

  const totalPrice = product ? (product.base_price + extraPrice) * quantity : 0;

  const handleToggleTopping = (id: number) => {
    setSelectedToppingIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddToCart = async () => {
    if (!product || adding) return;
    setAdding(true);
    try {
      const selectedToppings = product.toppings
        ?.filter((t) => selectedToppingIds.includes(t.id))
        .map((t) => ({ id: t.id, name: t.name, price: t.price })) || [];
      await addItem({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image || '',
        specs: selectedSpecs,
        toppings: selectedToppings,
        quantity,
        unit_price: product.base_price + extraPrice,
      });
      navigate(-1);
    } catch { /* ignore */ }
    setAdding(false);
  };

  if (loading) return <Loading text="加载中..." />;
  if (!product) return null;

  const grad = categoryGradients[product.category_name || ''] || defaultGrad;

  return (
    <div className="flex flex-col h-full bg-cream">
      {/* Image area */}
      <div
        className="relative h-[200px] flex items-center justify-center shrink-0"
        style={{ background: grad.bg }}
      >
        <Header title="" showBack transparent />
        <span className="text-6xl">{grad.emoji}</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Name & info */}
        <h2 className="text-[18px] font-bold text-gray-800">{product.name}</h2>
        <p className="text-[12px] text-gray-400 mt-1">{product.description}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">月售 {product.monthly_sales} 杯</p>
        <div className="mt-2 mb-4">
          <span className="text-[14px] font-bold" style={{ color: '#e85c3a' }}>¥</span>
          <span className="text-[22px] font-bold" style={{ color: '#e85c3a' }}>{product.base_price.toFixed(2)}</span>
        </div>

        {/* Spec groups */}
        {product.spec_groups && product.spec_groups.length > 0 && (
          <div className="mb-4">
            <SpecSelector
              groups={product.spec_groups}
              selected={selectedSpecs}
              onChange={(group, option) => setSelectedSpecs((prev) => ({ ...prev, [group]: option }))}
            />
          </div>
        )}

        {/* Toppings */}
        {product.toppings && product.toppings.length > 0 && (
          <div className="mb-4">
            <div className="text-[13px] font-semibold text-gray-800 mb-2">加料</div>
            <ToppingSelector
              toppings={product.toppings}
              selectedIds={selectedToppingIds}
              onChange={handleToggleTopping}
            />
          </div>
        )}

        {/* Remark */}
        <div className="mb-20">
          <div className="text-[13px] font-semibold text-gray-800 mb-2">备注</div>
          <div className="bg-white rounded-xl p-3 text-[12px] text-gray-500">
            如有特殊需求请备注
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex items-center px-4 py-2.5 bg-white border-t border-gray-100 shrink-0 safe-bottom"
      >
        <div className="flex-1">
          <span className="text-[14px] font-bold" style={{ color: '#e85c3a' }}>¥{totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="px-5 py-2.5 rounded-full text-white text-[14px] font-semibold"
            style={{ background: 'linear-gradient(135deg, #ff7a2e, #ff9651)' }}
          >
            加入购物车
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;