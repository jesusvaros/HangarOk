import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useFormContext } from '../../store/useFormContext';
import AddressAutocomplete from '../ui/AddressAutocomplete';
import type { AddressResult } from '../ui/AddressAutocomplete';
import CustomInput from '../ui/CustomInput';
import LocationMap from '../ui/LocationMap';
import { useMapLocationHandler } from './location/mapLocationHandler';
// No longer need FormContext import

// Define extended address details type
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

interface Step1Props {
  onNext: () => void;
}

// Definir la interfaz para la referencia expuesta
export interface Step1Ref {
  // For use with AddReviewForm centralized validation
  getData: () => { 
    addressDetails: AddressDetails;
    addressResult: AddressResult | undefined;
  };
}

// Update props interface to receive error state from parent
interface Step1Props {
  onNext: () => void;
  fieldErrors?: {
    street?: boolean;
    number?: boolean;
  };
  isSubmitting?: boolean;
}

const Step1ObjectiveData = forwardRef<Step1Ref, Step1Props>(({ onNext, fieldErrors, isSubmitting = false }, ref) => {
  const { formData, updateFormData } = useFormContext();
  // Usar useState para addressDetails para mantener la referencia estable
  const [addressDetails, setAddressDetails] = useState(formData.addressDetails || {});
  const [addressResult, setAddressResult] = useState<AddressResult | undefined>(formData.addressAutocompleteResult);
  
  // Use error states passed from parent instead of managing locally
  const errors = {
    street: fieldErrors?.street || false,
    number: fieldErrors?.number || false
  };

  useEffect(() => {
    // Actualizar el estado local cuando cambia formData
    if (formData.addressDetails) {
      setAddressDetails(formData.addressDetails);
    }
  }, [formData.addressDetails]);

  // Los mensajes ahora se manejan a través de StaticFormMessagesContainer

  const handleAddressChange = (field: string, value: string) => {
    updateFormData({
      addressDetails: {
        ...addressDetails,
        [field]: value,
      },
    });
  };

  // Handle changes to the address street input
  const handleAddressStreetChange = useCallback((value: string) => {
    const newAddressDetails = {
      ...addressDetails,
      street: value
    };
    
    setAddressDetails(newAddressDetails);
    
    // Update form context
    updateFormData({
      addressDetails: newAddressDetails
    });
  }, [addressDetails, updateFormData]);
  
  // Handle changes to the address number input
  const handleAddressNumberChange = useCallback((value: string) => {
    const newAddressDetails = {
      ...addressDetails,
      number: value
    };
    
    setAddressDetails(newAddressDetails);
    
    // Update form context
    updateFormData({
      addressDetails: newAddressDetails
    });
  }, [addressDetails, updateFormData]);

  const handleAddressSelect = useCallback((result: AddressResult) => {
    // Extract address components
    const { components, geometry } = result;

    // Ensure components is defined, use empty object as fallback
    const addressComponents = components || {};

    // Format street address properly
    const street = addressComponents.road || '';
    const city = addressComponents.city || addressComponents.town || addressComponents.village || '';
    const postalCode = addressComponents.postcode || '';
    // Format as "Street Name" without the postal code and city for cleaner display
    const streetFormatted = street || '';
    
    // Create a new address details object
    const newAddressDetails: AddressDetails = {
      street: streetFormatted, // Just the street name
      number: addressComponents.house_number || '',
      city: city,
      postalCode: postalCode,
      state: addressComponents.state || '',
      fullAddress: result.formatted,
      components: addressComponents,
      coordinates: {
        lat: geometry.lat,
        lng: geometry.lng,
      },
    };
    
    // Important: Update form context FIRST
    updateFormData({
      addressDetails: newAddressDetails,
      addressAutocompleteResult: result,
    });
    
    // Then update local state to match form context
    setAddressDetails(newAddressDetails);
    setAddressResult(result);
    
    console.log('Address updated from selection:', {
      street: streetFormatted,
      number: addressComponents.house_number || ''
    });
  }, [updateFormData]); // Remove addressDetails dependency as we're not using it

  // Use the map location handler hook
  const handleLocationSelect = useMapLocationHandler(handleAddressSelect);

  // Function for centralized validation in AddReviewForm
  const getData = () => {
    return {
      addressDetails,
      addressResult,
    };
  };

  // Exponer métodos al componente padre mediante ref
  useImperativeHandle(ref, () => ({
    // Method for centralized validation
    getData,
  }));

  return (
    <div className="w-full">
      {/* Sección: Dirección */}
      <div className="">
        <div className="flex flex-col pb-4 md:flex-row md:items-center md:justify-between">
          <h3 className="mb-4 text-xl font-medium text-black md:mb-0">Dirección</h3>
        </div>

        <AddressAutocomplete
          id="address-step1"
          label="Dirección"
          initialValue={addressDetails.street || ''}
          initialStreetNumber={addressDetails.number || ''}
          value={addressDetails.street || ''}
          streetNumberValue={addressDetails.number || ''}
          selectedResult={addressResult}
          placeholder="Buscar dirección..."
          required={true}
          onSelect={handleAddressSelect}
          onChange={handleAddressStreetChange}
          onNumberChange={handleAddressNumberChange}
          showNumberField={true}
          hasError={errors.street}
          numberHasError={errors.number}
        />

        {/* Always show the map */}
        <LocationMap 
          coordinates={addressDetails.coordinates && addressDetails.coordinates.lat !== 0 ? {
            lat: addressDetails.coordinates.lat,
            lng: addressDetails.coordinates.lng
          } : undefined}
          className="mt-2"
          onLocationSelect={handleLocationSelect}
        />

        <div className="-mx-2 mt-4 flex">
          <div className="w-1/2 px-2">
            <CustomInput
              id="floor"
              type="text"
              placeholder="Piso"
              onChange={(e) => handleAddressChange('floor', e.target.value)}
              value={addressDetails.floor || ''}
              className="w-1/2"
            />
          </div>
          <div className="w-1/2 px-2">
            <CustomInput
              id="door"
              type="text"
              placeholder="Puerta"
              onChange={(e) => handleAddressChange('door', e.target.value)}
              value={addressDetails.door || ''}
              className="w-1/2"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="rounded bg-[rgb(74,94,50)] px-6 py-2 text-white hover:bg-[rgb(60,76,40)] disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
});

export default Step1ObjectiveData;
