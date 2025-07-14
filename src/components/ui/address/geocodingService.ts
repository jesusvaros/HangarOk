import type { AddressResult, HereGeocodeItem } from './types';

/**
 * Service for handling geocoding operations with the HERE API
 */
export const geocodingService = {
  /**
   * Search for addresses using the HERE API
   * @param searchText The text to search for
   * @returns Promise with the search results
   */
  async searchAddresses(searchText: string): Promise<AddressResult[]> {
    if (searchText.length < 3) {
      return [];
    }

    try {
      const apiKey = import.meta.env.VITE_HERE_API_KEY;

      // HERE Geocoding search confined to Spain for street suggestions
      const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
        searchText
      )}&in=countryCode:ESP&lang=es-ES&limit=10&apiKey=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.items) {
        console.error('HERE API error or empty response', data);
        return [];
      }

      // Map HERE items to AddressResult shape expected by the component
      const processedResults: AddressResult[] = (data.items as HereGeocodeItem[]).map((item) => {
        const addr = item.address || {};
        return {
          formatted: addr.label,
          geometry: {
            lat: item.position.lat,
            lng: item.position.lng,
          },
          components: {
            road: addr.street,
            house_number: addr.houseNumber,
            postcode: addr.postalCode,
            city: addr.city,
            state: addr.state,
            country: addr.countryName,
          },
          annotations: {
            geohash: '', // HERE API doesn't provide geohash; left empty
          },
        } as AddressResult;
      });

      return processedResults;
    } catch (err) {
      console.error('Error fetching addresses:', err);
      return [];
    }
  },

  /**
   * Get coordinates for a specific address with house number
   * @param street Street name
   * @param houseNumber House number
   * @param city City name
   * @returns Promise with the updated address result including coordinates
   */
  async getCoordinatesForAddress(
    selectedAddress: AddressResult, 
    newNumber: string
  ): Promise<AddressResult> {
    try {
      // Extract address components
      const street = selectedAddress.components.road;
      const city =
        selectedAddress.components.city ||
        selectedAddress.components.town ||
        selectedAddress.components.village ||
        '';
      
      // Skip API call if we don't have enough information
      if (!street || !city || !newNumber.trim()) {
        return {
          ...selectedAddress,
          components: {
            ...selectedAddress.components,
            house_number: newNumber,
          },
        };
      }
      
      const fullAddressQuery = `${street} ${newNumber}, ${city}, España`;
      
      // Make API request to get coordinates
      const apiKey = import.meta.env.VITE_HERE_API_KEY;
      const response = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
          fullAddressQuery
        )}&in=countryCode:ESP&lang=es-ES&limit=1&apiKey=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        // Extract coordinates from the result
        const position = data.items[0].position;
        
        // Return updated result with new coordinates
        return {
          ...selectedAddress,
          geometry: {
            lat: position.lat,
            lng: position.lng,
          },
          components: {
            ...selectedAddress.components,
            house_number: newNumber,
          },
        };
      }
      
      // If no results, just update the house number
      return {
        ...selectedAddress,
        components: {
          ...selectedAddress.components,
          house_number: newNumber,
        },
      };
    } catch (error) {
      console.error('Error al obtener coordenadas:', error);
      
      // In case of error, just update the house number
      return {
        ...selectedAddress,
        components: {
          ...selectedAddress.components,
          house_number: newNumber,
        },
      };
    }
  }
};
