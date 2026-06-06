import React from 'react';
import type { SpecGroup } from '../types';

interface SpecSelectorProps {
  groups: SpecGroup[];
  selected: Record<string, string>;
  onChange: (group: string, option: string) => void;
}

const SpecSelector: React.FC<SpecSelectorProps> = ({ groups, selected, onChange }) => {
  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <div key={group.id}>
          <div className="text-[13px] font-semibold text-gray-800 mb-2">
            {group.group_name}
            {group.is_required === 1 && <span className="text-[11px] text-red-400 ml-1">(必选)</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {group.options.map((opt) => {
              const isSelected = selected[group.group_name] === opt.name;
              return (
                <button
                  key={opt.id}
                  onClick={() => onChange(group.group_name, opt.name)}
                  className="px-3 py-1.5 rounded-full text-[12px] transition-colors"
                  style={{
                    background: isSelected ? '#e8f5e9' : '#f5f5f5',
                    color: isSelected ? '#4a9e4d' : '#666',
                    border: isSelected ? '1px solid #4a9e4d' : '1px solid transparent',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {opt.name}
                  {opt.extra_price > 0 && <span className="ml-1 text-[10px]">+¥{opt.extra_price.toFixed(2)}</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpecSelector;