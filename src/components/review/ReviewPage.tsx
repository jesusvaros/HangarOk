import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabaseWrapper } from '../../services/supabase/client';
import { useAuth } from '../../store/auth/hooks';
// TODO: This file is for old rental apartment reviews, needs to be updated for hangars
import { getAddressStep1Data } from '../../services/supabase/GetSubmitStep1';
// import { getSessionStep2Data } from '../../services/supabase/GetSubmitStep2';
// import { getSessionStep3Data } from '../../services/supabase/GetSubmitStep3';
// import { getSessionStep4Data } from '../../services/supabase/GetSubmitStep4';
// import { getSessionStep5Data } from '../../services/supabase/GetSubmitStep5';

// Importar componentes de sección
import LocationMap from '../ui/LocationMap';
import PeriodSection from './PeriodSection';
import PropertySection from './PropertySection';
import CommunitySection from './CommunitySection';
import OpinionSection from './OpinionSection';

// Hangar Review Interfaces
interface Step1Data {
  address_details: {
    street?: string;
    number?: string;
    city?: string;
    postalCode?: string;
    coordinates?: { lat: number; lng: number };
  };
  uses_hangar?: boolean;
  home_address_details?: {
    street?: string;
    city?: string;
    coordinates?: { lat: number; lng: number };
  };
  home_type?: string;
  connection_type?: string;
}

interface Step2Data {
  belongs_rating?: number;
  fair_use_rating?: number;
  appearance_rating?: number;
  perception_tags?: string[];
  community_feedback?: string;
}

interface Step3Data {
  daytime_safety_rating?: number;
  nighttime_safety_rating?: number;
  bike_messed_with?: boolean;
  current_bike_storage?: string;
  theft_worry_rating?: number;
  safety_tags?: string[];
}

interface Step4Data {
  lock_ease_rating?: number;
  space_rating?: number;
  lighting_rating?: number;
  maintenance_rating?: number;
  usability_tags?: string[];
  improvement_suggestion?: string;
  stops_cycling?: string;
  impact_tags?: string[];
}

interface Step5Data {
  report_ease_rating?: number;
  fix_speed_rating?: number;
  communication_rating?: number;
  maintenance_tags?: string[];
  waitlist_fairness_rating?: number;
  waitlist_tags?: string[];
  improvement_feedback?: string;
}

const ReviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserReview, setIsUserReview] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isPublicReview, setIsPublicReview] = useState(false);
  
  // Use the auth context
  const { user, isLoading } = useAuth();

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
      if (!id || isLoading) return;
  
      const fetchAllData = async () => {
        try {
          const client = supabaseWrapper.getClient();
          if (!client) {
            setError('Error de configuración de Supabase');
            return;
          }

          const { data: publicReview, error: publicError } = await client
            .from('public_reviews')
            .select('*')
            .eq('id', id)
            .maybeSingle();

            if (publicError) {
              console.error('Error fetching public review:', publicError);
            }
            if (publicReview) {
              // Public review found. Populate UI from public data and skip session checks.
              setIsUserReview(false);
              setIsValidated(!!publicReview.validated || !!publicReview.is_public);
              setIsPublicReview(true);

              // Step 1: Location & Usage
              setStep1Data({
                address_details: publicReview.address_details,
                uses_hangar: publicReview.uses_hangar,
                home_address_details: publicReview.home_address_details,
                home_type: publicReview.home_type,
                connection_type: publicReview.connection_type,
              });

              // Step 2: Community Perception
              setStep2Data({
                belongs_rating: publicReview.belongs_rating,
                fair_use_rating: publicReview.fair_use_rating,
                appearance_rating: publicReview.appearance_rating,
                perception_tags: publicReview.perception_tags ?? [],
                community_feedback: publicReview.community_feedback,
              });

              // Step 3: Safety & Security
              setStep3Data({
                daytime_safety_rating: publicReview.daytime_safety_rating,
                nighttime_safety_rating: publicReview.nighttime_safety_rating,
                bike_messed_with: publicReview.bike_messed_with,
                current_bike_storage: publicReview.current_bike_storage,
                theft_worry_rating: publicReview.theft_worry_rating,
                safety_tags: publicReview.safety_tags ?? [],
              });

              // Step 4: Usability & Impact
              setStep4Data({
                lock_ease_rating: publicReview.lock_ease_rating,
                space_rating: publicReview.space_rating,
                lighting_rating: publicReview.lighting_rating,
                maintenance_rating: publicReview.maintenance_rating,
                usability_tags: publicReview.usability_tags ?? [],
                improvement_suggestion: publicReview.improvement_suggestion,
                stops_cycling: publicReview.stops_cycling,
                impact_tags: publicReview.impact_tags ?? [],
              });

              // Step 5: Maintenance & Support
              setStep5Data({
                report_ease_rating: publicReview.report_ease_rating,
                fix_speed_rating: publicReview.fix_speed_rating,
                communication_rating: publicReview.communication_rating,
                maintenance_tags: publicReview.maintenance_tags ?? [],
                waitlist_fairness_rating: publicReview.waitlist_fairness_rating,
                waitlist_tags: publicReview.waitlist_tags ?? [],
                improvement_feedback: publicReview.improvement_feedback,
              });

              setLoading(false);
              return;
            }

  
          const { data: reviewSession, error: reviewError } = await client
            .from('review_sessions')
            .select('user_id, validated, step1_completed, step2_completed, step3_completed, step4_completed, step5_completed')
            .eq('id', id)
            .maybeSingle();
  
          if (reviewError || !reviewSession) {
            console.error('Error fetching review session:', reviewError);
            //navigate('/map');
            return;
          }
  
          const isOwnReview = !!user?.id && reviewSession.user_id === user?.id;
          setIsUserReview(isOwnReview);
          setIsValidated(reviewSession.validated);
  
          if (!reviewSession.validated && !isOwnReview) {
            navigate('/map');
            return;
          }
  
          if (isOwnReview) {
            const {
              step1_completed,
              step2_completed,
              step3_completed,
              step4_completed,
              step5_completed,
            } = reviewSession;
  
            if (!(step1_completed && step2_completed && step3_completed && step4_completed && step5_completed)) {
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
  
          // TODO: Update this to use hangar review functions
          const step1 = await getAddressStep1Data(id);
          // const [step1, step2, step3, step4, step5] = await Promise.all([
          //   getAddressStep1Data(id),
          //   getSessionStep2Data(id),
          //   getSessionStep3Data(id),
          //   getSessionStep4Data(id),
          //   getSessionStep5Data(id),
          // ]);
  
          setStep1Data(step1);
          // setStep2Data(step2);
          // setStep3Data(step3);
          // setStep4Data(step4);
          // setStep5Data(step5);
        } catch (err) {
          console.error('Error al cargar los datos:', err);
          setError('Error al cargar los datos de la revisión');
        } finally {
          setLoading(false);
        }
      };
  
      fetchAllData();
    }, [id, navigate, user?.id,isLoading]);
  
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
                wouldRecommend={step2Data?.would_recommend}
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
                    wouldRecommend={step2Data?.would_recommend}
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
    <div className="container mx-auto px-4 py-8 mt-16 text-[16px] bg-gray-100 relative">
      {isPublicReview && (
        <button
          type="button"
          aria-label="Volver al mapa"
          onClick={() => navigate('/map')}
          className="absolute left-4 top-4 mt-2 inline-flex items-center gap-4 focus:outline-none hover:underline"
          style={{ color: 'rgb(74,94,50)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgb(74,94,50)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="text-xl font-medium">Mapa</span>
        </button>
      )}
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
