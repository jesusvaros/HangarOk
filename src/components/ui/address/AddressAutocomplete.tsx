import React, { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import type { AddressResult } from './types';
import { geocodingService } from './geocodingService';
import { AddressInput } from './AddressInput';
import { StreetNumberInput } from './StreetNumberInput';

interface AddressAutocompleteProps {
  onSelect?: (result: AddressResult) => void;
  onChange?: (value: string) => void;
  onNumberChange?: (value: string) => void;
  placeholder?: string;
  initialValue?: string;
  initialStreetNumber?: string;
  className?: string;
  id?: string;
  required?: boolean;
  showNumberField?: boolean;
  validateNumber?: boolean;
  hideLabel?: boolean;
  initialResult?: AddressResult;
  value?: string;
  streetNumberValue?: string;
  selectedResult?: AddressResult;
  label?: string;
  hasError?: boolean;
  numberHasError?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onSelect,
  onChange,
  onNumberChange,
  placeholder = 'Buscar dirección...',
  initialValue = '',
  initialStreetNumber = '',
  className = '',
  id = 'address-autocomplete',
  required = false,
  showNumberField = false,
  hideLabel = false,
  initialResult = undefined,
  value,
  streetNumberValue,
  selectedResult,
  hasError = false,
  numberHasError = false,
}) => {
  // State management
  const [query, setQuery] = useState(initialResult ? initialResult.formatted : initialValue);
  const [streetNumber, setStreetNumber] = useState(initialResult?.components.house_number || initialStreetNumber);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(initialResult || null);
  const [numberError, setNumberError] = useState(false);
  
  // Ref to track the first render to avoid unnecessary API calls
  const firstLoadRef = React.useRef(true);
  
  // Sync with external value changes (e.g., when selecting a location on the map)
  useEffect(() => {
    if (selectedResult && selectedResult !== selectedAddress) {
      setSelectedAddress(selectedResult);
      
      // Format the street display with postal code and city
      const city = selectedResult.components.city || 
                  selectedResult.components.town || 
                  selectedResult.components.village || '';
      const postcode = selectedResult.components.postcode || '';
      const formattedStreet = `${selectedResult.components.road || ''}, ${postcode} ${city}`;
      
      // Update the input values
      setQuery(formattedStreet);
      setStreetNumber(selectedResult.components.house_number || '');
    }
  }, [selectedResult, selectedAddress]);
  
  // Sync with external street value changes
  useEffect(() => {
    if (value !== undefined && value !== query) {
      setQuery(value);
    }
  }, [value, query]);
  
  // Sync with external street number value changes
  useEffect(() => {
    if (streetNumberValue !== undefined && streetNumberValue !== streetNumber) {
      setStreetNumber(streetNumberValue);
    }
  }, [streetNumberValue, streetNumber]);

  // Create a memoized debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchText: string) => {
        if (searchText.length < 3) {
          setResults([]);
          return;
        }
        
        setLoading(true);
        const searchResults = await geocodingService.searchAddresses(searchText);
        setResults(searchResults);
        setLoading(false);
      }, 500),
    [],
  );

  // Use the debounced search function
  const fetchAddresses = useCallback(
    (searchText: string) => {
      debouncedSearch(searchText);
    },
    [debouncedSearch],
  );

  // Trigger search when query changes
  useEffect(() => {
    // Avoid triggering a search on the very first render if the component already
    // received a valid pre-selected address (initialResult)
    if (initialResult && query === initialResult.formatted) {
      return;
    }
    
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
    }
    
    fetchAddresses(query);
  }, [query, fetchAddresses, initialResult]);

  // Handle address selection from dropdown
  const handleSelectAddress = (result: AddressResult) => {
    const number = result.components.house_number || '';
    const city =
      result.components.city || result.components.town || result.components.village || '';
    const postcode = result.components.postcode || '';

    // Format the street display with postal code and city
    const formattedStreet = `${result.components.road || ''}, ${postcode} ${city}`;

    // Update the input value with the formatted street
    setQuery(formattedStreet);

    // Update the number field if available
    if (number) {
      setStreetNumber(number);
    }

    // Store the selected address
    setSelectedAddress(result);

    // Reset error state
    setNumberError(false);

    // Clear results to hide dropdown
    setResults([]);

    // Call the onSelect callback with the result
    if (onSelect) {
      onSelect(result);
    }
  };

  // Handle street number changes
  const handleStreetNumberChange = (value: string) => {
    setStreetNumber(value);
    
    // Call the onNumberChange callback if provided
    if (onNumberChange) {
      onNumberChange(value);
    }
  };

  // Handle street number blur - update coordinates if needed
  const handleStreetNumberBlur = async (newNumber: string) => {
    // If we have a selected address and the number is not empty
    if (selectedAddress && newNumber.trim() !== '') {
      // Reset error state
      setNumberError(false);
      
      // If we need to update coordinates
      if (onSelect) {
        // Get updated result with new coordinates if possible
        const updatedResult = await geocodingService.getCoordinatesForAddress(
          selectedAddress,
          newNumber
        );
        
        // Update local state
        setSelectedAddress(updatedResult);
        
        // Notify parent component
        onSelect(updatedResult);
      }
    } else {
      setNumberError(false);
    }
  };

  // Handle query changes
  const handleQueryChange = (value: string) => {
    setQuery(value);
    
    // Call the onChange callback if provided
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex space-x-2">
        {/* Street input with dropdown */}
        <div className={`relative ${showNumberField ? 'w-3/4' : 'w-full'}`}>
          <AddressInput
            id={id}
            placeholder={placeholder}
            value={query}
            onChange={handleQueryChange}
            onSelect={handleSelectAddress}
            results={results}
            loading={loading}
            hideLabel={hideLabel}
            required={required}
            hasError={hasError}
          />
        </div>

        {/* Street number input */}
        {showNumberField && (
          <StreetNumberInput
            id={`${id}-number`}
            value={streetNumber}
            onChange={handleStreetNumberChange}
            onBlur={handleStreetNumberBlur}
            disabled={!selectedAddress}
            hasError={numberHasError || numberError}
          />
        )}
      </div>
    </div>
  );
};

export default AddressAutocomplete;
