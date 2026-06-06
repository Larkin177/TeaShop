import React from 'react';
import type { Topping } from '../types';

interface ToppingSelectorProps {
  toppings: Topping[];
  selectedIds: number[];
  onChange: (id: number) => void;
}

const ToppingSelector: React.FC<ToppingSelectorProps> = ({ toppings, selectedIds, onChange }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {toppings.map((t) => {
        const isSelected = selectedIds.includes(t.id);
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="flex flex-col items-center py-2.5 rounded-lg text-[12px] transition-colors"
            style={{
              background: isSelected ? '#e8f5e9' : '#f8f8f8',
              border: isSelected ? '1.5px solid #4a9e4d' : '1.5px solid transparent',
              color: isSelected ? '#4a9e4d' : '#666',
              fontWeight: isSelected ? 600 : 400,
            }}
          >
            <span className="text-sm mb-0.5">{isSelected ? '✓' : ''} {t.name}</span>
            <span className="text-[11px]" style={{ color: '#e85c3a' }}>+¥{t.price.toFixed(2)}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ToppingSelector;