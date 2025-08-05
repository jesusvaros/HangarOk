import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabaseWrapper } from '../services/supabase/client';

const LoginProfileStatus: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user is logged in by looking for the session in localStorage
    const checkLoginStatus = async () => {
      const sessionStr = localStorage.getItem('cv_session');
      
      if (sessionStr) {
        try {
          // Parse session just to validate it's proper JSON
          JSON.parse(sessionStr);
          // Verify if the session is still valid with Supabase
          const client = supabaseWrapper.getClient();
          if (client) {
            const { data } = await client.auth.getUser();
            setIsLoggedIn(!!data.user);
          }
        } catch (error) {
          console.error('Error checking login status:', error);
          // If there's an error parsing the session, consider the user logged out
          localStorage.removeItem('cv_session');
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <div className="ml-4">
      {isLoggedIn ? (
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
