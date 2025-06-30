import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types for our database
export type Opinion = {
  id?: number;
  casero_hash: string;
  texto: string;
  rating: number;
  lat?: number | null;
  lng?: number | null;
  created_at?: string;
};

// Function to fetch opinions by casero hash
export async function getOpinionsByCaseroHash(caseroHash: string): Promise<Opinion[]> {
  const { data, error } = await supabase
    .from('opiniones')
    .select('*')
    .eq('casero_hash', caseroHash);

  if (error) {
    console.error('Error fetching opinions:', error);
    throw error;
  }

  return data || [];
}

// Function to add a new opinion
export async function addOpinion(opinion: Omit<Opinion, 'id' | 'created_at'>): Promise<Opinion> {
  const { data, error } = await supabase
    .from('opiniones')
    .insert(opinion)
    .select()
    .single();

  if (error) {
    console.error('Error adding opinion:', error);
    throw error;
  }

  return data;
}
