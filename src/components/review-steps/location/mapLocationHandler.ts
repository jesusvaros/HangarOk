import { useCallback } from 'react';
import type { AddressResult } from '../../ui/AddressAutocomplete';

/**
 * A hook that returns a function to handle location selection from the map.
 * This function performs reverse geocoding using the HERE API.
 * 
 * @param handleAddressSelect - Function to handle address selection after reverse geocoding
 * @returns A function that handles location selection from the map
 */
export const useMapLocationHandler = (
  handleAddressSelect: (result: AddressResult) => void
) => {
  return useCallback(async (lat: number, lng: number) => {
    try {
      const apiKey = import.meta.env.VITE_HERE_API_KEY;
      // Perform reverse geocoding with HERE API
      const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&lang=es-ES&apiKey=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const location = data.items[0];
        const address = location.address;
        
        // Create an address result in the format expected by handleAddressSelect
        const addressResult: AddressResult = {
          formatted: address.label || `${address.street || ''} ${address.houseNumber || ''}, ${address.city || ''}`,
          geometry: {
            lat: lat,
            lng: lng,
          },
          components: {
            road: address.street || '',
            house_number: address.houseNumber || '',
            postcode: address.postalCode || '',
            city: address.city || '',
            state: address.state || '',
            country: address.countryName || '',
          },
          annotations: {
            geohash: '', // We don't have a geohash from HERE API, but we need to include it for type compatibility
          },
        };
        
        // Update form with the new address
        handleAddressSelect(addressResult);
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }
  }, [handleAddressSelect]);
};
