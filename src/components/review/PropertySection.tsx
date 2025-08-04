import React from 'react';

interface PropertySectionProps {
  propertyData: {
    summer_temperature: 'Bien aislado' | 'Correcto' | 'Caluroso';
    winter_temperature: 'Bien aislado' | 'Correcto' | 'Frío';
    noise_level: 'Silencioso' | 'Tolerable' | 'Bastante' | 'Se oye todo';
    light_level: 'Nada de luz' | 'Poca luz' | 'Luminoso' | 'Muy luminoso';
    maintenance_status: 'Como nuevo' | 'Bueno' | 'Aceptable' | 'Poco' | 'Malo';
    property_opinion?: string;
  } | null;
}

const PropertySection: React.FC<PropertySectionProps> = ({ propertyData }) => {
  if (!propertyData) {
    return <p className="text-gray-500">Información no disponible</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <p className="text-sm font-medium text-gray-500">Temperatura en verano</p>
        <p className="text-lg font-medium">{propertyData.summer_temperature}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Temperatura en invierno</p>
        <p className="text-lg font-medium">{propertyData.winter_temperature}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Nivel de ruido</p>
        <p className="text-lg font-medium">{propertyData.noise_level}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Nivel de luz</p>
        <p className="text-lg font-medium">{propertyData.light_level}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Estado de mantenimiento</p>
        <p className="text-lg font-medium">{propertyData.maintenance_status}</p>
      </div>
      {propertyData.property_opinion && (
        <div className="md:col-span-2">
          <p className="text-sm font-medium text-gray-500">Opinión sobre el piso</p>
          <p className="text-base">{propertyData.property_opinion}</p>
        </div>
      )}
    </div>
  );
};

export default PropertySection;
