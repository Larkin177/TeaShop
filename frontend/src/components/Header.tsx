import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Back } from './Icons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = true, right, transparent = false }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`sticky top-0 z-30 flex items-center h-12 px-3 ${
        transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors -ml-1"
        >
          <Back size={20} />
        </button>
      ) : (
        <div className="w-8" />
      )}
      <h1 className="flex-1 text-center text-base font-medium text-guming-text text-ellipsis-1 px-2">
        {title}
      </h1>
      {right ? <div className="w-8 flex items-center justify-center">{right}</div> : <div className="w-8" />}
    </div>
  );
};

export default Header;