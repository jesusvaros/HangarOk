import React from 'react';

interface CommunitySectionProps {
  communityData: {
    neighbor_types?: string[];
    tourist_apartments?: 'Sí, tolerable' | 'Sí, molestos' | 'No hay';
    building_cleanliness?: 'Muy limpio' | 'Buena' | 'Poca' | 'Sin limpieza';
    community_environment?: string[];
    community_security?: 'Muy segura' | 'Sin problemas' | 'Mejorable' | 'Poco segura';
    community_opinion?: string;
  } | null;
}

const valueMap: Record<string, string> = {
  'Sí, tolerable': 'Yes, tolerable',
  'Sí, molestos': 'Yes, disruptive',
  'No hay': 'None',
  'Muy limpio': 'Very clean',
  'Buena': 'Good',
  'Poca': 'Limited',
  'Sin limpieza': 'No cleaning',
  'Muy segura': 'Very safe',
  'Sin problemas': 'No issues',
  'Mejorable': 'Could improve',
  'Poco segura': 'Not very safe',
};

const translateValue = (value?: string) => (value ? valueMap[value] ?? value : value);

const CommunitySection: React.FC<CommunitySectionProps> = ({ communityData }) => {
  if (!communityData) {
    return <p className="text-gray-500">Information not available</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 text-[16px]">
      {communityData.neighbor_types && communityData.neighbor_types.length > 0 && (
        <div className="md:col-span-2">
          <p className="mb-2 text-[16px] font-medium text-gray-500">Neighbour types</p>
          <div className="flex flex-wrap gap-2">
            {communityData.neighbor_types.map((type, index) => (
              <span
                key={index}
                className="rounded-full bg-green-100 px-3 py-1 text-[16px] text-green-800"
              >
                {translateValue(type) ?? type}
              </span>
            ))}
          </div>
        </div>
      )}

      {communityData.tourist_apartments && (
        <div>
          <p className="text-[16px] font-medium text-gray-500">Tourist apartments</p>
          <p className="text-[18px] font-medium">
            {translateValue(communityData.tourist_apartments)}
          </p>
        </div>
      )}

      {communityData.building_cleanliness && (
        <div>
          <p className="text-[16px] font-medium text-gray-500">Building cleanliness</p>
          <p className="text-[18px] font-medium">
            {translateValue(communityData.building_cleanliness)}
          </p>
        </div>
      )}

      {communityData.community_security && (
        <div>
          <p className="text-[16px] font-medium text-gray-500">Security</p>
          <p className="text-[18px] font-medium">
            {translateValue(communityData.community_security)}
          </p>
        </div>
      )}

      {communityData.community_environment && communityData.community_environment.length > 0 && (
        <div className="md:col-span-2">
          <p className="mb-2 text-[16px] font-medium text-gray-500">Environment</p>
          <div className="flex flex-wrap gap-2">
            {communityData.community_environment.map((env, index) => (
              <span
                key={index}
                className="rounded-full bg-green-100 px-3 py-1 text-[16px] text-green-800"
              >
                {translateValue(env) ?? env}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitySection;
