import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginProfileStatus from './LoginProfileStatus';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 330; // Change this value as needed
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

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
        
        {/* Login/Profile Status Component */}
        <LoginProfileStatus />
      </div>
    </header>
  );
};

export default Header;
