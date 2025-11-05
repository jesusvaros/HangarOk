import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabaseWrapper } from '../../services/supabase/client';
import { useAuth } from '../../store/auth/hooks';
// TODO: This file is for old rental apartment reviews, needs to be updated for hangars
import { getAddressStep1Data } from '../../services/supabase/GetSubmitStep1';
import type { AddressStepData } from '../../services/supabase/GetSubmitStep1';
import type { Step2Data, Step3Data, Step4Data, Step5Data } from './reviewStepTypes';
import ReviewDataView from './ReviewDataView';
// import { getSessionStep2Data } from '../../services/supabase/GetSubmitStep2';
// import { getSessionStep3Data } from '../../services/supabase/GetSubmitStep3';
// import { getSessionStep4Data } from '../../services/supabase/GetSubmitStep4';
// import { getSessionStep5Data } from '../../services/supabase/GetSubmitStep5';

// Old rental review components - removed for hangar reviews
// import LocationMap from '../ui/LocationMap';
// import PeriodSection from './PeriodSection';
// import PropertySection from './PropertySection';
// import CommunitySection from './CommunitySection';
// import OpinionSection from './OpinionSection';

const ReviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserReview, setIsUserReview] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isPublicReview, setIsPublicReview] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  
  // Use the auth context
  const { user, isLoading } = useAuth();
  
  // Check if user just completed the review
  useEffect(() => {
    const completed = searchParams.get('completed');
    if (completed === 'true') {
      setShowSuccessBanner(true);
      // Remove the query param from URL
      window.history.replaceState({}, '', `/review/${id}`);
    }
  }, [searchParams, id]);

    // Estados para cada paso
    const [step1Data, setStep1Data] = useState<AddressStepData | null>(null);
    const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
    const [step3Data, setStep3Data] = useState<Step3Data | null>(null);
    const [step4Data, setStep4Data] = useState<Step4Data | null>(null);
    const [step5Data, setStep5Data] = useState<Step5Data | null>(null);
  
    // Helper to format the address as a title
    const getAddressTitle = () => {
      if (!step1Data?.hangar_location) return 'Hangar review';
  
      const { street, number, city } = step1Data.hangar_location;
      let title = '';
  
      if (street) title += street;
      if (number) title += ` ${number}`;
      if (city) title += `, ${city}`;
  
      return title || 'Hangar review';
    };
  
    useEffect(() => {
      if (!id || isLoading) return;
  
      const fetchAllData = async () => {
        try {
          const client = supabaseWrapper.getClient();
          if (!client) {
            setError('Supabase configuration error');
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
                hangar_location: publicReview.address_details,
                hangar_number: publicReview.hangar_number ?? null,
                uses_hangar: publicReview.uses_hangar,
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
          console.error('Error loading data:', err);
          setError('Error loading review data');
        } finally {
          setLoading(false);
        }
      };
  
      fetchAllData();
    }, [id, navigate, user?.id,isLoading]);

  return (
    <div className="container mx-auto px-4 py-8 mt-16 text-[16px] bg-gray-100 relative">
      {isPublicReview && (
        <button
          type="button"
          aria-label="Return to map"
          onClick={() => navigate('/map')}
          className="absolute left-4 top-4 mt-2 inline-flex items-center gap-4 focus:outline-none hover:underline"
          style={{ color: 'rgb(74,94,50)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgb(74,94,50)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="text-xl font-medium">Map</span>
        </button>
      )}
      {/* Success Banner */}
      {showSuccessBanner && isUserReview && (
        <div className="max-w-3xl mx-auto mb-8 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500 rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-4">
            {/* Success Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                You just helped cyclists across the UK make safer choices! 🚴
              </h2>
              <p className="text-lg text-gray-700 mb-4">Thank you. Seriously.</p>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    localStorage.removeItem('reviewSessionId');
                    localStorage.removeItem('reviewSessionIdBack');
                    navigate('/');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Review another hangar
                </button>
                
                <button
                  onClick={() => navigate('/map')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  See safest hangars nearby
                </button>
                
                <button
                  onClick={async () => {
                    const shareData = {
                      title: 'HangarOK | Cycle Hangar Reviews',
                      text: 'I just reviewed a cycle hangar on HangarOk! Help make cycling safer by sharing your experience too.',
                      url: window.location.origin,
                    };
                    try {
                      if (navigator.share) {
                        await navigator.share(shareData);
                      } else {
                        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                        alert('Link copied to clipboard!');
                      }
                    } catch (err) {
                      console.log('Error sharing:', err);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share with a cyclist friend
                </button>
              </div>
              
              {/* Close button */}
              <button
                onClick={() => setShowSuccessBanner(false)}
                className="mt-4 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main title with address */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-center text-2xl font-bold md:text-3xl lg:text-4xl mt-8">
          {getAddressTitle()}
        </h1>
        
        {/* Validation status indicator for user's own reviews */}
        {isUserReview && (
          <div className="flex items-center mt-2">
            <div className={`h-3 w-3 rounded-full mr-2 ${isValidated ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isValidated ? 'Validated' : 'Pending validation'}
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
        <div className="mx-auto max-w-5xl">
          <ReviewDataView
            step1Data={step1Data}
            step2Data={step2Data}
            step3Data={step3Data}
            step4Data={step4Data}
            step5Data={step5Data}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
