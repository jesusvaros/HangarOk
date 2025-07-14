import { supabaseWrapper } from './client';
import type { AddressStep1Payload } from './types';

/**
 * Submit address data from Step 1
 * @param payload Address data payload
 * @returns Success status
 */
export async function submitAddressStep1(payload: AddressStep1Payload, token: string): Promise<boolean> {
  try {

    // Otherwise use real Supabase client
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');
    
    // Verify token before submission
    const { data: userData, error: authError } = await client.auth.getUser(token);
    
    if (authError || !userData) {
      console.error('Authentication error:', authError);
      throw new Error('Invalid authentication token');
    }
    
    // Insert data into address-step1 table
    const { error } = await client
      .from('address-step1')
      .insert([{
        user_id: userData.user.id,
        address_data: payload.address,
        address_details: payload.addressDetails,
        created_at: new Date().toISOString()
      }]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting address data:', error);
    return false;
  }
}
