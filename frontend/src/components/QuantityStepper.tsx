import React from 'react';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  size?: 'sm' | 'md';
}

const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
}) => {
  const dim = size === 'sm' ? 22 : 26;
  const fontSize = size === 'sm' ? 12 : 14;

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => value > min && onChange(value - 1)}
        className="rounded-full flex items-center justify-center"
        style={{
          width: dim,
          height: dim,
          background: value <= min ? '#f0f0f0' : '#eee',
          color: value <= min ? '#ccc' : '#666',
          fontSize: fontSize + 2,
          lineHeight: 1,
        }}
      >
        −
      </button>
      <span
        className="text-center font-medium"
        style={{ fontSize, minWidth: 20, color: '#333' }}
      >
        {value}
      </span>
      <button
        onClick={() => value < max && onChange(value + 1)}
        className="rounded-full flex items-center justify-center"
        style={{
          width: dim,
          height: dim,
          background: value >= max ? '#f0f0f0' : '#4a9e4d',
          color: value >= max ? '#ccc' : '#fff',
          fontSize: fontSize + 2,
          lineHeight: 1,
        }}
      >
        +
      </button>
    </div>
  );
};

export default QuantityStepper;