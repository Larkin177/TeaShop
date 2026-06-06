import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  layout?: 'horizontal' | 'vertical';
}

const categoryGradients: Record<string, string> = {
  '当季限定': 'from-orange-200 to-red-200',
  '超人气': 'from-yellow-200 to-orange-200',
  '招牌必喝': 'from-amber-200 to-yellow-200',
  '奶茶': 'from-orange-100 to-amber-200',
  '果茶': 'from-green-200 to-teal-200',
  '咖啡': 'from-amber-300 to-yellow-300',
  '茶拿铁': 'from-emerald-200 to-green-200',
  '小料': 'from-pink-200 to-purple-200',
};

const categoryEmojis: Record<string, string> = {
  '当季限定': '🔥',
  '超人气': '👑',
  '招牌必喝': '🏆',
  '奶茶': '🧋',
  '果茶': '🍹',
  '咖啡': '☕',
  '茶拿铁': '🍵',
  '小料': '🥣',
};

export const getProductGradient = (categoryName?: string): string => {
  if (categoryName && categoryGradients[categoryName]) {
    return categoryGradients[categoryName];
  }
  return 'from-orange-100 to-amber-100';
};

export const getProductEmoji = (categoryName?: string): string => {
  if (categoryName && categoryEmojis[categoryName]) {
    return categoryEmojis[categoryName];
  }
  return '🍵';
};

const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'horizontal' }) => {
  const navigate = useNavigate();
  const gradient = getProductGradient(product.category_name);
  const emoji = getProductEmoji(product.category_name);

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  if (layout === 'vertical') {
    return (
      <div
        className="bg-white rounded-xl shadow-card overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
        onClick={handleClick}
      >
        <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <span className="text-5xl">{emoji}</span>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium text-guming-text text-ellipsis-1">{product.name}</h3>
          <p className="text-xs text-guming-sub mt-1 text-ellipsis-1">{product.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-guming-price font-bold text-sm">
              ¥{product.base_price}
              <span className="text-[10px] font-normal ml-0.5">起</span>
            </span>
            <button
              onClick={handleAddClick}
              className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center active:bg-brand-600 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex bg-white rounded-xl shadow-card overflow-hidden cursor-pointer active:bg-gray-50/50 transition-colors"
      onClick={handleClick}
    >
      <div className={`w-[100px] h-[100px] flex-shrink-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-4xl">{emoji}</span>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="text-[15px] font-medium text-guming-text text-ellipsis-1">{product.name}</h3>
          <p className="text-xs text-guming-sub mt-0.5 text-ellipsis-1">{product.description}</p>
          <p className="text-[11px] text-guming-sub mt-1">月售 {product.monthly_sales}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-guming-price font-bold text-[15px]">
            ¥{product.base_price}
            <span className="text-[11px] font-normal ml-0.5">起</span>
          </span>
          <button
            onClick={handleAddClick}
            className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center active:bg-brand-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;