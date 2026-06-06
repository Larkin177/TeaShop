import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd?: (e: React.MouseEvent) => void;
  onClick?: () => void;
}

const categoryGradients: Record<string, { bg: string; emoji: string }> = {
  '当季限定': { bg: 'linear-gradient(135deg, #fce4d6, #f8d5c0)', emoji: '🥭' },
  '超人气': { bg: 'linear-gradient(135deg, #d4e8d0, #c0ddbb)', emoji: '👑' },
  '招牌必喝': { bg: 'linear-gradient(135deg, #fce4c0, #f8d8a0)', emoji: '🧋' },
  '奶茶': { bg: 'linear-gradient(135deg, #fce4d6, #f8d5c0)', emoji: '🧋' },
  '果茶': { bg: 'linear-gradient(135deg, #e8d0f8, #dcc0f0)', emoji: '🍹' },
  '咖啡': { bg: 'linear-gradient(135deg, #d4c4b0, #c0b0a0)', emoji: '☕' },
};

const defaultGrad = { bg: 'linear-gradient(135deg, #fce4d6, #f8d5c0)', emoji: '🍵' };

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, onClick }) => {
  const grad = categoryGradients[product.category_name || ''] || defaultGrad;

  return (
    <div
      className="flex items-center bg-white rounded-xl p-2.5 gap-2.5 cursor-pointer"
      onClick={onClick}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {/* Image area */}
      <div
        className="w-[72px] h-[72px] rounded-lg flex items-center justify-center shrink-0"
        style={{ background: grad.bg }}
      >
        <span className="text-2xl">{grad.emoji}</span>
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-[72px]">
        <div>
          <div className="text-[14px] font-bold text-gray-800 truncate">{product.name}</div>
          <div className="text-[11px] text-gray-400 truncate mt-0.5">{product.description}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-[12px] font-bold" style={{ color: '#e85c3a' }}>¥</span>
            <span className="text-[16px] font-bold" style={{ color: '#e85c3a' }}>{product.base_price.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400">月售{product.monthly_sales}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onAdd?.(e); }}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-lg"
              style={{ background: '#ff7a2e', lineHeight: 1, fontSize: 16 }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;