import React from 'react';

interface CustomTextareaProps {
  id: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  maxLength?: number;
  hintText?: string;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  className = '',
  rows = 4,
  maxLength,
  hintText,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-base font-medium text-black">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
        />
        {typeof maxLength === 'number' && (
          <span className="pointer-events-none absolute bottom-2 right-3 text-xs text-gray-400">
            {`${value.length}/${maxLength}`}
          </span>
        )}
      </div>
      {hintText && <p className="mt-1 text-xs text-gray-500">{hintText}</p>}
    </div>
  );
};

export default CustomTextarea;
