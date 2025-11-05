import { supabaseWrapper } from './client';
import type { ReviewSessionStatus } from './types';

export async function createReviewSession(payload: { session_id: string; user_id?: string | null }): Promise<void> {
  const client = supabaseWrapper.getClient();
  if (!client) throw new Error('Supabase client not available');

  // Use RPC function to create or get session
  const { data, error } = await client.rpc('upsert_review_session', {
    p_session_token: payload.session_id
  });

  if (error) {
    console.error('Error creating review session:', error);
    throw error;
  }
  
  console.log('Review session created/retrieved:', data);

  if (payload.user_id) {
    try {
      await client.rpc('update_review_session_user_by_token', {
        p_session_token: payload.session_id,
        p_user_id: payload.user_id,
      });
    } catch (linkError) {
      console.error('Error linking review session to user during creation:', linkError);
      // Do not throw – session creation succeeded and the link can be retried later
    }
  }
}

export async function getReviewSessionStatus(
  sessionId: string
): Promise<ReviewSessionStatus | null> {
  const client = supabaseWrapper.getClient();
  if (!client) throw new Error('Supabase client not available');

  const { data, error } = await client.rpc('get_review_session', {
    p_session_id: sessionId,
  });

  if (error) {
    console.error('Error getting review session status:', error);
    throw error;
  }
  
  console.log('Review session status:', data);
  if (!data || data.length === 0) return null;
  return data[0] as ReviewSessionStatus;
}
