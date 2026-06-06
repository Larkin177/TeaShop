import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store';

const CartBadge: React.FC = () => {
  const navigate = useNavigate();
  const totalCount = useCartStore((s) => s.totalCount);
  const totalPrice = useCartStore((s) => s.totalPrice);

  if (totalCount === 0) return null;

  return (
    <button
      onClick={() => navigate('/cart')}
      className="fixed bottom-16 right-4 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #ff7a2e, #ff9651)',
        boxShadow: '0 4px 16px rgba(255,122,46,0.4)',
      }}
    >
      <span className="text-white text-xl">🛒</span>
      <span className="text-white text-[13px] font-semibold">¥{totalPrice.toFixed(2)}</span>
      <span
        className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full text-[10px] text-white flex items-center justify-center px-1"
        style={{ background: '#e85c3a' }}
      >
        {totalCount}
      </span>
    </button>
  );
};

export default CartBadge;