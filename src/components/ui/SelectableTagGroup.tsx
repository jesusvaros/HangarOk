import React from 'react';
import SelectableTag from './SelectableTag';

interface SelectableTagGroupProps {
  label?: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selectedOptions: string[]) => void;
  multiSelect?: boolean;
  className?: string;
}

const SelectableTagGroup: React.FC<SelectableTagGroupProps> = ({
  label,
  options,
  selectedOptions,
  onChange,
  multiSelect = true,
  className = '',
}) => {
  const handleTagClick = (option: string) => {
    if (multiSelect) {
      // Para multiselección
      if (selectedOptions.includes(option)) {
        // Si ya está seleccionado, lo quitamos
        onChange(selectedOptions.filter(item => item !== option));
      } else {
        // Si no está seleccionado, lo añadimos
        onChange([...selectedOptions, option]);
      }
    } else {
      // Para selección única (como un radio button)
      onChange([option]);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>}
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
