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
    <header
      className="flex items-center h-11 px-3 shrink-0 relative z-10"
      style={transparent ? {} : { background: 'linear-gradient(135deg, #4a9e4d, #3d8a40)' }}
    >
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center"
          style={{ color: transparent ? '#333' : '#fff' }}
        >
          <Back size={20} color={transparent ? '#333' : '#fff'} />
        </button>
      ) : (
        <div className="w-8" />
      )}
      <h1
        className="flex-1 text-center text-[15px] font-semibold truncate"
        style={{ color: transparent ? '#333' : '#fff' }}
      >
        {title}
      </h1>
      <div className="w-8 h-8 flex items-center justify-center">
        {right || null}
      </div>
    </header>
  );
};

export default Header;