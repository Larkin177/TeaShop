import React from 'react';

interface EmptyStateProps {
  emoji?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ emoji = '🍵', message, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <span className="text-6xl mb-4">{emoji}</span>
      <p className="text-guming-sub text-sm mb-4">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-full gradient-brand text-white text-sm font-medium shadow-card active:opacity-90 transition-opacity"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;