import { getSessionIdBack } from '../sessionManager';
import { supabaseWrapper } from './client';

interface EstanciaStep2Payload {
    neighbor_types?: string[];
    tourist_apartments?: 'Sí, tolerable' | 'Sí, molestos' | 'No hay';
    building_cleanliness?: 'Muy limpio' | 'Buena' | 'Poca' | 'Sin limpieza';
    community_environment?: string[];
    community_security?: 'Muy segura' | 'Sin problemas' | 'Mejorable' | 'Poco segura';
    community_opinion?: string;
}

interface SubmitStep5Payload {
    ownerType?: 'Particular' | 'Agencia';
    ownerName?: string;
    ownerPhone?: string;
    ownerEmail?: string;
    ownerOpinion?: string;
}

export async function getSessionStep4Data(): Promise<EstanciaStep2Payload | null> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    // Using RPC call to match the insert pattern
    const { data, error } = await client.rpc('get_gestion_step5_data', {
    p_review_session_id: sessionId,
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

export async function submitSessionStep5(payload: SubmitStep5Payload  ): Promise<boolean> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    const { error } = await client.rpc('upsert_gestion_step5_and_mark_review_session', {
      p_review_session_id: sessionId,
      p_owner_type: payload.ownerType,
      p_owner_name: payload.ownerName,
      p_owner_phone: payload.ownerPhone,
      p_owner_email: payload.ownerEmail,
      p_owner_opinion: payload.ownerOpinion,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting address data:', error);
    return false;
  }
}
