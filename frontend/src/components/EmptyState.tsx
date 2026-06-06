import React from 'react';

interface EmptyStateProps {
  icon?: string;
  text?: string;
  action?: { label: string; onClick: () => void };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🍵',
  text = '暂无数据',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <span className="text-5xl">{icon}</span>
      <span className="text-sm text-gray-400">{text}</span>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-5 py-2 rounded-full text-sm text-white"
          style={{ background: 'linear-gradient(135deg, #ff7a2e, #ff9651)' }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;