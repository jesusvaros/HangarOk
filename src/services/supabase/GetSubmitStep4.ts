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

interface SubmitStep4Payload {
  neighborTypes?: string[];
  touristApartments?: 'Sí, tolerable' | 'Sí, molestos' | 'No hay';
  buildingCleanliness?: 'Muy limpio' | 'Buena' | 'Poca' | 'Sin limpieza';
  communityEnvironment?: string[];
  communitySecurity?: 'Muy segura' | 'Sin problemas' | 'Mejorable' | 'Poco segura';
  communityOpinion?: string;
}

export async function getSessionStep4Data(): Promise<EstanciaStep2Payload | null> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    // Using RPC call to match the insert pattern
    const { data, error } = await client.rpc('get_comunidad_step4_data', {
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

export async function submitSessionStep4(payload: SubmitStep4Payload): Promise<boolean> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    const { error } = await client.rpc('upsert_comunidad_step4_and_mark_review_session', {
      p_review_session_id: sessionId,
      p_neighbor_types: payload.neighborTypes,
      p_community_environment: payload.communityEnvironment, //opcional
      p_tourist_apartments: payload.touristApartments, //opcional
      p_building_cleanliness: payload.buildingCleanliness, //opcional
      p_community_security: payload.communitySecurity,
      p_community_opinion: payload.communityOpinion,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting address data:', error);
    return false;
  }
}
