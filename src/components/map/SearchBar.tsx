import React from 'react';
import AddressAutocomplete, { type AddressResult } from '../ui/AddressAutocomplete';

interface SearchBarProps {
  value: string;
  onSelect: (r: AddressResult) => void;
  onLocate?: () => void;
  onUserInput?: (v: string) => void;
  actionDisabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onSelect, onLocate, onUserInput, actionDisabled }) => {
  return (
    <div className="rounded-2xl bg-white/95 backdrop-blur p-2 shadow-lg border">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <AddressAutocomplete
            value={value}
            onSelect={onSelect}
            hideLabel
            showNumberField={false}
            onUserInput={onUserInput}
          />
        </div>
        {onLocate && (
          <button
            type="button"
            onClick={onLocate}
            className="h-12 px-3 rounded-xl border hover:bg-gray-50"
            title="Usar mi ubicación"
            disabled={!!actionDisabled}
          >
            📍
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
