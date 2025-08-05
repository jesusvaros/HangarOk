import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAddressStep1Data } from '../../services/supabase/GetSubmitStep1';
import { getSessionStep2Data } from '../../services/supabase/GetSubmitStep2';
import { getSessionStep3Data } from '../../services/supabase/GetSubmitStep3';
import { getSessionStep4Data } from '../../services/supabase/GetSubmitStep4';
import { getSessionStep5Data } from '../../services/supabase/GetSubmitStep5';

// Importar componentes de sección
import AddressSection from './AddressSection';
import PeriodSection from './PeriodSection';
import PropertySection from './PropertySection';
import CommunitySection from './CommunitySection';
import OwnerSection from './OwnerSection';

// Definición de tipos para los datos de cada paso
interface Step1Data {
  address_details: {
    street?: string;
    number?: string;
    floor?: string;
    door?: string;
    city?: string;
    postalCode?: string;
    coordinates?: { lat: number; lng: number };
  };
}

interface Step2Data {
  start_year: number;
  end_year: number | null;
  price: number;
  included_services: string[];
}

interface Step3Data {
  summer_temperature: 'Bien aislado' | 'Correcto' | 'Caluroso';
  winter_temperature: 'Bien aislado' | 'Correcto' | 'Frío';
  noise_level: 'Silencioso' | 'Tolerable' | 'Bastante' | 'Se oye todo';
  light_level: 'Nada de luz' | 'Poca luz' | 'Luminoso' | 'Muy luminoso';
  maintenance_status: 'Como nuevo' | 'Bueno' | 'Aceptable' | 'Poco' | 'Malo';
  property_opinion?: string;
}

interface Step4Data {
  neighbor_types?: string[];
  tourist_apartments?: 'Sí, tolerable' | 'Sí, molestos' | 'No hay';
  building_cleanliness?: 'Muy limpio' | 'Buena' | 'Poca' | 'Sin limpieza';
  community_environment?: string[];
  community_security?: 'Muy segura' | 'Sin problemas' | 'Mejorable' | 'Poco segura';
  community_opinion?: string;
}

interface Step5Data {
  owner_type?: 'Particular' | 'Agencia';
  owner_opinion?: string;
}

const ReviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para cada paso
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [step3Data, setStep3Data] = useState<Step3Data | null>(null);
  const [step4Data, setStep4Data] = useState<Step4Data | null>(null);
  const [step5Data, setStep5Data] = useState<Step5Data | null>(null);

  // Función para formatear la dirección como título
  const getAddressTitle = () => {
    if (!step1Data?.address_details) return 'Revisión de la propiedad';

    const { street, number, city } = step1Data.address_details;
    let title = '';

    if (street) title += street;
    if (number) title += ` ${number}`;
    if (city) title += `, ${city}`;

    return title || 'Revisión de la propiedad';
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) {
        setError('ID de sesión no proporcionado');
        setLoading(false);
        return;
      }

      try {
        // Cargar datos de todos los pasos en paralelo
        const [step1, step2, step3, step4, step5] = await Promise.all([
          getAddressStep1Data(),
          getSessionStep2Data(),
          getSessionStep3Data(),
          getSessionStep4Data(),
          getSessionStep5Data(),
        ]);

        // Actualizar estados con los datos obtenidos
        setStep1Data(step1);
        setStep2Data(step2);
        setStep3Data(step3);
        setStep4Data(step4);
        setStep5Data(step5);
      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setError('Error al cargar los datos de la revisión');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  // Componente para la vista móvil
  const MobileView = () => (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Dirección</h2>
        <AddressSection addressData={step1Data} />
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Período y precio</h2>
        <PeriodSection periodData={step2Data} />
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Características del piso</h2>
        <PropertySection propertyData={step3Data} />
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Comunidad y vecindario</h2>
        <CommunitySection communityData={step4Data} />
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Propietario/Agencia</h2>
        <OwnerSection ownerData={step5Data} />
      </div>
    </div>
  );

  // Componente para la vista de escritorio
  const DesktopView = () => (
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-2 rounded-lg bg-white p-8 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Dirección</h2>
        <AddressSection addressData={step1Data} />
      </div>

      <div className="rounded-lg bg-white p-8 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Período y precio</h2>
        <PeriodSection periodData={step2Data} />
      </div>

      <div className="rounded-lg bg-white p-8 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Características del piso</h2>
        <PropertySection propertyData={step3Data} />
      </div>

      <div className="rounded-lg bg-white p-8 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Comunidad y vecindario</h2>
        <CommunitySection communityData={step4Data} />
      </div>

      <div className="rounded-lg bg-white p-8 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Propietario/Agencia</h2>
        <OwnerSection ownerData={step5Data} />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-24 text-[16px]">
      {/* Título principal con la dirección */}
      <h1 className="mb-8 text-center text-2xl font-bold md:text-3xl lg:text-4xl">
        {getAddressTitle()}
      </h1>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Vista móvil (oculta en pantallas md y superiores) */}
          <div className="md:hidden">
            <MobileView />
          </div>

          {/* Vista de escritorio (oculta en pantallas pequeñas) */}
          <div className="hidden md:block">
            <DesktopView />
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewPage;
