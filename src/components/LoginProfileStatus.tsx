import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/auth/hooks';

const LoginProfileStatus: React.FC = () => {
  // Use the auth context instead of local state and direct Supabase calls
  const { user, isLoading } = useAuth();

  return (
    <div className="ml-4">
      {/* Show loading state while auth is being determined */}
      {isLoading ? (
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300"></div>
      ) : user ? (
        // Profile icon for logged in users
        <Link to="/profile" className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A5E32] text-white transition-colors hover:bg-[#5A6E42]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </Link>
      ) : (
        // Login icon for logged out users
        <Link to="/login" className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A5E32] text-white transition-colors hover:bg-[#5A6E42]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </div>
        </Link>
      )}
    </div>
  );
};

export default LoginProfileStatus;
