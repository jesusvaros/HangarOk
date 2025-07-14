import type { AddressResult } from '../../components/ui/AddressAutocomplete';

// Define types for our database
export type Opinion = {
  id?: number;
  casero_hash: string;
  texto: string;
  rating: number;
  lat?: number | null;
  lng?: number | null;
  created_at?: string;
};

export interface ReviewSessionPayload {
  full_address?: string;
  lat?: number;
  lng?: number;
  city?: string;
  street?: string;
}

export interface AddressStep1Payload {
  address: AddressResult;
  addressDetails: {
    street?: string;
    number?: string;
    floor?: string;
    door?: string;
    city?: string;
    postalCode?: string;
    state?: string;
    fullAddress?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    components?: {
      road?: string;
      house_number?: string;
      city?: string;
      town?: string;
      village?: string;
      postcode?: string;
      state?: string;
      [key: string]: string | undefined;
    };
  };
}
