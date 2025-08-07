import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth/hooks';
import LoginContent from './ui/LoginContent';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [address, setAddress] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 330; // Change this value as needed
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Extract address from URL if on review page
  useEffect(() => {
    if (location.pathname.includes('/review/')) {
      const pathParts = location.pathname.split('/');
      if (pathParts.length > 2) {
        // Here you would fetch the address based on the review ID
        // For now, just use a placeholder
        setAddress('Calle de ejemplo, 123');
      }
    } else {
      setAddress('');
    }
  }, [location]);

  const handleStart = () => {
    if (address.trim()) {
      navigate(`/add-review?address=${encodeURIComponent(address)}`);
    }
  };

  // Hide input on specific routes
  const isAddReviewPage = location.pathname === '/add-review';
  const isHomePage = location.pathname === '/';

  return (
    <header
      className={`duration-400 fixed left-0 right-0 top-0 z-50 transition-all ${scrolled && !isAddReviewPage ? 'py-2' : 'py-3'}`}
      style={{
        backgroundColor:
          (scrolled && !isAddReviewPage) || !isHomePage ? 'rgb(225, 245, 110)' : 'transparent',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A5E32] font-bold text-white">
            CV
          </div>
        </Link>

        {/* Input field on desktop, 'Add a review' button on mobile */}
        <div className="flex flex-1 justify-center">
          {(scrolled || !isHomePage) && !isAddReviewPage && (
            <>
              {/* Desktop input and button */}
              <div className="hidden w-full max-w-xl md:flex">
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Dirección de la vivienda"
                  className="flex-grow rounded-l-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleStart}
                  className="whitespace-nowrap rounded-r-lg bg-[#F97316] px-8 py-3 text-lg font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Empezar
                </button>
              </div>

              {/* Mobile 'Add a review' button */}
              <div className="md:hidden">
                <Link
                  to="/add-review"
                  className="mx-2 flex min-w-[160px] items-center justify-center rounded-lg bg-[#F97316] px-6 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-gray-700"
                >
                  Add a review
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Map icon on the right */}
        <Link to="/map" className="ml-4 flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A5E32] text-white transition-colors hover:bg-[#4A5E32]">
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
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
        </Link>
        
        {/* Login Dropdown Component */}
        <LoginDropdown />
      </div>
    </header>
  );
};

// Login Dropdown Component
const LoginDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative ml-4" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A5E32] text-white transition-colors hover:bg-[#5A6E42]"
        aria-expanded={isDropdownOpen}
        aria-label={user ? 'Perfil de usuario' : 'Iniciar sesión'}
      >
        {user ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-lg bg-white p-4 shadow-lg">
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4A5E32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">{user.email}</span>
              </div>
              <Link 
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="mt-2 w-full rounded bg-[#4A5E32] px-4 py-2 text-center text-white transition-colors hover:bg-[#5A6E42]"
              >
                Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="mt-2 w-full rounded bg-[#4A5E32] px-4 py-2 text-white transition-colors hover:bg-[#5A6E42]"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="p-2">
              <LoginContent onClose={() => setIsDropdownOpen(false)} showTitle={false} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
