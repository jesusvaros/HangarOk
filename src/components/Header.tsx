import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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

  // Only show the input on the home page
  const isHomePage = location.pathname === '/';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-md' : 'py-3'}`}
      style={{ backgroundColor: scrolled ? 'rgb(225, 245, 110)' : 'transparent' }}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            CV
          </div>
        </Link>

        {/* Input field that appears when scrolled or not on home page */}
        <div className="flex-1 flex justify-center">
          {(scrolled || !isHomePage) && (
            <div className="flex w-full max-w-xl">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Dirección de la vivienda"
                className="flex-grow p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleStart}
                className="bg-blue-600 text-white py-3 px-8 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium whitespace-nowrap"
              >
                Empezar
              </button>
            </div>
          )}
        </div>
        
        {/* Map icon on the right */}
        <Link to="/map" className="flex items-center ml-4">
          <div className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
