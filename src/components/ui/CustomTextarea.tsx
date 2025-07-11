import React from 'react';

interface CustomTextareaProps {
  id: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  className = '',
  rows = 4,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-[rgb(74,94,50)]"
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
};

export default CustomTextarea;
