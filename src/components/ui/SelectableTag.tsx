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
          ? 'bg-[rgb(74,94,50)] text-white border-[rgb(74,94,50)]' 
          : 'bg-white text-gray-700 border-gray-300 hover:border-[rgb(74,94,50)]'}
        ${className}
      `}
    >
      {label}
    </div>
  );
};

export default SelectableTag;
