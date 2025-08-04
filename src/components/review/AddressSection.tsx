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
  // Función para formatear la dirección completa
  const formatAddress = () => {
    if (!addressData?.address_details) return 'Dirección no disponible';
    
    const { street, number, floor, door, city, postalCode } = addressData.address_details;
    let address = '';
    
    if (street) address += street;
    if (number) address += ` ${number}`;
    if (floor || door) {
      address += ', ';
      if (floor) address += `${floor}º`;
      if (door) address += ` ${door}`;
    }
    if (city || postalCode) {
      address += ' - ';
      if (postalCode) address += `${postalCode} `;
      if (city) address += city;
    }
    
    return address || 'Dirección no disponible';
  };

  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-500">Dirección completa</p>
        <p className="text-lg font-medium">{formatAddress()}</p>
      </div>
      
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
    </>
  );
};

export default AddressSection;
