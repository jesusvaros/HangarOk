import React from 'react';

interface CustomCheckboxProps {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  required = false,
  error = false,
}) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
          className="w-4 h-4 accent-[rgb(74,94,50)] border-gray-300 rounded"
        />
      </div>
      <label
        htmlFor={id}
        className={`ml-2 text-lg font-medium ${error ? 'text-red-500' : 'text-black'}`}
      >
        {label}
      </label>
    </div>
  );
};

export default CustomCheckbox;
