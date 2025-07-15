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

/**
 * Submit address data from Step 1
 * @param payload Address data payload
 * @returns Success status
 */
/**
 * Fetch address step 1 data by session ID
 * @param sessionId The session ID to retrieve data for
 * @returns Address data or null if not found
 */
export async function getAddressStep1Data(sessionId: string): Promise<AddressStepData | null> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');
    
    console.log('Fetching address data for session ID:', sessionId);
    
    // Using RPC call to match the insert pattern
    const { data, error } = await client
      .rpc('get_address_step1_data', {
        p_session_id: sessionId
      });
    
    if (error) throw error;
    
    // If no data found, return null
    if (!data || data.length === 0) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching address data:', error);
    return null;
  }
}

export async function submitAddressStep1(payload: AddressStep1Payload, sessionId: string): Promise<boolean> {
  try {
    // Get Supabase client
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');
    
    console.log('Submitting address data with session ID:', sessionId);
    
    // Insert data into address-step1 table
    const { error } = await client
      .rpc('insert_address_step1', {
        p_session_id: sessionId,
        p_address_details: payload.addressDetails,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting address data:', error);
    return false;
  }
}
