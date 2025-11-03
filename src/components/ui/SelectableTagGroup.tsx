import React from 'react';
import SelectableTag from './SelectableTag';

interface SelectableTagGroupProps {
  label?: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selectedOptions: string[]) => void;
  multiSelect?: boolean;
  className?: string;
  error?: boolean;
}

const SelectableTagGroup: React.FC<SelectableTagGroupProps> = ({
  label,
  options,
  selectedOptions,
  onChange,
  multiSelect = true,
  className = '',
  error = false,
}) => {
  const handleTagClick = (option: string) => {
    if (multiSelect) {
      // Multi-select behaviour
      if (selectedOptions.includes(option)) {
        // Remove if already selected
        onChange(selectedOptions.filter(item => item !== option));
      } else {
        // Add otherwise
        onChange([...selectedOptions, option]);
      }
    } else {
      // Single selection (radio-button-like)
      onChange([option]);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className={`mb-2 block text-lg font-medium text-black ${error ? 'text-red-600' : ''}`}>{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <SelectableTag
            key={option}
            label={option}
            selected={selectedOptions.includes(option)}
            onClick={() => handleTagClick(option)}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectableTagGroup;
