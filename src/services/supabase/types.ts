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

export interface ReviewSessionStatus {
  id: string;
  created_at: string;
  step1_completed?: boolean;
  step2_completed?: boolean;
  step3_completed?: boolean;
  step4_completed?: boolean;
  step5_completed?: boolean;
  submission_completed?: boolean;
}

export interface AddressStep1Payload {
  address: AddressResult | null; // Allow null for manual address entry
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
