import { supabaseWrapper } from './client';
import type { ReviewSessionPayload } from './types';

/**
 * Create a new review session
 * @param sessionId UUID identifying the session
 * @returns Success status
 */
export async function createReviewSession(payload: ReviewSessionPayload = {}): Promise<string | null> {
  try {

    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');
    const insertPayload = { ...payload };

    const { data, error } = await client
      .from('review_sessions')
      .insert([insertPayload])
      .select('id')
      .single();

    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error('Error creating review session:', error);
    return null;
  }
}
