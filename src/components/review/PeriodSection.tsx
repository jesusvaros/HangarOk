import React from 'react';

interface PeriodSectionProps {
  periodData: {
    start_year: number;
    end_year: number | null;
    price: number;
    included_services: string[];
  } | null;
}

const PeriodSection: React.FC<PeriodSectionProps> = ({ periodData }) => {
  // Función para formatear el período de estancia
  const formatPeriod = () => {
    if (!periodData) return 'Período no disponible';
    
    const { start_year, end_year } = periodData;
    if (end_year === null) {
      return `Desde ${start_year} hasta la actualidad`;
    }
    return `Desde ${start_year} hasta ${end_year}`;
  };

  if (!periodData) {
    return <p className="text-gray-500">Información no disponible</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <p className="text-sm font-medium text-gray-500">Período de estancia</p>
        <p className="text-lg font-medium">{formatPeriod()}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Precio mensual</p>
        <p className="text-lg font-medium">{periodData.price}€</p>
      </div>
      <div className="md:col-span-2">
        <p className="text-sm font-medium text-gray-500">Servicios incluidos</p>
        {periodData.included_services.length > 0 ? (
          <ul className="mt-2 list-inside list-disc">
            {periodData.included_services.map((service, index) => (
              <li key={index} className="text-base">{service}</li>
            ))}
          </ul>
        ) : (
          <p className="text-base">No hay servicios incluidos</p>
        )}
      </div>
    </div>
  );
};

export default PeriodSection;
