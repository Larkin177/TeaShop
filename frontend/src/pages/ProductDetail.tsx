import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../api';
import { useCartStore } from '../store';
import SpecSelector from '../components/SpecSelector';
import ToppingSelector from '../components/ToppingSelector';
import QuantityStepper from '../components/QuantityStepper';
import Loading from '../components/Loading';
import { Back, Share } from '../components/Icons';
import { getProductGradient, getProductEmoji } from '../components/ProductCard';
import type { Product, SpecOption, Topping } from '../types';

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addItem, fetchCart } = useCartStore();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<number, number>>({});
  const [selectedToppings, setSelectedToppings] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res: any = await api.getProductDetail(Number(id));
        const p = res.data;
        setProduct(p);
        const defaults: Record<number, number> = {};
        p.spec_groups?.forEach((g: any) => {
          const def = g.options.find((o: any) => o.is_default);
          if (def) defaults[g.id] = def.id;
          else if (g.options.length > 0) defaults[g.id] = g.options[0].id;
        });
        setSelectedSpecs(defaults);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const calculatedPrice = useMemo(() => {
    if (!product) return 0;
    let price = product.base_price;
    product.spec_groups?.forEach((g) => {
      const optId = selectedSpecs[g.id];
      if (optId) {
        const opt = g.options.find((o) => o.id === optId);
        if (opt) price += opt.extra_price;
      }
    });
    selectedToppings.forEach((tId) => {
      const topping = product.toppings?.find((t) => t.id === tId);
      if (topping) price += topping.price;
    });
    return price * quantity;
  }, [product, selectedSpecs, selectedToppings, quantity]);

  const handleSpecSelect = (groupId: number, option: SpecOption) => {
    setSelectedSpecs((prev) => ({ ...prev, [groupId]: option.id }));
  };

  const handleToppingToggle = (topping: Topping) => {
    setSelectedToppings((prev) =>
      prev.includes(topping.id) ? prev.filter((id) => id !== topping.id) : [...prev, topping.id]
    );
  };

  const handleAddToCart = async () => {
    if (!product || adding) return;
    setAdding(true);
    try {
      const specs: Record<string, string> = {};
      product.spec_groups?.forEach((g) => {
        const optId = selectedSpecs[g.id];
        const opt = g.options.find((o) => o.id === optId);
        if (opt) specs[g.group_name] = opt.name;
      });
      const toppings = (product.toppings || [])
        .filter((t) => selectedToppings.includes(t.id))
        .map((t) => ({ id: t.id, name: t.name, price: t.price }));

      for (let i = 0; i < quantity; i++) {
        await addItem({
          product_id: product.id,
          product_name: product.name,
          product_image: product.image,
          specs,
          toppings,
          quantity: 1,
          unit_price: calculatedPrice / quantity,
        });
      }
      await fetchCart();
      navigate(-1);
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  if (loading || !product) return <Loading fullScreen text="加载中..." />;

  const gradient = getProductGradient(product.category_name);
  const emoji = getProductEmoji(product.category_name);

  return (
    <div className="fixed inset-0 z-50 bg-guming-bg animate-slide-up overflow-y-auto">
      {/* Top Image Area */}
      <div className={`relative h-52 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-7xl">{emoji}</span>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center"
        >
          <Back size={18} color="white" />
        </button>
        <button className="absolute top-10 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <Share size={18} color="white" />
        </button>
      </div>

      <div className="px-4 pb-24">
        {/* Product Info */}
        <div className="bg-white rounded-xl shadow-card -mt-4 relative z-10 p-4 mb-3">
          <h1 className="text-xl font-bold text-guming-text">{product.name}</h1>
          <p className="text-sm text-guming-sub mt-1">{product.description}</p>
          <p className="text-xs text-guming-sub mt-1">月售 {product.monthly_sales}</p>
          <div className="mt-2 flex items-baseline">
            <span className="text-guming-price font-bold text-2xl">¥{product.base_price}</span>
            <span className="text-guming-sub text-sm ml-1">起</span>
          </div>
        </div>

        {/* Spec Groups */}
        {product.spec_groups?.map((group) => (
          <div key={group.id} className="bg-white rounded-xl shadow-card p-4 mb-3">
            <SpecSelector
              title={group.group_name}
              options={group.options}
              selectedId={selectedSpecs[group.id] || null}
              onSelect={(opt) => handleSpecSelect(group.id, opt)}
            />
          </div>
        ))}

        {/* Toppings */}
        {product.toppings && product.toppings.length > 0 && (
          <div className="bg-white rounded-xl shadow-card p-4 mb-3">
            <ToppingSelector
              toppings={product.toppings}
              selectedIds={selectedToppings}
              onToggle={handleToppingToggle}
            />
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-guming-border safe-bottom">
        <div className="max-w-[450px] mx-auto flex items-center gap-3 px-4 py-3">
          <QuantityStepper value={quantity} min={1} max={99} onChange={setQuantity} />
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="flex-1 gradient-brand text-white font-medium text-sm py-3 rounded-full text-center active:opacity-90 transition-opacity disabled:opacity-60"
          >
            加入购物车 ¥{calculatedPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;