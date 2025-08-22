import React, { useEffect, useState } from 'react';
import { LockClosedIcon, XMarkIcon } from '@heroicons/react/24/solid';
import CustomInput from './CustomInput';
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
  const [showModal, setShowModal] = useState(false);

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
    <div className={`flex flex-col ${className}`}>
      {/* Input with lock icon to the right */}
      <div className="flex items-center gap-2">
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
        <div
          className="flex h-12 w-12 items-center justify-center rounded-md border bg-white text-gray-600 mt-3"
          onMouseEnter={() => window.dispatchEvent(new CustomEvent('cv:privacyHover', { detail: true }))}
          onMouseLeave={() => window.dispatchEvent(new CustomEvent('cv:privacyHover', { detail: false }))}
          aria-label="Información de privacidad"
          role="button"
          tabIndex={0}
          onClick={() => setShowModal(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowModal(true);
            }
          }}
        >
          <LockClosedIcon className="h-6 w-6" />
        </div>
      </div>

      {/* Removed inline help text; lock icon opens modal for transparency */}

      {/* Simple modal to show the hash value for transparency */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-base font-semibold">Así lo guardamos</h4>
              <button
                aria-label="Cerrar"
                className="rounded p-1 hover:bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-2 text-sm text-gray-600">
              Este es el valor cifrado que se almacena en nuestra base de datos:
            </p>
            <code className="block max-w-full truncate rounded bg-gray-100 p-2 text-xs">
              {computedHash || hashValue || '—'}
            </code>
            <div className="mt-4 flex justify-end">
              <button
                className="rounded bg-[rgb(74,94,50)] px-4 py-2 text-white hover:bg-[rgb(60,76,40)]"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HashedContactInput;
