import { supabaseWrapper } from './client';
import type { ReviewSessionPayload, ReviewSessionStatus } from './types';

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

/**
 * Get review session status by session ID
 * @param sessionId The session ID to retrieve
 * @returns Session status or null if not found
 */
export async function getReviewSessionStatus(sessionId: string): Promise<ReviewSessionStatus | null> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');
    
    console.log('Fetching session status for ID:', sessionId);
    
    const { data, error } = await client
      .from('review_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (error) throw error;
    return data as ReviewSessionStatus || null;
  } catch (error) {
    console.error('Error fetching review session status:', error);
    return null;
  }
}
