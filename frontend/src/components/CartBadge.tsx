import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store';
import { Cart } from './Icons';

const CartBadge: React.FC = () => {
  const navigate = useNavigate();
  const { totalCount, totalPrice } = useCartStore();

  if (totalCount === 0) return null;

  return (
    <button
      onClick={() => navigate('/cart')}
      className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-brand-500 shadow-float flex flex-col items-center justify-center active:scale-95 transition-transform z-40"
    >
      <Cart size={22} color="white" />
      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
        {totalCount > 99 ? '99+' : totalCount}
      </span>
      <span className="text-white text-[10px] font-medium mt-0.5">¥{totalPrice.toFixed(0)}</span>
    </button>
  );
};

export default CartBadge;