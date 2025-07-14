import { submitAddressStep1, type AddressStep1Payload } from '../../../services/supabase';
import type { AddressResult } from '../../ui/AddressAutocomplete';
import toast from 'react-hot-toast';

/**
 * Interface for address details used in Step 1
 */
interface AddressDetails {
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
}

/**
 * Step 1 validation and submission function.
 * Validates address details and submits to Supabase.
 */
export const validateAndSubmitStep1 = async ({
  addressDetails,
  addressResult,
  setValidationError,
  setIsSubmitting,
  onNext,
  setStreetError = () => {},
  setNumberError = () => {}
}: {
  addressDetails: AddressDetails;
  addressResult: AddressResult | undefined;
  setValidationError: (error: string | null) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  onNext: () => void;
  setStreetError?: (hasError: boolean) => void;
  setNumberError?: (hasError: boolean) => void;
}): Promise<void> => {
  setValidationError(null);
  setStreetError(false);
  setNumberError(false);
  
  // Validate required fields
  if (!addressDetails.street || !addressDetails.street.trim()) {
    setValidationError('La dirección es obligatoria');
    setStreetError(true);
    toast.error('La dirección es obligatoria');
    return;
  }
  
  if (!addressDetails.number && (!addressDetails.components?.house_number || addressDetails.components.house_number === '')) {
    setValidationError('El número de la dirección es obligatorio');
    setNumberError(true);
    toast.error('El número de la dirección es obligatorio');
    return;
  }
  
  if (!addressDetails.coordinates || !addressDetails.coordinates.lat || !addressDetails.coordinates.lng) {
    setValidationError('No se han podido obtener las coordenadas de la dirección');
    setStreetError(true);
    toast.error('No se han podido obtener las coordenadas de la dirección');
    return;
  }
  
  // Get the token from localStorage
  const token = localStorage.getItem('auth_token');
  if (!token) {
    setValidationError('No se ha encontrado el token de autenticación');
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    // Prepare data for submission based on the user's requirements
    const addressData: AddressStep1Payload = {
      address: addressResult!,
      addressDetails: addressDetails,
    };
    
    // Submit data using our Supabase client function
    const success = await submitAddressStep1(addressData, token);
    
    if (!success) {
      throw new Error('Error al guardar los datos en la base de datos');
    }
    
    // If successful, proceed to next step
    onNext();
  } catch (error) {
    console.error('Error submitting address data:', error);
    setValidationError(error instanceof Error ? error.message : 'Error al guardar los datos');
  } finally {
    setIsSubmitting(false);
  }
};
