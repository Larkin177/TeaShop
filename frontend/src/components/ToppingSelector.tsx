import React from 'react';
import type { Topping } from '../types';

interface ToppingSelectorProps {
  toppings: Topping[];
  selectedIds: number[];
  onToggle: (topping: Topping) => void;
}

const ToppingSelector: React.FC<ToppingSelectorProps> = ({
  toppings,
  selectedIds,
  onToggle,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-guming-text mb-3">加料</h3>
      <div className="grid grid-cols-3 gap-2">
        {toppings.map((topping) => {
          const isSelected = selectedIds.includes(topping.id);
          return (
            <button
              key={topping.id}
              type="button"
              className={`flex flex-col items-center py-3 px-2 rounded-xl text-sm transition-all ${
                isSelected
                  ? 'border-2 border-brand-500 bg-brand-50'
                  : 'border border-guming-border bg-white'
              }`}
              onClick={() => onToggle(topping)}
            >
              <span className={isSelected ? 'text-brand-500 font-medium' : 'text-guming-text'}>
                {topping.name}
              </span>
              <span className="text-xs text-guming-price mt-1">+¥{topping.price.toFixed(2)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ToppingSelector;