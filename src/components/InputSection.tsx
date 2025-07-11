import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../store/useFormContext';
import AddressAutocomplete from './ui/AddressAutocomplete';

const InputSection: React.FC = () => {
  const navigate = useNavigate();
  const { address, setAddress } = useFormContext();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [nextMessageIndex, setNextMessageIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  
  const messages = [
    "Todas las reviews son Anónimas",
    "Tus opiniones ayudan a crear un mercado de alquiler más transparente",
    "Comparte tu experiencia con otros inquilinos",
    "Ayuda a mejorar el mercado inmobiliario"
  ];

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the md breakpoint in Tailwind
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Rotate through messages on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const rotateMessages = () => {
      // Start animation
      setIsAnimating(true);
      
      // After animation completes, update the displayed message
      setTimeout(() => {
        setCurrentMessageIndex(nextMessageIndex);
        setNextMessageIndex((nextMessageIndex + 1) % messages.length);
        setIsAnimating(false);
      }, 1000);
    };
    
    const interval = setInterval(rotateMessages, 3500);
    return () => clearInterval(interval);
  }, [isMobile, nextMessageIndex, messages.length]);

  const handleStart = () => {
    if (selectedAddress || address.trim()) {
      navigate('/add-review');
    }
  };
  
  const handleAddressSelect = (result: {
    formatted: string;
    geometry: {
      lat: number;
      lng: number;
    };
    components: Record<string, string | undefined>;
  }) => {
    const fullAddress = result.formatted;
    setAddress(fullAddress);
    setSelectedAddress(fullAddress);
  };

  // Render message with last word bold
  const renderMessage = (message: string) => {
    return message.split(' ').map((word, i, arr) => 
      i === arr.length - 1 ? 
        <span key={i} className="font-bold"> {word}</span> : 
        <span key={i}>{word} </span>
    );
  };

  // Mobile component

  if(isMobile){
    return (
    <section className="relative h-[calc(100vh-240px)] flex flex-col pt-24 items-center" style={{ backgroundColor: '#e1f56e' }}>
      <div className="container mx-auto px-0 max-w-5xl relative">
        {/* Mobile message carousel - sliding horizontally every 4 seconds */}
        <div className="mb-8 mt-8 overflow-hidden">
          <div className="relative h-[120px] w-full">
            {/* Current message */}
            <div 
              key={`message-${currentMessageIndex}`}
              className="bg-white p-4 rounded-lg shadow-md absolute transition-all duration-1000 left-1/2"
              style={{ 
                width: '280px',
                maxWidth: '80%',
                top: '50%',
                transform: `translate(-50%, -50%) translateX(${isAnimating ? '-200%' : '0'})`,
                zIndex: isAnimating ? 0 : 1
              }}
            >
              <p className="text-gray-700 font-medium text-center break-words">
                {renderMessage(messages[currentMessageIndex])}
              </p>
            </div>
            
            {/* Next message */}
            <div 
              key={`message-next-${nextMessageIndex}`}
              className="bg-white p-4 rounded-lg shadow-md absolute transition-all duration-1000 left-1/2"
              style={{ 
                width: '280px',
                maxWidth: '80%',
                top: '50%',
                transform: `translate(-50%, -50%) translateX(${isAnimating ? '0' : '200%'})`,
                zIndex: isAnimating ? 1 : 0
              }}
            >
              <p className="text-gray-700 font-medium text-center break-words">
                {renderMessage(messages[nextMessageIndex])}
              </p>
            </div>
          </div>
        </div>
        
        {/* Input and button */}
        <div className="flex flex-row justify-center items-center max-w-3xl px-4">
          <div className="w-full">
            <AddressAutocomplete
              onSelect={handleAddressSelect}
              initialValue={address}
              placeholder="Dirección del inmueble"
              className="rounded-l-lg"
            />
          </div>
          
          {/* Mobile button with icon */}
          <button
            onClick={handleStart}
            className="bg-[#F97316] text-white p-3 rounded-r-md flex-shrink-0 h-12 mt-[1px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

return (
    <section className="relative h-[calc(100vh-180px)] flex flex-col justify-center items-center" style={{ backgroundColor: '#e1f56e' }}>
      <div className="container mx-auto px-4 max-w-5xl relative">
        <div>
          <div className="absolute top-[-100px] left-[10%] md:left-[9%] lg:left-[10%] max-w-[200px]">
            <div className="bg-white p-3 rounded-lg shadow-md relative">
              <p className="text-gray-700 font-medium text-lg">Todas las reviews son <span className="font-bold">Anónimas</span></p>
              <div className="absolute -bottom-2 right-1/2 w-4 h-4 bg-white transform rotate-45"/>
            </div>
          </div>
          
          <div className="absolute top-[-130px] right-[10%] md:right-[6%] lg:right-[12%] max-w-[250px]">
            <div className="bg-white p-3 rounded-lg shadow-md relative">
              <p className="text-gray-700 text-lg">Tus opiniones ayudan a crear un mercado de alquiler más<span className="font-bold"> transparente</span></p>
              <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-white transform rotate-45"/>
            </div>
          </div>
        </div>
        
        <div className="flex flex-row justify-center items-center mx-auto max-w-3xl">
          <div className="w-full">
            <AddressAutocomplete
              onSelect={handleAddressSelect}
              initialValue={address}
              placeholder="Dirección del inmueble"
              className="rounded-l-lg"
              hideLabel
            />
          </div>
          
          <button
            onClick={handleStart}
            className="bg-[#F97316] text-white px-8 py-4 rounded-r-lg hover:bg-[#EA580C] focus:outline-none font-medium h-[52px] mt-[1px]"
          >
            Empezar
          </button>
        </div>
      </div>
    </section>
  ); 

};

export default InputSection;
