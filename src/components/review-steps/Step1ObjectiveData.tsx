import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../store/useFormContext';
import CustomInput from '../ui/CustomInput';
import AddressAutocomplete from '../ui/AddressAutocomplete';

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

const Step1ObjectiveData: React.FC<Step1Props> = ({ onNext }) => {
  const { formData, updateFormData } = useFormContext();
  const [addressDetails, setAddressDetails] = useState(formData.addressDetails || {});

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

  const handleAddressSelect = (result: {
    components: {
      road?: string;
      house_number?: string;
      city?: string;
      town?: string;
      village?: string;
      postcode?: string;
      state?: string;
      [key: string]: string | undefined;
    };
    geometry: {
      lat: number;
      lng: number;
    };
    formatted: string;
  }) => {
    // Extract address components
    const { components, geometry } = result;

    // Create a new address details object with all the properties
    const newAddressDetails: AddressDetails = {
      ...addressDetails,
      // Guardamos la calle con el formato "Calle, Código Postal Ciudad"
      street: `${components.road || ''}, ${components.postcode || ''} ${components.city || components.town || components.village || ''}`,
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

    updateFormData({
      addressDetails: newAddressDetails,
    });
  };

  return (
    <div>
      {/* Sección: Dirección */}
      <div className="">
        <div className="flex flex-col pb-4 md:flex-row md:items-center md:justify-between">
          <h3 className="mb-4 text-xl font-medium text-black md:mb-0">Dirección</h3>
        </div>

        <AddressAutocomplete
          id="street"
          label="Dirección"
          initialValue={addressDetails.street || ''}
          initialStreetNumber={addressDetails.components?.house_number || ''}
          initialResult={formData.addressAutocompleteResult}
          onSelect={handleAddressSelect}
          placeholder="Ej: Calle Mayor"
          required
          showNumberField={true}
          validateNumber={true}
        />

        <div className="-mx-2 mt-4 flex">
          <div className="w-1/2 px-2">
            <CustomInput
              id="floor"
              label="Piso"
              value={formData.addressDetails?.floor || ''}
              onChange={(e) => handleAddressChange('floor', e.target.value)}
              placeholder="Piso"
            />
          </div>
          <div className="w-1/2 px-2">
            <CustomInput
              id="door"
              label="Puerta"
              value={formData.addressDetails?.door || ''}
              onChange={(e) => handleAddressChange('door', e.target.value)}
              placeholder="Puerta"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded bg-[rgb(74,94,50)] px-6 py-2 text-white hover:bg-[rgb(60,76,40)]"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Step1ObjectiveData;
