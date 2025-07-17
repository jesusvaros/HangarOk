import { getSessionIdBack } from '../sessionManager';
import { supabaseWrapper } from './client';

interface EstanciaStep2Payload {
  summer_temperature: 'Bien aislado' | 'Correcto' | 'Caluroso';
  winter_temperature: 'Bien aislado' | 'Correcto' | 'Frío';
  noise_level: 'Silencioso' | 'Tolerable' | 'Bastante' | 'Se oye todo';
  light_level: 'Nada de luz' | 'Poca luz' | 'Luminoso' | 'Muy luminoso';
  maintenance_status: 'Como nuevo' | 'Bueno' | 'Aceptable' | 'Poco' | 'Malo';
  property_opinion?: string;
}

export async function getSessionStep3Data(): Promise<EstanciaStep2Payload | null> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    // Using RPC call to match the insert pattern
    const { data, error } = await client.rpc('get_piso_step3_data', {
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

export async function submitSessionStep3(payload: { summerTemperature: string; winterTemperature: string; noiseLevel: string; lightLevel: string; maintenanceStatus: string; propertyOpinion?: string }): Promise<boolean> {
  try {
    // Get Supabase client
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    const { error } = await client.rpc('upsert_piso_step3_and_mark_review_session', {
      p_review_session_id: sessionId,
      p_summer_temperature: payload.summerTemperature,
      p_winter_temperature: payload.winterTemperature,
      p_noise_level: payload.noiseLevel,
      p_light_level: payload.lightLevel,
      p_maintenance_status: payload.maintenanceStatus,
      p_property_opinion: payload.propertyOpinion,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting address data:', error);
    return false;
  }
}
