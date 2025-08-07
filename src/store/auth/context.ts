import { createContext } from 'react';
import type { AuthContextType } from './types';

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  isAdmin: false,
  logout: async () => {}
});
