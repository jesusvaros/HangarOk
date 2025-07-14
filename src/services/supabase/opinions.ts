import { supabaseWrapper } from './client';
import type { Opinion } from './types';

/**
 * Get opinions by casero hash
 * @param caseroHash SHA-256 hash of casero identifier
 * @returns Array of opinions
 */
export async function getOpinionsByCaseroHash(caseroHash: string): Promise<Opinion[]> {
  try {
    // Otherwise use real Supabase client
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const { data, error } = await client
      .from('opiniones')
      .select('*')
      .eq('casero_hash', caseroHash);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching opinions:', error);
    return [];
  }
}

/**
 * Add a new opinion
 * @param opinion Opinion object to add
 * @returns Success status
 */
export async function addOpinion(opinion: Opinion): Promise<boolean> {
  try {
    // Otherwise use real Supabase client
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const { error } = await client.from('opiniones').insert([opinion]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding opinion:', error);
    return false;
  }
}
