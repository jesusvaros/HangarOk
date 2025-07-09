import React from 'react';

// Light green color for background - same as used in StepperBar
const lightGreenColor = 'rgba(74, 94, 50, 0.2)';

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
      style={{
        backgroundColor: selected ? lightGreenColor : 'white'
      }}
      className={`
        px-4 py-2 rounded-lg border cursor-pointer transition-all
        ${selected 
          ? 'text-black border-[rgb(74,94,50)]' 
          : 'text-gray-700 border-gray-300 hover:border-[rgb(74,94,50)]'}
        ${className}
      `}
    >
      {label}
    </div>
  );
};

export default SelectableTag;
