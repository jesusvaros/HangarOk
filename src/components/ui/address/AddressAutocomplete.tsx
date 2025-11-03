import React, { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { AddressInput } from './AddressInput';
import { StreetNumberInput } from './StreetNumberInput';
import type { AddressResult } from './types';
import { geocodingService } from './geocodingService';

interface AddressAutocompleteProps {
  value: string;
  streetNumberValue?: string;
  onNumberChange?: (v: string) => void;
  onNumberBlur?: (v: string) => void;
  onSelect: (r: AddressResult) => void;
  placeholder?: string;
  showNumberField?: boolean;
  hasError?: boolean;
  numberHasError?: boolean;
  className?: string;
  inputClassName?: string;
  hideLabel?: boolean;
  onActionClick?: () => void;
  actionDisabled?: boolean;
  onUserInput?: (v: string) => void;
  actionIcon?: React.ComponentType<{ className?: string }>;
  allowBroadResults?: boolean; // Allow cities/villages results (not only streets)
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  streetNumberValue,
  onNumberChange,
  onNumberBlur,
  onSelect,
  placeholder = 'Search address...',
  showNumberField = false,
  hasError = false,
  numberHasError = false,
  className = '',
  inputClassName = '',
  hideLabel = false,
  onActionClick,
  actionDisabled = false,
  onUserInput,
  actionIcon,
  allowBroadResults = false,
}) => {
  const [results, setResults] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(value || '');

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Debounce search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (q: string) => {
        if (q.length < 3) {
          setResults([]);
          return;
        }
        setLoading(true);
        const r = await geocodingService.searchAddresses(q);
        setResults(r);
        setLoading(false);
      }, 400),
    []
  );

  // Handle input changes
  const handleQueryChange = (v: string) => {
    debouncedSearch(v);
    setQuery(v);
    onUserInput?.(v);
  };

  // Handle selection
  const handleSelect = (r: AddressResult) => {
    if (allowBroadResults) {
      // For city/town/village or general places, just use formatted label
      setQuery(r.formatted || '');
    } else {
      // Format a complete address with street, city and postal code
      const street = r.components?.road || r.components?.park || r.components?.parking || '';
      const number = r.components?.house_number || '';
      const city = r.components?.city || r.components?.town || r.components?.village || '';
      const postcode = r.components?.postcode || '';

      // Create a complete formatted address
      const completeAddress = [street + (number ? ' ' + number : ''), city, postcode]
        .filter(Boolean)
        .join(', ');

      // Use the complete address or fallback to formatted
      setQuery(completeAddress || r.formatted || '');
    }
    onSelect(r);
    setResults([]);
  };

  return (
    <div className={`relative w-full ${className} flex space-x-2`}>
        <div className={`relative ${showNumberField ? 'w-3/4' : 'w-full'}`}>
          <AddressInput
            id="address"
            value={query}
            onChange={handleQueryChange}
            onSelect={handleSelect}
            results={results}
            loading={loading}
            placeholder={placeholder}
            hasError={hasError}
            hideLabel={hideLabel}
            onActionClick={onActionClick}
            actionDisabled={actionDisabled}
            actionIcon={actionIcon}
            className={inputClassName}
            allowBroadResults={allowBroadResults}
          />
        </div>
        {showNumberField && onNumberChange && onNumberBlur && (
          <StreetNumberInput
            id="number"
            value={streetNumberValue || ''}
            onChange={onNumberChange}
            onBlur={() => onNumberBlur(streetNumberValue || '')}
            disabled={!value || value.trim() === ''}
            hasError={numberHasError}
          />
        )}

    </div>
  );
};

export default AddressAutocomplete;
