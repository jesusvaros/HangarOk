import { useCallback } from 'react';
import type { AddressResult } from '../../ui/AddressAutocomplete';

/**
 * A hook that returns a function to handle location selection from the map.
 * This function performs reverse geocoding using the HERE API.
 *
 * @param handleAddressSelect - Function to handle address selection after reverse geocoding
 * @returns A function that handles location selection from the map
 */
export const useMapLocationHandler = (handleAddressSelect: (result: AddressResult) => void) => {
  return useCallback(
    async (lat: number, lng: number) => {
      try {
        // Use server-side proxy for cost control
        const response = await fetch('/api/geocode-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: 'revgeocode',
            params: {
              at: `${lat},${lng}`,
              lang: 'en-GB'
            }
          })
        });

        const data = await response.json();

        // Handle usage limits or errors
        if (!response.ok) {
          if (data.fallback) {
            console.warn('HERE API reverse geocode limit reached');
            return;
          }
          throw new Error(data.error || 'Reverse geocoding request failed');
        }

        if (data.items && data.items.length > 0) {
          const location = data.items[0];
          const address = location.address;

          // Create an address result in the format expected by handleAddressSelect
          // Ensure we extract and map all fields correctly
          const addressResult: AddressResult = {
            formatted:
              address.label ||
              `${address.street || ''} ${address.houseNumber || ''}, ${address.city || ''}`,
            geometry: {
              lat: lat,
              lng: lng,
            },
            components: {
              // Ensure we map HERE API fields to the expected OpenCage format
              road: address.street || '',
              house_number: address.houseNumber || '',
              postcode: address.postalCode || '',
              city: address.city || '',
              town: address.district || '', // Use district as fallback for town
              village: address.district || '', // Use district as fallback for village
              state: address.state || '',
              country: address.countryName || '',
            },
            annotations: {
              geohash: '', // We don't have a geohash from HERE API, but we need to include it for type compatibility
            },
          };

          // Log what we're sending to the form
          console.log('Reverse geocoded address:', addressResult);

          // Update form with the new address
          handleAddressSelect(addressResult);
        }
      } catch (error) {
        console.error('Error in reverse geocoding:', error);
      }
    },
    [handleAddressSelect]
  );
};
