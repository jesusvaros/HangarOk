import type { FormDataType } from '../../../store/formTypes';
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
      // Use server-side proxy for cost control
      const response = await fetch('/api/geocode-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'geocode',
          params: {
            q: searchText,
            in: 'countryCode:GBR',
            lang: 'en-GB',
            limit: '10'
          }
        })
      });

      const data = await response.json();

      // Handle usage limits or errors
      if (!response.ok) {
        if (data.fallback) {
          console.warn('HERE API limit reached, using fallback behavior');
          return []; // Return empty results as fallback
        }
        throw new Error(data.error || 'Geocoding request failed');
      }

      if (!data.items) {
        console.error('HERE API error or empty response', data);
        return [];
      }

      // Map HERE items to AddressResult shape expected by the component
      const processedResults: AddressResult[] = (data.items as HereGeocodeItem[]).map(item => {
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
    currentDetails: FormDataType['addressDetails'],
    newNumber: string
  ): Promise<FormDataType['addressDetails']> {
    const street = currentDetails?.street;
    const city = currentDetails?.city || '';
    if (!street || !newNumber.trim()) {
      return {
        ...currentDetails,
        number: newNumber,
      };
    }

    const fullAddressQuery = `${street} ${newNumber}, ${city}, United Kingdom`;

    // Use server-side proxy for cost control
    const response = await fetch('/api/geocode-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'geocode',
        params: {
          q: fullAddressQuery,
          in: 'countryCode:GBR',
          lang: 'en-GB',
          limit: '1'
        }
      })
    });

    const data = await response.json();

    // Handle usage limits or errors
    if (!response.ok) {
      if (data.fallback) {
        console.warn('HERE API limit reached for address coordinates');
        return {
          ...currentDetails,
          number: newNumber,
        };
      }
      throw new Error(data.error || 'Geocoding request failed');
    }

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
  },

  /**
   * Reverse geocode coordinates to a formatted address (HERE API)
   */
  async reverseGeocode(lat: number, lng: number): Promise<AddressResult | null> {
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
            lang: 'en-GB',
            limit: '1'
          }
        })
      });

      const data = await response.json();

      // Handle usage limits or errors
      if (!response.ok) {
        if (data.fallback) {
          console.warn('HERE API reverse geocode limit reached');
          return null;
        }
        throw new Error(data.error || 'Reverse geocoding request failed');
      }
      const item: HereGeocodeItem | undefined = data.items?.[0];
      if (!item) return null;
      const addr: Partial<HereGeocodeItem['address']> = item.address ?? {};
      const result: AddressResult = {
        formatted: addr.label,
        geometry: { lat: item.position.lat, lng: item.position.lng },
        components: {
          road: addr.street,
          house_number: addr.houseNumber,
          postcode: addr.postalCode,
          city: addr.city,
          state: addr.state,
          country: addr.countryName,
        },
        annotations: { geohash: '' },
      } as AddressResult;
      return result;
    } catch (e) {
      console.error('Reverse geocode failed', e);
      return null;
    }
  },
};
