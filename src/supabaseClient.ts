import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

// Mock data for when Supabase is unavailable
const mockOpinions: Record<string, Opinion[]> = {
  // Some example hashed casero IDs with mock opinions
  'a1b2c3d4': [
    {
      id: 1,
      casero_hash: 'a1b2c3d4',
      texto: 'Buen casero, responde rápido a los problemas.',
      rating: 4,
      lat: 40.416775,
      lng: -3.703790,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      casero_hash: 'a1b2c3d4',
      texto: 'Tardó en devolver la fianza.',
      rating: 2,
      lat: 40.420000,
      lng: -3.708000,
      created_at: new Date().toISOString()
    }
  ]
};

// Flag to track if we're using mock data
let usingMockData = false;

// Create a wrapper for Supabase client that falls back to mock data
class SupabaseWrapper {
  private client: SupabaseClient | null = null;
  
  constructor() {
    try {
      // Get environment variables with fallbacks
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // Only create client if both URL and key are valid
      if (supabaseUrl && supabaseAnonKey && this.isValidUrl(supabaseUrl)) {
        this.client = createClient(supabaseUrl, supabaseAnonKey);
      } else {
        this.switchToMockMode();
      }
    } catch {
      this.switchToMockMode();
    }
  }

  private isValidUrl(urlString: string): boolean {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  }

  private switchToMockMode() {
    this.client = null;
    usingMockData = true;
  }

  getClient() {
    return this.client;
  }

  isUsingMockData() {
    return usingMockData;
  }
}

// Initialize the wrapper
const supabaseWrapper = new SupabaseWrapper();

/**
 * Get opinions by casero hash
 * @param caseroHash SHA-256 hash of casero identifier
 * @returns Array of opinions
 */
export async function getOpinionsByCaseroHash(caseroHash: string): Promise<Opinion[]> {
  try {
    // If using mock data, return from mock database
    if (supabaseWrapper.isUsingMockData()) {
      console.log('Using mock data for getOpinionsByCaseroHash');
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockOpinions[caseroHash] || [];
    }

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
    // If using mock data, add to mock database
    if (supabaseWrapper.isUsingMockData()) {
      console.log('Using mock data for addOpinion');
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add to mock database
      const hash = opinion.casero_hash;
      if (!mockOpinions[hash]) mockOpinions[hash] = [];
      
      mockOpinions[hash].push({
        ...opinion,
        id: Date.now(), // Use timestamp as ID
        created_at: new Date().toISOString()
      });
      
      return true;
    }

    // Otherwise use real Supabase client
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const { error } = await client
      .from('opiniones')
      .insert([opinion]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding opinion:', error);
    return false;
  }
}

// No need to export mock mode status
