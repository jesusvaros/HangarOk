import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../store/useFormContext';
import { useAuth } from '../store/auth/hooks';
import AddressAutocomplete from './ui/AddressAutocomplete';
import type { AddressResult } from './ui/AddressAutocomplete';
import { showErrorToast } from './ui/toast/toastUtils';
import { initializeSession } from '../services/sessionManager';

const InputSection: React.FC = () => {
  const navigate = useNavigate();
  const { address, setAddress, updateFormData, formData } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'form' | 'map'>('form');
  const { user } = useAuth();

  const [state, setState] = useState({
    currentMessageIndex: 0,
    nextMessageIndex: 1,
    isAnimating: false,
    isMobile: false,
  });

  const { currentMessageIndex, nextMessageIndex, isAnimating, isMobile } = state;

  const messages = [
    'Todas las reviews son Anónimas',
    'Tus opiniones ayudan a crear un mercado de alquiler más transparente',
    'Comparte tu experiencia con otros inquilinos',
    'Ayuda a mejorar el mercado inmobiliario',
  ];

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setState(prev => ({ ...prev, isMobile: window.innerWidth < 768 })); // 768px md breakpoint
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
      setState(prev => ({ ...prev, isAnimating: true }));

      // After animation completes, update the displayed message
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          currentMessageIndex: prev.nextMessageIndex,
          nextMessageIndex: (prev.nextMessageIndex + 1) % messages.length,
          isAnimating: false,
        }));
      }, 1000);
    };

    const interval = setInterval(rotateMessages, 3500);
    return () => clearInterval(interval);
  }, [isMobile, nextMessageIndex, messages.length]);

  const handleStart = async () => {
    try {
      if (!formData.addressDetails?.coordinates || !address.trim()) {
        showErrorToast('Por favor selecciona una dirección de la lista para continuar');
        return;
      }

      updateFormData({
        addressDetails: formData.addressDetails,
        addressAutocompleteResult: formData.addressAutocompleteResult,
      });

      // Inicializar o recuperar la sesión con el ID del usuario si está autenticado
      const { sessionId } = await initializeSession(user?.id);

      if (sessionId) {
        navigate('/add-review');
      }
    } catch (error) {
      console.error('Error:', error);
      showErrorToast('Ha ocurrido un error al procesar tu solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToMap = () => {
      if (!formData.addressDetails?.coordinates || !address.trim()) {
        showErrorToast('Por favor selecciona una dirección de la lista para continuar');
        return;
      }
      const coords = formData.addressDetails.coordinates;
      const q = address;
      navigate(`/map?lat=${coords.lat}&lng=${coords.lng}&q=${encodeURIComponent(q)}`);
  };

  const handleAddressSelect = (result: AddressResult) => {
    const fullAddress = result.formatted;
    setAddress(fullAddress);
    const coordinates = { lat: result.geometry.lat, lng: result.geometry.lng };
    setState(prev => ({
      ...prev,
      selectedAddress: fullAddress,
      coords: coordinates,
      addressDetailsState: {
        street: fullAddress,
        coordinates,
        components: result.components,
      },
    }));

    updateFormData({
      addressAutocompleteResult: result,
      addressDetails: {
        street: fullAddress,
        coordinates,
        components: result.components,
      },
    });
    updateFormData({
      addressAutocompleteResult: result,
      addressDetails: {
        street: fullAddress,
        coordinates,
        components: result.components,
      },
    });
  };

  // Render message with last word bold
  const renderMessage = (message: string) => {
    return message.split(' ').map((word, i, arr) =>
      i === arr.length - 1 ? (
        <span key={i} className="font-bold">
          {' '}
          {word}
        </span>
      ) : (
        <span key={i}>{word} </span>
      )
    );
  };

  // Mobile component

  if (isMobile) {
    return (
      <section
        id="home-address-section"
        className="relative flex h-[calc(100vh-240px)] flex-col items-center pt-24"
        style={{ backgroundColor: '#e1f56e' }}
      >
        <div className="container relative mx-auto max-w-5xl px-0">
          {/* Mobile message carousel - sliding horizontally every 4 seconds */}
          <div className="mb-8 mt-8 overflow-hidden">
            <div className="relative h-[120px] w-full">
              {/* Current message */}
              <div
                key={`message-${currentMessageIndex}`}
                className="absolute left-1/2 rounded-lg bg-white p-4 shadow-md transition-all duration-1000"
                style={{
                  width: '280px',
                  maxWidth: '80%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translateX(${isAnimating ? '-200%' : '0'})`,
                  zIndex: isAnimating ? 0 : 1,
                }}
              >
                <p className="break-words text-center font-medium text-gray-700">
                  {renderMessage(messages[currentMessageIndex])}
                </p>
              </div>

              {/* Next message */}
              <div
                key={`message-next-${nextMessageIndex}`}
                className="absolute left-1/2 rounded-lg bg-white p-4 shadow-md transition-all duration-1000"
                style={{
                  width: '280px',
                  maxWidth: '80%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translateX(${isAnimating ? '0' : '200%'})`,
                  zIndex: isAnimating ? 1 : 0,
                }}
              >
                <p className="break-words text-center font-medium text-gray-700">
                  {renderMessage(messages[nextMessageIndex])}
                </p>
              </div>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="mx-auto mb-3 flex max-w-3xl justify-center px-4">
            <div className="inline-flex rounded-lg bg-white p-1 shadow">
              <button
                type="button"
                onClick={() => setMode('form')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'form' ? 'bg-[#4A5E32] text-white' : 'text-[#4A5E32] hover:bg-gray-100'}`}
              >
                Escribir review
              </button>
              <button
                type="button"
                onClick={() => setMode('map')}
                className={`ml-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'map' ? 'bg-[#4A5E32] text-white' : 'text-[#4A5E32] hover:bg-gray-100'}`}
              >
                Buscar en el mapa
              </button>
            </div>
          </div>

          {/* Input and button */}
          <div className="flex max-w-3xl flex-row items-start justify-center px-4">
            <div className="w-full">
              <AddressAutocomplete
                onSelect={handleAddressSelect}
                value={address}
                placeholder="Dirección del inmueble"
                hideLabel
              />
            </div>

            {/* Mobile button with icon */}
            <button
              onClick={mode === 'form' ? handleStart : handleGoToMap}
              className="mt-[1px] h-12 flex-shrink-0 rounded-r-md bg-[#F97316] p-3 text-white"
            >
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home-address-section"
      className="relative flex h-[calc(100vh-180px)] flex-col items-center justify-center"
      style={{ backgroundColor: '#e1f56e' }}
    >
      <div className="container relative mx-auto max-w-5xl px-4">
        <div>
          <div className="absolute left-[10%] top-[-100px] max-w-[200px] md:left-[9%] lg:left-[10%]">
            <div className="relative rounded-lg bg-white p-3 shadow-md">
              <p className="text-lg font-medium text-gray-700">
                Todas las reviews son <span className="font-bold">Anónimas</span>
              </p>
              <div className="absolute -bottom-2 right-1/2 h-4 w-4 rotate-45 transform bg-white" />
            </div>
          </div>

          <div className="absolute right-[10%] top-[-130px] max-w-[250px] md:right-[6%] lg:right-[12%]">
            <div className="relative rounded-lg bg-white p-3 shadow-md">
              <p className="text-lg text-gray-700">
                Tus opiniones ayudan a crear un mercado de alquiler más
                <span className="font-bold"> transparente</span>
              </p>
              <div className="absolute -bottom-2 left-1/2 h-4 w-4 rotate-45 transform bg-white" />
            </div>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="mx-auto mb-5 flex max-w-3xl justify-center">
          <div className="inline-flex rounded-xl bg-white p-2 shadow-md">
            <button
              type="button"
              onClick={() => setMode('form')}
              className={`px-6 py-3 text-base md:text-lg font-semibold rounded-lg transition-colors ${mode === 'form' ? 'bg-[#4A5E32] text-white' : 'text-[#4A5E32] hover:bg-gray-100'}`}
            >
              Escribir review
            </button>
            <button
              type="button"
              onClick={() => setMode('map')}
              className={`ml-2 px-6 py-3 text-base md:text-lg font-semibold rounded-lg transition-colors ${mode === 'map' ? 'bg-[#4A5E32] text-white' : 'text-[#4A5E32] hover:bg-gray-100'}`}
            >
              Buscar en el mapa
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-3xl flex-row items-start justify-center">
          <div className="w-full">
            <AddressAutocomplete
              onSelect={handleAddressSelect}
              value={address}
              placeholder="Dirección del inmueble"
              hideLabel
              inputClassName="[&_input]:h-14 [&_input]:text-lg [&_input]:px-5"
            />
          </div>

          <button
            onClick={mode === 'form' ? handleStart : handleGoToMap}
            disabled={isLoading}
            className="mt-[1px] flex h-14 items-center justify-center rounded-r-lg bg-[#F97316] px-8 py-4 text-lg font-semibold text-white hover:bg-[#EA580C] focus:outline-none"
          >
            {mode === 'form' ? 'Empezar' : 'Buscar'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default InputSection;
