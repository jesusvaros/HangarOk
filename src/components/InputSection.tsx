import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReviewSession } from '../supabaseClient';
import type { ReviewSessionPayload } from '../supabaseClient';
import { useFormContext } from '../store/useFormContext';
import AddressAutocomplete from './ui/AddressAutocomplete';
import type { AddressResult } from './ui/AddressAutocomplete';

const InputSection: React.FC = () => {
  const navigate = useNavigate();
  const { address, setAddress, updateFormData, formData } = useFormContext();
  const initialAddressData = (() => {
    if (formData.addressAutocompleteResult) {
      const r = formData.addressAutocompleteResult as unknown as {
        formatted: string;
        geometry: { lat: number; lng: number };
        components: Record<string, string | undefined>;
      };
      const comp = r.components;
      const cityName =
        comp.city ||
        comp.town ||
        comp.village ||
        comp.municipality ||
        comp.county ||
        comp.state ||
        '';
      const coords = { lat: r.geometry.lat, lng: r.geometry.lng };
      const streetName =
        comp.road ||
        comp.street ||
        comp.residential ||
        comp.footway ||
        comp.neighbourhood ||
        comp.suburb ||
        '';
      return {
        selectedAddress: r.formatted,
        coords,
        city: cityName,
        street: streetName,
      };
    }
    return {
      selectedAddress: '',
      coords: null as { lat: number; lng: number } | null,
      city: '',
      street: '',
    };
  })();

  const [state, setState] = useState({
    currentMessageIndex: 0,
    nextMessageIndex: 1,
    isAnimating: false,
    isMobile: false,
    ...initialAddressData
  });

  const {
    currentMessageIndex,
    nextMessageIndex,
    isAnimating,
    isMobile,
    selectedAddress,
    coords,
    city,
    street,
  } = state;

  const messages = [
    'Todas las reviews son Anónimas',
    'Tus opiniones ayudan a crear un mercado de alquiler más transparente',
    'Comparte tu experiencia con otros inquilinos',
    'Ayuda a mejorar el mercado inmobiliario',
  ];

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setState((prev) => ({ ...prev, isMobile: window.innerWidth < 768 })); // 768px md breakpoint
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
    }, []);

  // Restore previously selected address if coming back from other pages
  useEffect(() => {
    if (formData.addressAutocompleteResult && !coords) {
      const r = formData.addressAutocompleteResult as unknown as {
        formatted: string;
        geometry: { lat: number; lng: number };
        components: Record<string, string | undefined>;
      };
      const coordinates = { lat: r.geometry.lat, lng: r.geometry.lng };
      const comp = r.components;
      const cityName =
        comp.city ||
        comp.town ||
        comp.village ||
        comp.municipality ||
        comp.county ||
        comp.state ||
        '';
      const streetName =
        comp.road ||
        comp.street ||
        comp.residential ||
        comp.footway ||
        comp.neighbourhood ||
        comp.suburb ||
        '';
      setState((prev) => ({
        ...prev,
        selectedAddress: r.formatted,
        coords: coordinates,
        city: cityName,
        street: streetName,
      }));
    }
  }, [formData.addressAutocompleteResult, coords]);

  // Rotate through messages on mobile
  useEffect(() => {
    if (!isMobile) return;

    const rotateMessages = () => {
      // Start animation
      setState((prev) => ({ ...prev, isAnimating: true }));

      // After animation completes, update the displayed message
      setTimeout(() => {
        setState((prev) => ({
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
    const fullAddress = selectedAddress || address.trim();
    if (!fullAddress) return;
    if (!coords) {
      // Require selecting an autocomplete option to ensure we have coordinates
      alert('Por favor selecciona una dirección de la lista para continuar');
      return;
    }

    const storedId = localStorage.getItem('reviewSessionId');
    if (!storedId) {
      // set PENDING to avoid race conditions
      localStorage.setItem('reviewSessionId', 'PENDING');
      const payload: ReviewSessionPayload = { full_address: fullAddress };
      if (coords) {
        payload.lat = coords.lat;
        payload.lng = coords.lng;
      }
      if (city) payload.city = city;
      if (street) payload.street = street;
      const generatedId = await createReviewSession(payload);
      if (generatedId) {
        localStorage.setItem('reviewSessionId', generatedId);
      }
    }

    navigate('/add-review');
  };

  const handleAddressSelect = (result: AddressResult) => {
    const fullAddress = result.formatted;
    setAddress(fullAddress);
    const coordinates = { lat: result.geometry.lat, lng: result.geometry.lng };
    setState((prev) => ({
      ...prev,
      selectedAddress: fullAddress,
      coords: coordinates,
    }));
    // Persist full result for later steps
    updateFormData({ addressAutocompleteResult: result });
  // Extract city and street from components
  const comp = result.components;
  const cityName =
    comp.city ||
    comp.town ||
    comp.village ||
    comp.municipality ||
    comp.county ||
    comp.state ||
    '';
  const streetName =
    comp.road ||
    comp.street ||
    comp.residential ||
    comp.footway ||
    comp.neighbourhood ||
    comp.suburb ||
    '';
  setState((prev) => ({ ...prev, city: cityName, street: streetName }));
  // Persist full address details in form context so Step1 loads it
  updateFormData({
    addressAutocompleteResult: result,
    addressDetails: {
      street: fullAddress,
      city: cityName,
      fullAddress: fullAddress,
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
      ),
    );
  };

  // Mobile component

  if (isMobile) {
    return (
      <section
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

          {/* Input and button */}
          <div className="flex max-w-3xl flex-row items-start justify-center px-4">
            <div className="w-full">
              <AddressAutocomplete
                onSelect={handleAddressSelect}
                initialValue={address}
                initialResult={formData.addressAutocompleteResult}
                placeholder="Dirección del inmueble"
                hideLabel
              />
            </div>

            {/* Mobile button with icon */}
            <button
              onClick={handleStart}
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

        <div className="mx-auto flex max-w-3xl flex-row items-start justify-center">
          <div className="w-full">
            <AddressAutocomplete
              onSelect={handleAddressSelect}
              initialValue={address}
              initialResult={formData.addressAutocompleteResult}
              placeholder="Dirección del inmueble"
              hideLabel
            />
          </div>

          <button
            onClick={handleStart}
            className="mt-[1px] flex h-[48px] items-center justify-center rounded-r-lg bg-[#F97316] px-8 py-4 font-medium text-white hover:bg-[#EA580C] focus:outline-none"
          >
            Empezar
          </button>
        </div>
      </div>
    </section>
  );
};

export default InputSection;
