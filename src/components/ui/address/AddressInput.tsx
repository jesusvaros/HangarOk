import React, { useState } from 'react';
import CustomInput from '../CustomInput';
import type { AddressResult } from './types';
import { AddressDropdown } from './AddressDropdown';

interface AddressInputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (result: AddressResult) => void;
  results: AddressResult[];
  loading: boolean;
  hideLabel?: boolean;
  required?: boolean;
  className?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  id,
  placeholder,
  value,
  onChange,
  onSelect,
  results,
  loading,
  hideLabel = false,
  required = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!hideLabel && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">
          Dirección {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <CustomInput
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          // Delay hiding the dropdown to allow for clicks on the options
          setTimeout(() => setIsFocused(false), 200);
        }}
        className={`${hideLabel ? 'rounded-l-lg rounded-r-none' : 'rounded-lg'}`}
      />
      {loading && (
        <div className={hideLabel ? 'absolute right-3 top-2.5' : 'absolute right-3 top-11'}>
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-[rgb(74,94,50)]"></div>
        </div>
      )}
      
      {/* Dropdown results */}
      <AddressDropdown 
        results={results}
        isFocused={isFocused}
        hideLabel={hideLabel}
        onSelect={onSelect}
      />
    </div>
  );
};
