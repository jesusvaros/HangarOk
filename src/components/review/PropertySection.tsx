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

const propertyValueMap: Record<string, string> = {
  'Bien aislado': 'Well insulated',
  'Correcto': 'Adequate',
  'Caluroso': 'Too hot',
  'Frío': 'Cold',
  'Silencioso': 'Quiet',
  'Tolerable': 'Tolerable',
  'Bastante': 'Quite noisy',
  'Se oye todo': 'Very noisy',
  'Nada de luz': 'No natural light',
  'Poca luz': 'Low natural light',
  'Luminoso': 'Bright',
  'Muy luminoso': 'Very bright',
  'Como nuevo': 'Like new',
  'Bueno': 'Good',
  'Aceptable': 'Acceptable',
  'Poco': 'Needs attention',
  'Malo': 'Poor',
};

const translatePropertyValue = (value: string) => propertyValueMap[value] ?? value;

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
    <div className="grid gap-12 md:grid-cols-2 text-[16px]">
      {/* Summer temperature */}
      <div className="flex justify-between gap-3 ml-2 mr-2">
        <Thermometer
          level={getSummerTemp().percent}
          icon={getSummerTemp().icon}
          primaryColor={getSummerTemp().color}
          label={translatePropertyValue(propertyData.summer_temperature)}
          title="Summer insulation"
        />

        {/* Winter temperature */}
        <Thermometer
          level={getWinterTemp().percent}
          icon={getWinterTemp().icon}
          primaryColor={getWinterTemp().color}
          label={translatePropertyValue(propertyData.winter_temperature)}
          left={true}
          title="Winter insulation"
        />
      </div>

      {/* Noise level */}
      <div className="md:col-span-1 ">
        <div className="pb-2">
          <p className="text-gray-500 flex items-center gap-2 ">
            Noise level <SpeakerXMarkIcon width={24} height={24} />
          </p>
          <p className="text-lg font-medium">{translatePropertyValue(propertyData.noise_level)}</p>
        </div>

        {/* Light level */}
        <div className="pb-2">
          <p className="text-gray-500 flex items-center gap-2">
            Natural light <SunIcon width={24} height={24} />
          </p>
          <p className="text-lg font-medium">{translatePropertyValue(propertyData.light_level)}</p>
        </div>

        {/* Maintenance */}
        <div className="pb-2">
          <p className="text-gray-500 flex items-center gap-2">
            Maintenance state <SparklesIcon width={24} height={24} />
          </p>
          <p className="text-lg font-medium">{translatePropertyValue(propertyData.maintenance_status)}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertySection;
