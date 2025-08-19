import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseWrapper } from '../../services/supabase/client';
import { getAddressStep1Data } from '../../services/supabase/GetSubmitStep1';
import { useAuth } from '../../store/auth/hooks';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

interface AddressStep1 {
  id: string;
  review_session_id: string;
  street?: string;
  number?: string;
  city?: string;
  postal_code?: string;
  province?: string;
  created_at: string;
}

interface UserReview {
  id: string;
  user_id: string;
  displayAddress?: string;
  created_at: string;
  updated_at?: string;
  status?: string;
  address?: AddressStep1[];
  validated?: boolean;
  completed?: boolean;
  nextIncompleteStep?: number;
  step1_completed?: boolean;
  step2_completed?: boolean;
  step3_completed?: boolean;
  step4_completed?: boolean;
  step5_completed?: boolean;
}

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  // Use the auth context
  const { user, isLoading: authLoading, logout } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return;
    
    const fetchUserData = async () => {
      setLoading(true);
      const client = supabaseWrapper.getClient();
      
      if (!client || !user) {
        navigate('/');
        return;
      }

      // Use user from auth context instead of fetching again
      setUserProfile({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at || ''
      });

      try {
        // Get review sessions and address data in a single batch
        const [sessionsResponse] = await Promise.all([
          client
            .from('review_sessions')
            .select('*')
            .eq('user_id', user.id)
        ]);

        if (sessionsResponse.error) {
          throw sessionsResponse.error;
        }

        const sessions = sessionsResponse.data || [];

        if (sessions.length === 0) {
          // No reviews found
          setUserReviews([]);
          return;
        }

        // Fetch all address data in a single batch with Promise.all
        const addressPromises = sessions.map(session => 
          getAddressStep1Data(session.id)
        );
        
        const addressResults = await Promise.all(addressPromises);

        // Combine sessions with their addresses and check completion status
        const processedReviews = sessions.map((session, index) => {
          const addressResult = addressResults[index];
          
          // Check if all steps are completed
          const allStepsCompleted = session.step1_completed && 
                                   session.step2_completed && 
                                   session.step3_completed && 
                                   session.step4_completed && 
                                   session.step5_completed;
          
          // Determine the next incomplete step (for redirection)
          let nextIncompleteStep = 1;
          if (session.step1_completed) nextIncompleteStep = 2;
          if (session.step2_completed) nextIncompleteStep = 3;
          if (session.step3_completed) nextIncompleteStep = 4;
          if (session.step4_completed) nextIncompleteStep = 5;
          
          return {
            ...session,
            displayAddress: addressResult?.address_details?.street || 'Dirección no disponible',
            validated: session.validated === true,
            completed: allStepsCompleted,
            nextIncompleteStep
          };
        });
        
        setUserReviews(processedReviews);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Error al cargar los datos del perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, user, authLoading]);

  const handleLogout = async () => {
    // Use the logout method from auth context
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 pt-16">
        <div className="w-full max-w-3xl rounded-lg bg-white p-8 shadow-md">
          <p className="text-center text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 gap-8 mx-auto max-w-3xl px-4">
        <div className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-2xl font-semibold ">Mi Perfil</h1>
          
          {/* Personal Info Section */}
          <div className="mb-8">
            <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-semibold ">
              Información Personal
            </h2>
            {userProfile && (
              <div className="text-left">
                <p className="text-xl font-semibold">{userProfile.email}</p>
              </div>
            )}
          </div>
          
          {/* My Reviews Section */}
          <div className="mb-8">
            <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-semibold ">
              Mis Reseñas
            </h2>
            {userReviews.length > 0 ? (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="rounded-lg border border-gray-200 p-4 transition-all hover:border-[#4A5E32] hover:shadow-sm"
                    onClick={() => {
                      // If review is incomplete, redirect to the form at the next incomplete step
                      if (!review.completed) {
                        navigate(`/add-review?step=${review.nextIncompleteStep}`);
                      } else {
                        // Otherwise, show the complete review
                        navigate(`/review/${review.id}`);
                      }
                    }}
                    role="button"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="font-medium mr-2">
                            {review.displayAddress}
                          </p>
                          {/* Validation status indicator */}
                          <div className={`h-2 w-2 rounded-full ${review.validated ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="rounded-full bg-[rgb(225,245,110)] p-2">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 " 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No has creado ninguna reseña todavía.</p>
            )}
          </div>
          
          {/* Logout Section */}
          <div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center rounded-lg bg-[#4A5E32] px-6 py-3 text-white transition-colors hover:bg-[#5A6E42] focus:outline-none focus:ring-2 focus:ring-[#4A5E32] focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      
    </div>
  );
};

export default ProfilePage;
