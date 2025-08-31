import React from 'react';
import AddressAutocomplete, { type AddressResult } from '../ui/AddressAutocomplete';

interface SearchBarProps {
  value: string;
  onSelect: (r: AddressResult) => void;
  onLocate?: () => void;
  onUserInput?: (v: string) => void;
  actionDisabled?: boolean;
  allowBroadResults?: boolean; // allow cities/villages (not only streets)
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onSelect, onLocate, onUserInput, actionDisabled, allowBroadResults }) => {
  return (
    <div className="relative">
      <AddressAutocomplete
        value={value}
        onSelect={onSelect}
        hideLabel
        showNumberField={false}
        onUserInput={onUserInput}
        allowBroadResults={allowBroadResults}
        onActionClick={onLocate}
        actionDisabled={actionDisabled}
      />
    </div>
  );
};

export default SearchBar;
