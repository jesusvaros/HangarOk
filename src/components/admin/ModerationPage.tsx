import React, { useEffect, useState } from 'react';
import { supabaseWrapper } from '../../services/supabase/client';
import { useAuth } from '../../store/auth/hooks';

interface Review {
  review_session_id: string;
  created_at: string;
  user_id: string;
  address_details: {
    fullAddress: string;
    components: {
      city: string;
      road: string;
      state: string;
      country: string;
      postcode: string;
      house_number: string;
    };
  };
  property_opinion: string;
  community_opinion: string;
  owner_opinion: string;
  // status y rejection_reason vienen de la vista/base de datos
  status?: string;
  rejection_reason?: string;
  moderation_status?: 'pending' | 'approved' | 'rejected';
}

const ModerationPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Use the auth context instead of local state
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({}); 
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [actionMessage, setActionMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // Load reviews once the authenticated user is confirmed as admin
  useEffect(() => {
    // Wait for auth state to finish loading
    if (authLoading) return;
    
    if (isAdmin) {
      fetchReviews();
    } else if (!authLoading) {
      // Show error only after auth finishes and user is not admin
      setError('You do not have permission to access this page');
      setLoading(false);
    }
  }, [isAdmin, authLoading]);

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const client = supabaseWrapper.getClient();
      if (!client) {
        setError('Supabase configuration error');
        setLoading(false);
        return;
      }

      // Retrieve reviews with additional information
      const { data, error } = await client.rpc('get_review_sessions_for_moderation');

      const { data: session, error: sessionError } = await client.rpc('get_review_session_admin', { p_id: data[0].review_session_id });

    console.log(session, sessionError);
    
      if (error) {
        console.error('Error fetching reviews:', error);
        setError('Error loading reviews');
        setLoading(false);
        return;
      }

      // Usar directamente los datos de review_sessions_with_steps
      const formattedReviews = data.map((review: {
        review_session_id: string;
        created_at: string;
        user_id: string;
        address_details: {
          fullAddress: string;
          components: {
            city: string;
            road: string;
            state: string;
            country: string;
            postcode: string;
            house_number: string;
          };
        };
        property_opinion?: string;
        community_opinion?: string;
        owner_opinion?: string;
        status?: string;
        rejection_reason?: string;
        validated?: boolean;
      }) => ({
        review_session_id: review.review_session_id,
        created_at: review.created_at,
        user_id: review.user_id,
        address_details: review.address_details,
        property_opinion: review.property_opinion || '',
        community_opinion: review.community_opinion || '',
        owner_opinion: review.owner_opinion || '',
        status: review.status,
        rejection_reason: review.rejection_reason,
        moderation_status: (review.status === 'rejected'
          ? 'rejected'
          : review.validated
            ? 'approved'
            : 'pending') as 'pending' | 'approved' | 'rejected'
      }));

      setReviews(formattedReviews);
      setLoading(false);
    } catch (err) {
      console.error('Error in fetchReviews:', err);
      setError('Error loading reviews');
      setLoading(false);
    }
  };

  // Toggle review expansion to show opinions
  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Handle updates to the rejection reason field
  const handleRejectionReasonChange = (reviewId: string, reason: string) => {
    setRejectionReasons(prev => ({
      ...prev,
      [reviewId]: reason
    }));
  };

  // Moderate a review (approve or reject)
  const handleModerateReview = async (reviewId: string, status: 'approved' | 'rejected') => {
    const review = reviews.find(r => r.review_session_id === reviewId);
    if (!review) return;
    
    // Mark this review as loading
    setActionLoading(prev => ({
      ...prev,
      [reviewId]: true
    }));
    
    setActionMessage(null);
    
    try {
      const client = supabaseWrapper.getClient();
      if (!client) throw new Error('Supabase configuration error');
      
      if (status === 'approved') {
        // Approve by validating the session via RPC
        const { error } = await client.rpc('validate_review', {
          p_session_id: reviewId
        });

        if (error) throw new Error(error.message);

        // Al validarse, desaparece del listado (query filtra validated = false)
        setReviews(prev => prev.filter(r => r.review_session_id !== reviewId));
      } else {
        // Rechazar: usar RPC reject_review con motivo
        const reason = rejectionReasons[reviewId] || '';
        if (!reason.trim()) {
          throw new Error('Please provide a reason to reject the review');
        }

        const { data: sessionRes } = await client.auth.getSession();
        const token = sessionRes?.session?.access_token;
        if (!token) throw new Error('Could not obtain the session token to authenticate the request');

        const functionsUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reject-review`;
        const resp = await fetch(functionsUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            review_session_id: reviewId,
            rejection_reason: reason,
          }),
        });

        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(txt || 'Failed to reject the review');
        }

        // Local state updates below in the shared 'rejected' block
      }
      
      // Update the review list only after rejection (approved reviews were removed earlier)
      if (status === 'rejected') {
        const reason = rejectionReasons[reviewId] || '';
        setReviews(reviews.map(r => 
          r.review_session_id === reviewId
            ? { ...r, moderation_status: 'rejected' as const, status: 'rejected', rejection_reason: reason }
            : r
        ));
      }
      
      setActionMessage({
        text: `Review ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
        type: 'success'
      });
      
      // Clear the stored rejection reason on approval
      if (status === 'approved') {
        setRejectionReasons(prev => {
          const newReasons = {...prev};
          delete newReasons[reviewId];
          return newReasons;
        });
      }
      
      // Collapse the expanded row
      setExpandedReviews(prev => ({
        ...prev,
        [reviewId]: false
      }));
    } catch (err) {
      console.error('Error moderating review:', err);
      setActionMessage({
        text: err instanceof Error ? err.message : 'Error moderating the review',
        type: 'error'
      });
    } finally {
      setActionLoading(prev => ({
        ...prev,
        [reviewId]: false
      }));
    }
  };

  // Show access denied if the user is not an admin
  if (!isAdmin && !loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="mb-8 text-2xl font-bold md:text-3xl">Moderation panel</h1>
      
      {/* Action message */}
      {actionMessage && (
        <div className={`mb-4 rounded-lg p-4 ${
          actionMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          <p>{actionMessage.text}</p>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          <p>{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left"></th>
                <th className="border p-2 text-left">Address</th>
                <th className="border p-2 text-left">User</th>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <React.Fragment key={review.review_session_id}>
                  <tr className="hover:bg-gray-50">
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => toggleReviewExpansion(review.review_session_id)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {expandedReviews[review.review_session_id] ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </td>
                    <td className="border p-2">{review.address_details?.fullAddress || 'Address not available'}</td>
                    <td className="border p-2">{review.user_id}</td>
                    <td className="border p-2">{new Date(review.created_at).toLocaleDateString('en-GB')}</td>
                    <td className="border p-2">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                        review.moderation_status === 'approved' ? 'bg-green-100 text-green-800' :
                        review.moderation_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.moderation_status === 'approved' ? 'Approved' :
                         review.moderation_status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                  
          {/* Expanded row with opinions */}
                  {expandedReviews[review.review_session_id] && (
                    <tr>
                      <td colSpan={5} className="border p-4 bg-gray-50">
                        <div className="mb-4">
                          {/* Review table */}
                          <table className="w-full border-collapse mb-6">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Property review</th>
                                <th className="border p-2 text-left">Community review</th>
                                <th className="border p-2 text-left">Landlord review</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border p-2">
                                  <p className="bg-white p-3 rounded border">{review.property_opinion || 'No review provided'}</p>
                                </td>
                                <td className="border p-2">
                                  <p className="bg-white p-3 rounded border">{review.community_opinion || 'No review provided'}</p>
                                </td>
                                <td className="border p-2">
                                  <p className="bg-white p-3 rounded border">{review.owner_opinion || 'No review provided'}</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                           
                          {/* Stored rejection reason (if any) */}
                          {review.moderation_status === 'rejected' && (
                            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800">
                              <div className="font-semibold mb-1">Rejection reason</div>
                              <p className="whitespace-pre-line">{review.rejection_reason || '-'}</p>
                            </div>
                          )}

                          {/* Rejection reason input */}
                          <div className="mb-4">
                            <label className="block font-medium mb-1">Rejection reason (required to reject):</label>
                            <textarea
                              value={rejectionReasons[review.review_session_id] || ''}
                              onChange={(e) => handleRejectionReasonChange(review.review_session_id, e.target.value)}
                              className="w-full rounded border p-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                              rows={2}
                              placeholder="Explain why you are rejecting this review..."
                            />
                          </div>
                          
                          {/* Approve/reject buttons */}
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => handleModerateReview(review.review_session_id, 'approved')}
                              disabled={actionLoading[review.review_session_id]}
                              className="rounded border border-green-600 px-4 py-2 text-green-600 hover:bg-green-50 disabled:opacity-50"
                            >
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve
                              </span>
                            </button>
                            <button 
                              onClick={() => handleModerateReview(review.review_session_id, 'rejected')}
                              disabled={actionLoading[review.review_session_id]}
                              className="rounded border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject
                              </span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Action message */}
    </div>
  );
};

export default ModerationPage;
