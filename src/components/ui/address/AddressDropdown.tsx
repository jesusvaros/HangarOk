import React from 'react';
import type { AddressResult } from './types';

interface AddressDropdownProps {
  results: AddressResult[];
  isFocused: boolean;
  hideLabel?: boolean;
  onSelect: (result: AddressResult) => void;
  allowBroadResults?: boolean;
}

export const AddressDropdown: React.FC<AddressDropdownProps> = ({
  results,
  isFocused,
  hideLabel = false,
  onSelect,
  allowBroadResults = false,
}) => {
  if (results.length === 0 || !isFocused) {
    return null;
  }

  return (
    <ul
      className={`absolute left-0 right-0 z-[10000] mt-1 max-h-60 overflow-y-auto rounded-b-lg bg-white shadow-lg ${
        hideLabel ? 'top-[48px]' : 'top-[80px]'
      }`}
    >
      {results.map((result, index) => {
        const road = result.components.road;
        const park = result.components.park;
        const parking = result.components.parking;
        const city =
          result.components.city || result.components.town || result.components.village || '';
        const postcode = result.components.postcode || '';

        // Filtering: if broad results are allowed, accept city/town/village-only entries
        if (!allowBroadResults) {
          if (!(road || park || parking) || !city) {
            return null;
          }
        } else {
          // For broad results, allow if we have either a street or a locality (city/town/village)
          if (!road && !park && !parking && !city) {
            return null;
          }
        }

        // Format with street highlighted
        const displayAddress = (() => {
          if (road || park || parking) {
            return (
              <span>
                <strong>{road || park || parking}</strong>, {city} {postcode}
              </span>
            );
          }
          // Broad: show locality prominently
          return (
            <span>
              <strong>{city}</strong>{postcode ? `, ${postcode}` : ''}
            </span>
          );
        })();

        // Use a combination of geohash and index to ensure uniqueness
        // If geohash is missing, use formatted_address or index as fallback
        const uniqueKey = result.annotations?.geohash
          ? `${result.annotations.geohash}-${index}`
          : result.formatted
            ? `addr-${result.formatted}-${index}`
            : `result-${index}`;

        return (
          <li
            key={uniqueKey}
            onClick={() => onSelect(result)}
            className="cursor-pointer px-3 py-2 hover:bg-gray-100"
          >
            {displayAddress}
          </li>
        );
      })}
    </ul>
  );
};
