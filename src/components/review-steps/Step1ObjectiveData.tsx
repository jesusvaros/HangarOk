import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import CustomInput from '../ui/CustomInput';
import MessageBox from '../ui/MessageBox';
import AddressAutocomplete from '../ui/AddressAutocomplete';

// Define extended address details type
interface AddressDetails {
  street?: string;
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
  
  // Cast addressDetails to our extended type
  const addressDetails = formData.addressDetails as AddressDetails || {};
  
  const handleAddressChange = (field: string, value: string) => {
    updateFormData({
      addressDetails: {
        ...addressDetails,
        [field]: value
      }
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
        lng: geometry.lng
      }
    };
    
    updateFormData({
      addressDetails: newAddressDetails
    });
  };
  
  return (
    <div>
      {/* Message box about anonymous opinions */}
      <div className="relative">
        <MessageBox 
          title="Opinión Anónima"
          message="Tu opinión es anónima. La información que compartas no se mostrará de forma exacta."
          height="20px"
        />
      </div>

      {/* Sección: Dirección */}
      <div className="">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4">
          <h3 className="text-xl font-medium mb-4 md:mb-0 text-black">Dirección</h3>
        </div>
        
        <AddressAutocomplete
          id="street"
          label="Dirección"
          initialValue={addressDetails.street || ''}
          initialStreetNumber={addressDetails.components?.house_number || ''}
          onSelect={handleAddressSelect}
          placeholder="Ej: Calle Mayor"
          required
          showNumberField={true}
          validateNumber={true}
        />
        
        <div className="flex -mx-2 mt-4">
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
      
      <div className="flex justify-end mt-4">
        <button 
          type="button" 
          onClick={onNext}
          className="bg-[rgb(74,94,50)] text-white py-2 px-6 rounded hover:bg-[rgb(60,76,40)]"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Step1ObjectiveData;
