import React from 'react';
import { Minus, Plus } from './Icons';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
}

const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
}) => {
  const btnSize = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7';
  const iconSize = size === 'sm' ? 14 : 16;
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';
  const disabled = value <= min;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={`${btnSize} rounded-full flex items-center justify-center transition-colors ${
          disabled
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
            : 'bg-gray-100 text-gray-600 active:bg-gray-200'
        }`}
        onClick={() => !disabled && onChange(value - 1)}
        disabled={disabled}
      >
        <Minus size={iconSize} />
      </button>
      <span className={`${textSize} font-medium text-guming-text min-w-[20px] text-center`}>
        {value}
      </span>
      <button
        type="button"
        className={`${btnSize} rounded-full flex items-center justify-center transition-colors ${
          value >= max
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
            : 'bg-brand-500 text-white active:bg-brand-600'
        }`}
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
      >
        <Plus size={iconSize} color={value >= max ? '#ccc' : '#fff'} />
      </button>
    </div>
  );
};

export default QuantityStepper;