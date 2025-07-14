import React from 'react';
import CustomInput from '../CustomInput';

interface StreetNumberInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
  disabled: boolean;
  hasError: boolean;
}

export const StreetNumberInput: React.FC<StreetNumberInputProps> = ({
  id,
  value,
  onChange,
  onBlur,
  disabled,
  hasError,
}) => {
  return (
    <div className="w-1/4">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Número
      </label>
      <CustomInput
        id={id}
        type="text"
        placeholder="Número"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        className={`${hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
      />
      {hasError && <p className="mt-1 text-xs text-red-500">Número no coincide</p>}
    </div>
  );
};
