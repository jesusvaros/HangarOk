import React, { useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import CustomInput from '../CustomInput';
import type { AddressResult } from './types';
import { AddressDropdown } from './AddressDropdown';
import { umamiEventProps } from '../../../utils/analytics';

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
  hasError?: boolean;
  onActionClick?: () => void;
  actionDisabled?: boolean;
  actionIcon?: React.ComponentType<{ className?: string }>;
  allowBroadResults?: boolean;
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
  hasError = false,
  onActionClick,
  actionDisabled = false,
  actionIcon,
  allowBroadResults = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const Icon = actionIcon || MapPinIcon;

  return (
    <div className={`relative ${className}`}>
      {!hideLabel && (
        <label htmlFor={id} className="mb-2 block text-lg font-medium text-black">
          Address or Postcode {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <CustomInput
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          // Delay hiding the dropdown to allow for clicks on the options
          setTimeout(() => setIsFocused(false), 200);
        }}
        className={`${hideLabel ? 'rounded-l-lg rounded-r-none' : 'rounded-lg'} ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
      />
      {/* Right-side controls: crosshair action and optional spinner */}
      <div className={hideLabel ? 'absolute right-3 top-2.5 flex items-center gap-2' : 'absolute right-3 top-11 flex items-center gap-2'}>
        {onActionClick && (
          <button
            type="button"
            onClick={onActionClick}
            disabled={actionDisabled}
            aria-label="Ubicarme"
            className="text-[rgb(74,94,50)] hover:text-[rgb(54,74,30)] disabled:opacity-50 disabled:cursor-not-allowed"
            {...umamiEventProps('map:locate')}
          >
            <Icon className="h-5 w-5" />
          </button>
        )}
        {loading && (
          <div>
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-[rgb(74,94,50)]"></div>
          </div>
        )}
      </div>

      {/* Dropdown results */}
      <AddressDropdown
        results={results}
        isFocused={isFocused}
        hideLabel={hideLabel}
        onSelect={onSelect}
        allowBroadResults={allowBroadResults}
      />
    </div>
  );
};
