import { getSessionIdBack } from '../sessionManager';
import { supabaseWrapper } from './client';
import type { AddressStep1Payload } from './types';

// Define types for the address data returned from the database
interface AddressStepData {
  address_details: {
    street?: string;
    number?: string;
    floor?: string;
    door?: string;
    city?: string;
    postalCode?: string;
    coordinates?: { lat: number; lng: number };
  };
}

export async function getAddressStep1Data(sessionIdExternal?: string): Promise<AddressStepData | null> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    // Using RPC call to match the insert pattern
    const { data, error } = await client.rpc('get_address_step1_data', {
      p_review_session_id: sessionIdExternal || sessionId,
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

export async function submitAddressStep1(payload: AddressStep1Payload): Promise<boolean> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    const { error } = await client.rpc('upsert_address_step1_and_mark_review_session', {
      p_review_session_id: sessionId,
      p_address_details: payload.addressDetails,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting address data:', error);
    return false;
  }
}
