import React from 'react';

interface OwnerSectionProps {
  ownerData: {
    owner_type?: 'Particular' | 'Agencia';
    owner_opinion?: string;
  } | null;
}

const OwnerSection: React.FC<OwnerSectionProps> = ({ ownerData }) => {
  if (!ownerData) {
    return <p className="text-gray-500">Información no disponible</p>;
  }

  return (
    <div className="grid gap-4">
      {ownerData.owner_type && (
        <div>
          <p className="text-sm font-medium text-gray-500">Tipo de propietario</p>
          <p className="text-lg font-medium">{ownerData.owner_type}</p>
        </div>
      )}

      {ownerData.owner_opinion && (
        <div>
          <p className="text-sm font-medium text-gray-500">Opinión sobre el propietario</p>
          <p className="text-base">{ownerData.owner_opinion}</p>
        </div>
      )}
    </div>
  );
};

export default OwnerSection;
