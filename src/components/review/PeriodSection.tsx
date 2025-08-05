import React from 'react';

// Icono para el precio
const MoneyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

// Iconos para los servicios
const LightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const WaterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 22c4.97 0 9-3.694 9-8.25 0-4.03-5.4-11.75-9-11.75S3 9.72 3 13.75c0 4.556 4.03 8.25 9 8.25z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 16a3 3 0 100-6 3 3 0 000 6z"
    />
  </svg>
);

const CommunityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

const GasIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
    />
  </svg>
);

const GarageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v9h1.5a2.5 2.5 0 015 0H15m1-3h2l3 3v4a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1h-6v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-4l3-3z"
    />
  </svg>
);

interface PeriodSectionProps {
  periodData: {
    start_year: number;
    end_year: number | null;
    price: number;
    included_services: string[];
  } | null;
}

const PeriodSection: React.FC<PeriodSectionProps> = ({ periodData }) => {
  if (!periodData) {
    return <p className="text-gray-500">Información no disponible</p>;
  }

  // Obtener el año actual para la línea temporal
  const currentYear = new Date().getFullYear();
  const startYear = periodData.start_year;
  const endYear = periodData.end_year || currentYear;
  const isCurrentlyLiving = periodData.end_year === null;

  return (
    <div className="grid gap-6 md:grid-cols-2 text-[16px]">
      <div className="md:col-span-2">
        {/* Línea temporal */}
        <div className="mt-4  relative h-16 w-full">
          {/* Línea base */}
          <div className="absolute top-8 h-1 w-full bg-gray-200"></div>

          {/* Segmento de tiempo activo */}
          <div
            className="absolute top-8 h-1 bg-green-600 text-[16px] "
            style={{
              left: '5%',
              width: '90%',
            }}
          ></div>

          {/* Marcador de inicio */}
          <div
            className="absolute flex flex-col items-center"
            style={{ left: '5%', transform: 'translateX(-50%)' }}
          >
            <div className="h-3 w-3 rounded-full bg-green-600"></div>
            <div className="mt-2 h-4 w-[1px] bg-green-600"></div>
            <span className="mt-1 text-[18px] font-medium ">{startYear}</span>
          </div>

          {/* Marcador de fin */}
          <div
            className="absolute flex flex-col items-center"
            style={{ left: '95%', transform: 'translateX(-50%)' }}
          >
            <div
              className={`h-3 w-3 rounded-full ${isCurrentlyLiving ? 'bg-green-300' : 'bg-green-600'}`}
            ></div>
            <div
              className={`mt-2 h-4 w-[1px] ${isCurrentlyLiving ? 'bg-green-300' : 'bg-green-600'}`}
            ></div>
            <span className="mt-1 text-[18px] font-medium">
              {isCurrentlyLiving ? 'Actual' : endYear}
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1">
          <p className="text-[16px] font-medium text-gray-500">Precio mensual</p>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
            <MoneyIcon />
          </div>
        </div>
        <p className="text-[18px] font-medium">{periodData.price}€</p>
      </div>

      <div className="md:col-span-2">
        <p className="text-[16px] font-medium text-gray-500">Incluidos en el precio</p>
        <div className="mt-4 flex w-full justify-between">
          {/* Luz */}
          <div className="flex flex-col items-center">
            <div
              className={`relative flex h-8 w-8 items-center justify-center rounded-full ${periodData.included_services.includes('Luz') ? 'bg-green-100' : 'bg-gray-100'}`}
            >
              <LightIcon />
              {!periodData.included_services.includes('Luz') && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-0.5 w-10 rotate-45 bg-red-500"></div>
                </div>
              )}
            </div>
            <span className="mt-1 text-[16px]">Luz</span>
          </div>

          {/* Agua */}
          <div className="flex flex-col items-center">
            <div
              className={`relative flex h-8 w-8 items-center justify-center rounded-full ${periodData.included_services.includes('Agua') ? 'bg-green-100' : 'bg-gray-100'}`}
            >
              <WaterIcon />
              {!periodData.included_services.includes('Agua') && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-0.5 w-10 rotate-45 bg-red-500"></div>
                </div>
              )}
            </div>
            <span className="mt-1 text-[16px]">Agua</span>
          </div>

          {/* Comunidad */}
          <div className="flex flex-col items-center">
            <div
              className={`relative flex h-8 w-8 items-center justify-center rounded-full ${periodData.included_services.includes('Comunidad') ? 'bg-green-100' : 'bg-gray-100'}`}
            >
              <CommunityIcon />
              {!periodData.included_services.includes('Comunidad') && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-0.5 w-10 rotate-45 bg-red-500"></div>
                </div>
              )}
            </div>
            <span className="mt-1 text-[16px]">Comunidad</span>
          </div>

          {/* Gas */}
          <div className="flex flex-col items-center">
            <div
              className={`relative flex h-8 w-8 items-center justify-center rounded-full ${periodData.included_services.includes('Gas') ? 'bg-green-100' : 'bg-gray-100'}`}
            >
              <GasIcon />
              {!periodData.included_services.includes('Gas') && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-0.5 w-10 rotate-45 bg-red-500"></div>
                </div>
              )}
            </div>
            <span className="mt-1 text-[16px]">Gas</span>
          </div>

          {/* Garaje */}
          <div className="flex flex-col items-center">
            <div
              className={`relative flex h-8 w-8 items-center justify-center rounded-full ${periodData.included_services.includes('Garaje') ? 'bg-green-100' : 'bg-gray-100'}`}
            >
              <GarageIcon />
              {!periodData.included_services.includes('Garaje') && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-0.5 w-10 rotate-45 bg-red-500"></div>
                </div>
              )}
            </div>
            <span className="mt-1 text-[16px]">Garaje</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodSection;
