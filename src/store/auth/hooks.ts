import { useContext } from 'react';
import { AuthContext } from './context';

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
