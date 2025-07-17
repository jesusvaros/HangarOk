import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
      }
    } catch {
      this.client = null;
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

  getClient() {
    return this.client;
  }
}

// Initialize the wrapper
export const supabaseWrapper = new SupabaseWrapper();
