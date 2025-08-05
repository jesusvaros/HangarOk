import React from 'react';
import Thermometer from './Thermometer';
import SparklesIcon from '@heroicons/react/24/solid/SparklesIcon';
import SunIcon from '@heroicons/react/24/solid/SunIcon';
import FireIcon from '@heroicons/react/24/solid/FireIcon';
import CloudIcon from '@heroicons/react/24/solid/CloudIcon';
import AdjustmentsHorizontalIcon from '@heroicons/react/24/solid/AdjustmentsHorizontalIcon';
import SpeakerXMarkIcon from '@heroicons/react/24/solid/SpeakerXMarkIcon';

// Interfaces
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
    return null;
  }

  const getSummerTemp = () => {
    switch (propertyData.summer_temperature) {
      case 'Caluroso':
        return {
          percent: 100,
          icon: <FireIcon width={24} height={24} className="text-red-600" />,
          color: '#DC2626',
        };
      case 'Correcto':
        return {
          percent: 55,
          icon: <SunIcon width={24} height={24} className="text-yellow-500" />,
          color: '#F59E0B',
        };
      case 'Bien aislado':
        return {
          percent: 25,
          icon: <SparklesIcon width={24} height={24} className="text-blue-400" />,
          color: '#60A5FA',
        };
    }
  };

  const getWinterTemp = () => {
    switch (propertyData.winter_temperature) {
      case 'Frío':
        return {
          percent: 25,
          icon: <CloudIcon width={24} height={24} className="text-blue-600" />,
          color: '#2563EB', // blue-600
        };
      case 'Correcto':
        return {
          percent: 55,
          icon: <AdjustmentsHorizontalIcon width={24} height={24} className="text-sky-400" />,
          color: '#38BDF8', // sky-400
        };
      case 'Bien aislado':
        return {
          percent: 100,
          icon: <FireIcon width={24} height={24} className="text-orange-500" />,
          color: '#F97316', // orange-500
        };
    }
  };

  return (
    <div className="grid gap-12 md:grid-cols-2 text-sm">
      {/* Temperatura Verano */}
      <div className="flex justify-between gap-3">
        <Thermometer
          level={getSummerTemp().percent}
          icon={getSummerTemp().icon}
          primaryColor={getSummerTemp().color}
          label={propertyData.summer_temperature}
          title="Aislamiento en verano"
        />

        {/* Temperatura Invierno */}
        <Thermometer
          level={getWinterTemp().percent}
          icon={getWinterTemp().icon}
          primaryColor={getWinterTemp().color}
          label={propertyData.winter_temperature}
          left={true}
          title="Aislamiento en invierno"
        />
      </div>

      {/* Nivel de ruido */}
      <div className="md:col-span-1">
        <div className="pb-2">
          <p className="text-gray-500 flex items-center gap-2 ">
            Nivel de ruido <SpeakerXMarkIcon width={24} height={24} />
          </p>
          <p className="text-lg font-medium">{propertyData.noise_level}</p>
        </div>

        {/* Nivel de luz */}
        <div className="pb-2">
          <p className="text-gray-500 flex items-center gap-2">
            Nivel de luz <SunIcon width={24} height={24} />
          </p>
          <p className="text-lg font-medium">{propertyData.light_level}</p>
        </div>

        {/* Mantenimiento */}
        <div className="pb-2">
          <p className="text-gray-500 flex items-center gap-2">
            Estado de mantenimiento <SparklesIcon width={24} height={24} />
          </p>
          <p className="text-lg font-medium">{propertyData.maintenance_status}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertySection;
