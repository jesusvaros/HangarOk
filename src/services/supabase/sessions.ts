import { supabaseWrapper } from './client';
import type { ReviewSessionStatus } from './types';

export async function createReviewSession(payload: { session_id: string; user_id?: string | null }): Promise<void> {
  const client = supabaseWrapper.getClient();
  if (!client) throw new Error('Supabase client not available');

  const { error } = await client.from('review_sessions').insert(payload);

  if (error) throw error;
}

export async function getReviewSessionStatus(
  sessionId: string
): Promise<ReviewSessionStatus | null> {
  const client = supabaseWrapper.getClient();
  if (!client) throw new Error('Supabase client not available');

  const { data, error } = await client.rpc('get_review_session', {
    p_session_id: sessionId,
  });

  if (error) throw error;
  if (!data || data.length === 0) return null;
  return data[0] as ReviewSessionStatus;
}
