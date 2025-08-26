import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabaseWrapper } from '../../services/supabase/client';
import { useAuth } from '../../store/auth/hooks';
import { getAddressStep1Data } from '../../services/supabase/GetSubmitStep1';
import { getSessionStep2Data } from '../../services/supabase/GetSubmitStep2';
import { getSessionStep3Data } from '../../services/supabase/GetSubmitStep3';
import { getSessionStep4Data } from '../../services/supabase/GetSubmitStep4';
import { getSessionStep5Data } from '../../services/supabase/GetSubmitStep5';

// Importar componentes de sección
import LocationMap from '../ui/LocationMap';
import PeriodSection from './PeriodSection';
import PropertySection from './PropertySection';
import CommunitySection from './CommunitySection';
import OpinionSection from './OpinionSection';

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
  would_recommend?: '1'|'2'|'3'|'4'|'5';
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserReview, setIsUserReview] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  
  // Use the auth context
  const { user } = useAuth();

  // Estados para cada paso
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [step3Data, setStep3Data] = useState<Step3Data | null>(null);
  const [step4Data, setStep4Data] = useState<Step4Data | null>(null);
  const [step5Data, setStep5Data] = useState<Step5Data | null>(null);

  // Función para formatear la dirección como título
  const getAddressTitle = () => {
    if (!step1Data?.address_details) return 'Review de la propiedad';

    const { street, number, city } = step1Data.address_details;
    let title = '';

    if (street) title += street;
    if (number) title += ` ${number}`;
    if (city) title += `, ${city}`;

    return title || 'Review de la propiedad';
  };

  useEffect(() => {
    // Skip if no ID provided
    if (!id) return;
    const fetchAllData = async () => {
      if (!id) {
        setError('ID de sesión no proporcionado');
        setLoading(false);
        return;
      }

      try {
        const client = supabaseWrapper.getClient();
        if (!client) {
          setError('Error de configuración de Supabase');
          setLoading(false);
          return;
        }

        // Use user from auth context instead of fetching again
        const currentUserId = user?.id;

        // Check if this review belongs to the current user and its validation status
        const { data: reviewSession, error: reviewError } = await client
          .from('review_sessions')
          .select('*')
          .eq('id', id)
          .single();

        if (reviewError) {
          console.error('Error fetching review session:', reviewError);
          setError('Error al cargar la información de la revisión');
          setLoading(false);
          navigate('/map');
          return;
        }

        // Set validation status
        setIsValidated(reviewSession.validated === true);
        
        // Check if this is the user's own review
        const isOwnReview = currentUserId && reviewSession.user_id === currentUserId;
        setIsUserReview(isOwnReview || false);

        // If not user's review and not validated, redirect to map
        if (!isOwnReview && !reviewSession.validated) {
          navigate('/map');
          return;
        }
        
        // Check if all steps are completed for user's own review
        if (isOwnReview) {
          // Get the current session status to check steps completion
          const { data: sessionData, error: sessionError } = await client.rpc('get_review_session', {
            p_session_id: id,
          });
          
          if (sessionError) {
            console.error('Error checking review completion:', sessionError);
          } else if (sessionData && sessionData.length > 0) {
            const sessionStatus = sessionData[0];
            
            // Check which steps are completed
            const { step1_completed, step2_completed, step3_completed, step4_completed, step5_completed } = sessionStatus;
            
            // If not all steps are completed, redirect to the form at the last incomplete step
            if (!(step1_completed && step2_completed && step3_completed && step4_completed && step5_completed)) {
              // Determine which step to continue from
              if (!step1_completed) {
                navigate(`/add-review?step=1`);
                return;
              } else if (!step2_completed) {
                navigate(`/add-review?step=2`);
                return;
              } else if (!step3_completed) {
                navigate(`/add-review?step=3`);
                return;
              } else if (!step4_completed) {
                navigate(`/add-review?step=4`);
                return;
              } else if (!step5_completed) {
                navigate(`/add-review?step=5`);
                return;
              }
            }
          }
        }

        // Cargar datos de todos los pasos en paralelo
        const [step1, step2, step3, step4, step5] = await Promise.all([
          getAddressStep1Data(id),
          getSessionStep2Data(id),
          getSessionStep3Data(id),
          getSessionStep4Data(id),
          getSessionStep5Data(id),
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
  }, [id, navigate, user?.id]);

  // Componente para la vista móvil
  const MobileView = () => (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Período y precio</h2>
        
        {/* Contenido de período */}
        <PeriodSection periodData={step2Data} />
        
        {/* Mapa con la ubicación */}
        <div className="mt-6">
          <p className="mb-2 text-[16px] font-medium text-gray-500">Ubicación</p>
          {step1Data?.address_details?.coordinates ? (
            <div className="h-48">
              <LocationMap
                coordinates={step1Data.address_details.coordinates}
                className="h-full w-full rounded-lg"
              />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100">
              <p className="text-gray-500">Ubicación no disponible</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Opinión</h2>
        <OpinionSection 
          propertyOpinion={step3Data?.property_opinion}
          communityOpinion={step4Data?.community_opinion}
          ownerOpinion={step5Data?.owner_opinion}
          wouldRecommend={step2Data?.would_recommend}
        />
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Características del piso</h2>
        <PropertySection propertyData={step3Data} />
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-[20px] font-bold">Comunidad y vecindario</h2>
        <CommunitySection communityData={step4Data} />
      </div>
    </div>
  );

  // Componente para la vista de escritorio
  const DesktopView = () => (
    <div className="flex flex-row gap-6">
      {/* Columna izquierda con Período y precio + mapa (sticky) */}
      <div className="w-1/3">
        <div className="sticky top-24">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-[20px] font-bold">Período y precio</h2>
            
            {/* Contenido de período */}
            <PeriodSection periodData={step2Data} />
            
            {/* Mapa */}
            <div className="mt-6">
              <p className="mb-2 text-[16px] font-medium text-gray-500">Ubicación</p>
              {step1Data?.address_details?.coordinates ? (
                <div className="h-[calc(30vh)]">
                  <LocationMap
                    coordinates={step1Data.address_details.coordinates}
                    className="h-full w-full rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex h-[calc(30vh)] items-center justify-center rounded-lg bg-gray-100">
                  <p className="text-gray-500">Ubicación no disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Columna derecha con el resto de secciones */}
      <div className="w-2/3 space-y-6">
        <div className="rounded-lg bg-white p-8 shadow">
          <h2 className="mb-4 text-[20px] font-bold">Opinión</h2>
          <OpinionSection 
            propertyOpinion={step3Data?.property_opinion}
            communityOpinion={step4Data?.community_opinion}
            ownerOpinion={step5Data?.owner_opinion}
            wouldRecommend={step2Data?.would_recommend}
          />
        </div>
        
        <div className="rounded-lg bg-white p-8 shadow">
          <h2 className="mb-4 text-[20px] font-bold">Características del piso</h2>
          <PropertySection propertyData={step3Data} />
        </div>

        <div className="rounded-lg bg-white p-8 shadow">
          <h2 className="mb-4 text-[20px] font-bold">Comunidad y vecindario</h2>
          <CommunitySection communityData={step4Data} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-16 text-[16px] bg-gray-100">
      {/* Título principal con la dirección */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-center text-2xl font-bold md:text-3xl lg:text-4xl mt-8">
          {getAddressTitle()}
        </h1>
        
        {/* Validation status indicator for user's own reviews */}
        {isUserReview && (
          <div className="flex items-center mt-2">
            <div className={`h-3 w-3 rounded-full mr-2 ${isValidated ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isValidated ? 'Validado' : 'Pendiente de validación'}
            </span>
          </div>
        )}
      </div>

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
