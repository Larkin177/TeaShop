import React from 'react';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  size = 'md',
  color = '#e85c3a',
}) => {
  const sizes = {
    sm: { symbol: 10, value: 12 },
    md: { symbol: 12, value: 16 },
    lg: { symbol: 14, value: 22 },
  };
  const s = sizes[size];

  return (
    <span className="inline-flex items-baseline gap-0.5">
      <span style={{ fontSize: s.symbol, color, fontWeight: 700 }}>¥</span>
      <span style={{ fontSize: s.value, color, fontWeight: 700 }}>{price.toFixed(2)}</span>
      {originalPrice !== undefined && originalPrice > price && (
        <span className="ml-1 text-[11px] text-gray-400 line-through">¥{originalPrice.toFixed(2)}</span>
      )}
    </span>
  );
};

export default PriceDisplay;