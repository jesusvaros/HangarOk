import type { User } from '@supabase/supabase-js';

// Define the shape of our auth context
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  logout: () => Promise<void>;
}
