import React from 'react';
import LocationMap from '../ui/LocationMap';

interface AddressSectionProps {
  addressData: {
    address_details: {
      street?: string;
      number?: string;
      floor?: string;
      door?: string;
      city?: string;
      postalCode?: string;
      coordinates?: { lat: number; lng: number };
    };
  } | null;
}

const AddressSection: React.FC<AddressSectionProps> = ({ addressData }) => {
  return (
    <div className="text-[16px]">
      {/* Mapa con la ubicación */}
      {addressData?.address_details?.coordinates ? (
        <div className="h-64 md:h-80 lg:h-96">
          <LocationMap
            coordinates={addressData.address_details.coordinates}
            className="h-full w-full"
          />
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100 md:h-80 lg:h-96">
          <p className="text-gray-500">Ubicación no disponible</p>
        </div>
      )}
    </div>
  );
};

export default AddressSection;
