import type { AddressDetails } from '../../../validation/formValidation';
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
    currentDetails: AddressDetails,
    newNumber: string
  ): Promise<AddressDetails> {
    const street = currentDetails.street;
    const city = currentDetails.city || "";
    if (!street || !newNumber.trim()) {
      return {
        ...currentDetails,
        number: newNumber,
      };
    }
  
    const fullAddressQuery = `${street} ${newNumber}, ${city}, España`;
  
    const apiKey = import.meta.env.VITE_HERE_API_KEY;
    const response = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
        fullAddressQuery
      )}&in=countryCode:ESP&lang=es-ES&limit=1&apiKey=${apiKey}`
    );
  
    const data = await response.json();
  
    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      const addr = item.address;
  
      return {
        street: addr.street,
        number: addr.houseNumber || newNumber,
        city: addr.city,
        postalCode: addr.postalCode,
        state: addr.state,
        fullAddress: addr.label,
        coordinates: {
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
      };
    }
  
    return {
      ...currentDetails,
      number: newNumber,
    };
  }
};