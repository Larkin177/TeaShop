import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const wrap = (d: string, size: number, color: string, className?: string, fill = false, vb = '0 0 24 24') => (
  <svg width={size} height={size} viewBox={vb} fill={fill ? color : 'none'} stroke={fill ? 'none' : color} strokeWidth={fill ? 0 : 2} strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg" dangerouslySetInnerHTML={{ __html: d }} />
);

export const Home: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"/>', size, color, className);

export const HomeFill: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" fill="currentColor"/>', size, color, className, true);

export const Menu: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M4 6h16M4 12h16M4 18h16"/>', size, color, className);

export const MenuFill: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<rect x="3" y="4" width="18" height="4" rx="1" fill="currentColor"/><rect x="3" y="10" width="18" height="4" rx="1" fill="currentColor"/><rect x="3" y="16" width="18" height="4" rx="1" fill="currentColor"/>', size, color, className, true);

export const Order: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>', size, color, className);

export const OrderFill: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" fill="currentColor" stroke="none"/><rect x="6" y="10" width="12" height="1.5" rx="0.75" fill="#fff"/><rect x="6" y="13.5" width="8" height="1.5" rx="0.75" fill="#fff"/><rect x="6" y="17" width="10" height="1.5" rx="0.75" fill="#fff"/>', size, color, className, true);

export const Mine: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>', size, color, className);

export const MineFill: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<circle cx="12" cy="7" r="4" fill="currentColor"/><path d="M5.5 21a6.5 6.5 0 0113 0" fill="currentColor"/>', size, color, className, true);

export const Cart: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>', size, color, className);

export const ArrowRight: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M9 5l7 7-7 7"/>', size, color, className);

export const Location: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>', size, color, className);

export const Search: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>', size, color, className);

export const Plus: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M12 5v14m-7-7h14"/>', size, color, className);

export const Minus: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M5 12h14"/>', size, color, className);

export const Close: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M18 6L6 18M6 6l12 12"/>', size, color, className);

export const Check: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M5 13l4 4L19 7"/>', size, color, className);

export const Coupon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>', size, color, className);

export const Phone: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>', size, color, className);

export const Time: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', size, color, className);

export const Back: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M15 19l-7-7 7-7"/>', size, color, className);

export const Delete: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>', size, color, className);

export const Edit: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) =>
  wrap('<path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>', size, color, className);