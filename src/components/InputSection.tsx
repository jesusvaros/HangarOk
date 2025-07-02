import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InputSection: React.FC = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');

  const handleStart = () => {
    if (address.trim()) {
      navigate(`/add-review?address=${encodeURIComponent(address)}`);
    }
  };

  return (
    <section className="relative h-[calc(100vh-180px)] flex flex-col justify-center items-center" style={{ backgroundColor: '#e1f56e' }}>
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-3 justify-center items-center">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Dirección de la vivienda"
            className="flex-grow w-full md:w-auto p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleStart}
            className="bg-blue-600 text-white py-3 px-8 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium whitespace-nowrap"
          >
            Empezar
          </button>
        </div>
      </div>
        
      {/* Text at top left with arrow */}
      <div className="absolute top-[30%] left-[20%] max-w-[200px]">
        <div className="bg-white p-3 rounded-lg shadow-md relative">
          <p className="text-gray-700 font-medium text-lg ">Todas las reviews son <span className="font-bold">Anónimas</span></p>

        <div className="absolute -bottom-2 right-1/2 w-4 h-4 bg-white transform rotate-45"/>
        </div>
      </div>
      
      {/* Text at top right with arrow */}
      <div className="absolute top-[25%] right-[15%] max-w-[250px]">
        <div className="bg-white p-3 rounded-lg shadow-md relative">
          <p className="text-gray-700 text-lg">Tus opiniones ayudan a crear un mercado de alquiler más<span className="font-bold"> transparente</span></p>
          <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-white transform rotate-45 "/>
        </div>
        
      </div>
     
    </section>
  );
};

export default InputSection;
