import React from 'react';

interface PriceDisplayProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { symbol: 'text-xs', integer: 'text-base', decimal: 'text-xs' },
  md: { symbol: 'text-sm', integer: 'text-xl', decimal: 'text-sm' },
  lg: { symbol: 'text-base', integer: 'text-2xl', decimal: 'text-base' },
};

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, size = 'md' }) => {
  const formatted = price.toFixed(2);
  const [intPart, decPart] = formatted.split('.');
  const s = sizeMap[size];

  return (
    <span className="inline-flex items-baseline text-guming-price font-bold">
      <span className={s.symbol}>¥</span>
      <span className={s.integer}>{intPart}</span>
      <span className={s.decimal}>.{decPart}</span>
    </span>
  );
};

export default PriceDisplay;