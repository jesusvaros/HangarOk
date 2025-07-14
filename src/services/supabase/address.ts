import { supabaseWrapper } from './client';
import type { AddressStep1Payload } from './types';

/**
 * Submit address data from Step 1
 * @param payload Address data payload
 * @returns Success status
 */
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
        p_address_data: payload.address,
        p_address_details: payload.addressDetails,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting address data:', error);
    return false;
  }
}
