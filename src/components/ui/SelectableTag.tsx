import React from 'react';

interface SelectableTagProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

const SelectableTag: React.FC<SelectableTagProps> = ({
  label,
  selected,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg border cursor-pointer transition-all
        ${selected 
          ? 'bg-orange-500 text-white border-orange-500' 
          : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'}
        ${className}
      `}
    >
      {label}
    </div>
  );
};

export default SelectableTag;
