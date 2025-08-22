import React from 'react';

interface CustomInputProps {
  id: string;
  label?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  onBlur,
  onFocus,
  error,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-base font-medium text-black">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-[1px] ${className} ${error ? 'bg-red-100 border-red-400' : 'focus:ring-inline-[rgb(74,94,50)]'}`}
        placeholder={placeholder}
        disabled={disabled}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    </div>
  );
};

export default CustomInput;
