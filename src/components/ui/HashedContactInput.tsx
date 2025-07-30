import React, { useEffect, useState } from 'react';
import { ArrowRightIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import CustomInput from './CustomInput';
import DecryptedText from './DecryptedText';
import { hashValue as hashValueSupabase } from '../../services/supabase/hashValues.ts';

export interface HashedContactInputProps {
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value: string;
  hashValue?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

const HashedContactInput: React.FC<HashedContactInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  hashValue,
  onChange,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [computedHash, setComputedHash] = useState(hashValue ?? '');

  const handleValueChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    const newHash = newValue ? await hashValueSupabase(newValue) : '';
    setComputedHash(newHash);
    onChange(newValue);
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={`flex lg:gap-4 flex-col lg:flex-row items-center ${className}`}>
      <div className="flex-1 w-full lg:w-1/2 ">
        <CustomInput
          id={id}
          label={label}
          type={type}
          value={localValue}
          onChange={handleValueChange}
          placeholder={placeholder}
        />
      </div>

      {/* Arrow and info */}
      <div className="flex items-center text-gray-600 lg:flex-col lg:items-center">
        <div className="flex items-center">
          <LockClosedIcon className="w-4 h-4" />
          <ArrowRightIcon className="w-6 h-6 lg:rotate-0 rotate-90" />
        </div>
        <span className="text-xs ml-1 lg:ml-0 lg:mt-1 font-bold lg:max-w-[70px]">
          Cifrado anonimo
        </span>
      </div>

      <div className=" border bg-[rgb(225,245,110)] p-2 rounded-lg max-w-full overflow-hidden lg:w-1/2 mt-2 lg:mt-0">
        <DecryptedText
          text={
            computedHash !== ''
              ? computedHash
              : hashValue
                ? hashValue
                : 'Aqui se muestra el valor secreto que guardaremos'
          }
          revealDirection="end"
          animateOn="view"
          speed={155}
          className="break-all text-sm"
          encryptedClassName=" break-all text-sm"
        />
      </div>
    </div>
  );
};

export default HashedContactInput;
