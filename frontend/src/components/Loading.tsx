import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ fullScreen, text = '加载中...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: '#e0e0e0', borderTopColor: '#4a9e4d' }}
      />
      <span className="text-sm text-gray-400">{text}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-cream z-50">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-10">{content}</div>;
};

export default Loading;