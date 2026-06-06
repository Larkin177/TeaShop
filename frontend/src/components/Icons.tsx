import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

type IconFC = React.FC<IconProps>;

const svgProps = (size: number, color: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const Home: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
  </svg>
);

export const HomeFill: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 3l9 8h-3v9a1 1 0 01-1 1h-4v-6h-2v6H7a1 1 0 01-1-1v-9H3l9-8z" />
  </svg>
);

export const Menu: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" fill={color} stroke="none" />
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const MenuFill: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <circle cx="12" cy="12" r="10" fill={color} opacity="0.15" />
    <path d="M7 7h4v4H7zM13 7h4v4h-4zM7 13h4v4H7zM13 13h4v4h-4z" />
  </svg>
);

export const Order: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

export const OrderFill: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M7 3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2h-2v2h2v2H7V5h2V3H7zm0 8h10v2H7v-2zm0 4h6v2H7v-2z" />
  </svg>
);

export const Mine: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
  </svg>
);

export const MineFill: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <circle cx="12" cy="8" r="4" />
    <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2H6z" />
  </svg>
);

export const Cart: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

export const ArrowRight: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const Location: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const Search: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

export const Plus: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const Minus: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const Close: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const Check: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const Coupon: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 10h20" />
    <circle cx="8" cy="15" r="1" fill={color} stroke="none" />
    <path d="M12 13h5" />
  </svg>
);

export const Phone: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <circle cx="12" cy="18" r="1" fill={color} stroke="none" />
  </svg>
);

export const Time: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
);

export const Back: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const Share: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export const Like: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
  </svg>
);

export const LikeFill: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
  </svg>
);

export const Star: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const StarFill: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const Delete: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export const Edit: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const Setting: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

export const Gift: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" rx="1" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
  </svg>
);

export const Fire: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.19 2.13-6.17 3.39-7.34.34-.31.89-.09.91.36.06 1.32.41 3.28 1.7 4.98.12.16.37.07.37-.14 0-1.58-.41-3.65-.41-4.65 0-1.3.52-2.5 1.35-3.38.22-.23.59-.11.63.18.25 1.74 1.26 3.5 2.56 4.78.12.12.33.04.33-.13 0-.97-.14-2.61-.14-3.34 0-.69.26-1.33.69-1.8.16-.18.46-.07.47.17.06 1.24.72 3.14 1.89 4.47.12.14.36.05.36-.14C21 11 21 7.5 15.5 3.5c-.2-.15-.47.05-.4.28.7 2.32.4 4.22-.22 5.72-.12.28-.4.33-.58.1C12.5 7.5 11 5 11 2.5c0-.28-.35-.42-.5-.18C8.5 5.5 3 9 3 15c0 5.5 4.5 8 9 8z" />
  </svg>
);

export const Crown: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <path d="M2 20h20L18 8l-4 6-2-8-2 8-4-6L2 20z" fill={color} opacity="0.15" stroke={color} />
  </svg>
);

export const Coffee: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <path d="M18 8h1a4 4 0 010 8h-1" />
    <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

export const Fruit: IconFC = ({ size = 24, color = 'currentColor' }) => (
  <svg {...svgProps(size, color)}>
    <circle cx="12" cy="13" r="7" />
    <path d="M12 6V2" />
    <path d="M9 4c0 0 1.5-2 3-2s3 2 3 2" />
  </svg>
);