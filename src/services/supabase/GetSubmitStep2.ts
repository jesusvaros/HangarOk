import { getSessionIdBack } from '../sessionManager';
import { supabaseWrapper } from './client';

interface EstanciaStep2Payload {
  start_year: number;
  end_year: number | null;
  price: number;
  included_services: string[];
  would_recommend: '1'|'2'|'3'|'4'|'5'|undefined;
}

export async function getSessionStep2Data(id?: string): Promise<EstanciaStep2Payload | null> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    // Using RPC call to match the insert pattern
    const { data, error } = await client.rpc('get_estancia_step2_data', {
      p_review_session_id: id || sessionId,
    });

    if (error) throw error;

    // If no data found, return null
    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error fetching address data:', error);
    return null;
  }
}

export async function submitSessionStep2(payload: {
  startYear: number;
  endYear: number | null;
  price: number;
  includedServices: string[];
  wouldRecommend: string;
}): Promise<boolean> {
  try {
    // Get Supabase client
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    const { error } = await client.rpc('upsert_estancia_step2_and_mark_review_session', {
      p_review_session_id: sessionId,
      p_start_year: payload.startYear,
      p_end_year: payload.endYear,
      p_price: payload.price,
      p_included_services: payload.includedServices,
      p_would_recommend: payload.wouldRecommend,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting address data:', error);
    return false;
  }
}
