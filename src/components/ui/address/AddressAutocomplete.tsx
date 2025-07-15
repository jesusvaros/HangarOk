import React, { useState, useMemo, useEffect } from "react";
import debounce from "lodash.debounce";
import { AddressInput } from "./AddressInput";
import { StreetNumberInput } from "./StreetNumberInput";
import type { AddressResult } from "./types";
import { geocodingService } from "./geocodingService";

interface AddressAutocompleteProps {
  value: string;
  streetNumberValue: string;
  onNumberChange: (v: string) => void;
  onNumberBlur: (v: string) => void;
  onSelect: (r: AddressResult) => void;
  placeholder?: string;
  showNumberField?: boolean;
  hasError?: boolean;
  numberHasError?: boolean;
  className?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  streetNumberValue,
  onNumberChange,
  onNumberBlur,
  onSelect,
  placeholder = "Buscar dirección...",
  showNumberField = false,
  hasError = false,
  numberHasError = false,
  className = "",
}) => {
  const [results, setResults] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(value || "");

  useEffect(() => {
    setQuery(value || "");
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
  };

  // Handle selection
  const handleSelect = (r: AddressResult) => {
    setQuery(r.formatted || ""); 
    onSelect(r);
    setResults([]);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex space-x-2">
        <div className={`relative ${showNumberField ? "w-3/4" : "w-full"}`}>
          <AddressInput
            id="address"
            value={query}
            onChange={handleQueryChange}
            onSelect={handleSelect}
            results={results}
            loading={loading}
            placeholder={placeholder}
            hasError={hasError}
          />
        </div>
        {showNumberField && (
          <StreetNumberInput
            id="number"
            value={streetNumberValue}
            onChange={onNumberChange}
            onBlur={() => onNumberBlur(streetNumberValue)}
            disabled={!value || value.trim() === ""}
            hasError={numberHasError}
          />
        )}
      </div>
    </div>
  );
};

export default AddressAutocomplete;


