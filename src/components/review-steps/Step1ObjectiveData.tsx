import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useFormContext } from '../../store/useFormContext';
import AddressAutocomplete from '../ui/AddressAutocomplete';
import type { AddressResult } from '../ui/AddressAutocomplete';
import CustomInput from '../ui/CustomInput';
import LocationMap from '../ui/LocationMap';
import { validateAndSubmitStep1 } from './validation/Step1ValidationAndSubmit';

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
  getValidationContext: () => {
    addressDetails: AddressDetails;
    addressResult: AddressResult | undefined;
    setValidationError: (error: string | null) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
  };
  validateAndSubmit: () => Promise<void>;
}

const Step1ObjectiveData = forwardRef<Step1Ref, Step1Props>(({ onNext }, ref) => {
  const { formData, updateFormData } = useFormContext();
  // Usar useState para addressDetails para mantener la referencia estable
  const [addressDetails, setAddressDetails] = useState(formData.addressDetails || {});
  const [addressResult, setAddressResult] = useState<AddressResult | undefined>(formData.addressAutocompleteResult);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Validation state - utilizados por validateAndSubmitStep1
  const [, setValidationError] = useState<string | null>(null);
  const [streetError, setStreetError] = useState(false);
  const [numberError, setNumberError] = useState(false);

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

  const handleAddressSelect = useCallback((result: AddressResult) => {
    // Extract address components
    const { components, geometry } = result;

    // Create a new address details object with all the properties
    const newAddressDetails: AddressDetails = {
      ...addressDetails,
      // Guardamos la calle con el formato "Calle, Código Postal Ciudad"
      street: `${components.road || ''}, ${components.postcode || ''} ${components.city || components.town || components.village || ''}`,
      number: components.house_number || '',
      city: components.city || components.town || components.village || '',
      postalCode: components.postcode || '',
      state: components.state || '',
      fullAddress: result.formatted,
      // Guardamos los componentes originales para acceder al número de calle por separado
      components: components,
      coordinates: {
        lat: geometry.lat,
        lng: geometry.lng,
      },
    };

    // Update local state
    setAddressDetails(newAddressDetails);
    setAddressResult(result);

    // Update form context
    updateFormData({
      addressDetails: newAddressDetails,
      addressAutocompleteResult: result,
    });
  }, [addressDetails, updateFormData]);

  // Function to handle location selection from the map
  const handleLocationSelect = useCallback(async (lat: number, lng: number) => {
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

  // Function to validate address details and submit data
  const validateAndSubmit = async () => {
    await validateAndSubmitStep1({
      addressDetails: addressDetails, // Corregido: usar addressDetails en lugar de formData.addressDetails
      addressResult: addressResult,
      setValidationError,
      setIsSubmitting,
      onNext,
      setStreetError,
      setNumberError
    });
  };

  // Exponer métodos al componente padre mediante ref
  useImperativeHandle(ref, () => ({
    getValidationContext: () => ({
      addressDetails,
      addressResult,
      setValidationError,
      setIsSubmitting,
      setStreetError,
      setNumberError,
    }),
    validateAndSubmit,
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
          placeholder="Buscar dirección..."
          required={true}
          onSelect={handleAddressSelect}
          showNumberField={true}
          hasError={streetError}
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
          onClick={validateAndSubmit}
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
