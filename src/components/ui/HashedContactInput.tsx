import React, { useEffect, useState } from 'react';
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
    <div className={`flex gap-4 flex-col ${className}`}>
      <div className="flex-1">
        <CustomInput
          id={id}
          label={label}
          type={type}
          value={localValue}
          onChange={handleValueChange}
          placeholder={placeholder}
        />
      </div>
      
      <div className="w-full border border-gray-200 bg-gray-100 p-2 rounded-lg max-w-full overflow-hidden"> 
          <DecryptedText
            text={computedHash !== '' ? computedHash : hashValue? hashValue: 'Aqui se muestra el valor secreto que guardaremos'}
            revealDirection="end"
            animateOn="view"
            speed={155}
            className="break-all text-sm"
            encryptedClassName=' break-all text-sm'
          />
      </div>
    </div>
  );
};

export default HashedContactInput;
