import React from 'react';
import type { SpecOption } from '../types';

interface SpecSelectorProps {
  title: string;
  options: SpecOption[];
  selectedId: number | null;
  onSelect: (option: SpecOption) => void;
}

const SpecSelector: React.FC<SpecSelectorProps> = ({
  title,
  options,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-guming-text mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm transition-all ${
                isSelected
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-50 text-guming-text'
              }`}
              onClick={() => onSelect(option)}
            >
              {isSelected && (
                <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {option.name}
              {option.extra_price > 0 && (
                <span className={isSelected ? 'text-white/80 ml-1' : 'text-guming-sub ml-1'}>
                  +¥{option.extra_price}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SpecSelector;