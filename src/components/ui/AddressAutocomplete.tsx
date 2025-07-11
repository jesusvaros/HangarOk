import React, { useState, useEffect, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";

interface AddressResult {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
  components: {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    [key: string]: string | undefined;
  };
  annotations: {
    geohash: string;
    [key: string]: unknown;
  };
}

interface AddressAutocompleteProps {
  onSelect: (result: AddressResult) => void;
  placeholder?: string;
  initialValue?: string;
  initialStreetNumber?: string;
  className?: string;
  label?: string;
  id?: string;
  required?: boolean;
  showNumberField?: boolean;
  validateNumber?: boolean;
  hideLabel?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onSelect,
  placeholder = "Buscar dirección...",
  initialValue = "",
  initialStreetNumber = "",
  className = "",
  id = "address-autocomplete",
  required = false,
  showNumberField = false,
  validateNumber = false,
  hideLabel = false,
}) => {
  const [query, setQuery] = useState(initialValue);
  const [streetNumber, setStreetNumber] = useState(initialStreetNumber);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(null);
  const [numberError, setNumberError] = useState(false);

  // Para depuración
  useEffect(() => {
    if (validateNumber) {
      console.log("Estado actual de validación:", { 
        validateNumber, 
        selectedAddress, 
        numberError,
        streetNumber
      });
    }
  }, [validateNumber, selectedAddress, numberError, streetNumber]);

  // Create a memoized debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchText: string) => {
        if (searchText.length < 3) {
          setResults([]);
          return;
        }
        setLoading(true);
        try {
          // Debug the API key - using Vite's environment variable format
          const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
          console.log("API Key available:", !!apiKey);
          
          // Use specific parameters to improve street number detection
          const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            searchText
          )}&key=${apiKey || "YOUR_API_KEY_HERE"}&language=es&limit=5&countrycode=es&addressdetails=1&no_annotations=0&abbrv=1`;
          
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.status?.code !== 200) {
            console.error("OpenCage API error:", data.status);
            setResults([]);
            return;
          }
          
          // Process results to ensure we have the most complete address information
          const processedResults = (data.results || []).map((result: AddressResult) => {
            // Make sure we have the components properly extracted
            if (!result.components) {
              result.components = {};
            }
            
            // Log the result to help with debugging
            console.log("OpenCage result:", result);
            
            return result;
          });
          
          setResults(processedResults);
        } catch (err) {
          console.error("Error fetching addresses:", err);
          setResults([]);
        }
        setLoading(false);
      }, 500),
    []
  );
  
  // Use the debounced search function
  const fetchAddresses = useCallback(
    (searchText: string) => {
      debouncedSearch(searchText);
    },
    [debouncedSearch]
  );

  useEffect(() => {
    fetchAddresses(query);
  }, [query, fetchAddresses]);

  const handleSelectAddress = (result: AddressResult) => {
    console.log("Selected result:", result);
    const number = result.components.house_number || '';
    const city = result.components.city || result.components.town || result.components.village || '';
    const postcode = result.components.postcode || '';
    
    // Format the street display with postal code and city
    const formattedStreet = `${result.components.road || ''}, ${postcode} ${city}`;
    
    // Update the input value with the formatted street
    setQuery(formattedStreet);
    
    // Update the number field if available
    if (number) {
      setStreetNumber(number);
    }
    
    // Store the selected address for validation
    setSelectedAddress(result);
    
    // Reset error state when selecting a new address
    setNumberError(false);
    
    // Hide dropdown
    setIsFocused(false);
    
    // Clear results to hide dropdown
    setResults([]);
    
    // Call the onSelect callback with the result
    if (onSelect) {
      onSelect(result);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex space-x-2">
        {/* Street input with label */}
        <div className={`relative ${showNumberField ? 'w-3/4' : 'w-full'}`}>
          {!hideLabel && (
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
              Dirección {required && <span className="text-red-500">*</span>}
            </label>
          )}
          <input
            type="text"
            id={id}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay hiding the dropdown to allow for clicks on the options
              setTimeout(() => setIsFocused(false), 200);
            }}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(74,94,50)] border-gray-300"
          />
          {loading && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[rgb(74,94,50)]"></div>
            </div>
          )}
          {/* Dropdown results */}
          {results.length > 0 && isFocused && (
            <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 shadow-lg max-h-60 overflow-y-auto z-50">
              {results.map((result) => {
                // Create a more user-friendly display format that emphasizes street numbers
                const street = result.components.road || '';
                const number = result.components.house_number || '';
                const city = result.components.city || result.components.town || result.components.village || '';
                const postcode = result.components.postcode || '';
                
                // Format with street number highlighted if available
                const displayAddress = number ? 
                  <span><strong>{street}</strong> ({number}), {postcode} {city}</span> : 
                  <span>{street}, {postcode} {city}</span>;
                  
                return (
                  <li
                    key={result.annotations.geohash}
                    onClick={() => handleSelectAddress(result)}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                  >
                    {displayAddress}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/* Número input */}
        {showNumberField && (
          <div className="w-1/4">
            <label htmlFor={`${id}-number`} className="block text-sm font-medium text-gray-700 mb-2">
              Número
            </label>
            <input
              id={`${id}-number`}
              type="text"
              placeholder="Número"
              value={streetNumber}
              disabled={!selectedAddress} // Deshabilitado hasta que se seleccione una calle
              onChange={(e) => {
                // Solo actualizamos el valor del campo sin validar
                setStreetNumber(e.target.value);
              }}
              onBlur={(e) => {
                const newNumber = e.target.value;
                
                // Validar el número si tenemos una dirección seleccionada y la validación está activada
                if (validateNumber && selectedAddress && newNumber.trim() !== "") {
                  console.log("Validando número con la API...");
                  
                  // Obtener la calle de la dirección seleccionada
                  const street = selectedAddress.components.road;
                  
                  if (street) {
                    // Mostrar estado de carga mientras se valida
                    setLoading(true);
                    
                    // Construir la consulta para validar el número
                    // Formato: "Calle Mayor 10, Madrid, España"
                    const city = selectedAddress.components.city || 
                                selectedAddress.components.town || 
                                selectedAddress.components.village || '';
                    
                    const validationQuery = `${street} ${newNumber}, ${city}, España`;
                    console.log("Consulta de validación:", validationQuery);
                    
                    // Hacer la petición a la API para validar el número
                    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(validationQuery)}&key=${import.meta.env.VITE_OPENCAGE_API_KEY}&language=es&countrycode=es&limit=1&no_annotations=1`)
                      .then(response => response.json())
                      .then(data => {
                        setLoading(false);
                        console.log("Respuesta de validación:", data);
                        
                        // Comprobar si la API devuelve resultados válidos
                        if (data.results && data.results.length > 0) {
                          // Comprobar si el número de casa coincide
                          const validatedNumber = data.results[0].components.house_number;
                          
                          if (validatedNumber && validatedNumber === newNumber) {
                            console.log("Número validado correctamente");
                            setNumberError(false);
                          } else {
                            console.log("Número no válido para esta dirección");
                            setNumberError(true);
                          }
                        } else {
                          // Si no hay resultados, el número probablemente no existe
                          console.log("No se encontraron resultados para este número");
                          setNumberError(true);
                        }
                      })
                      .catch(error => {
                        console.error("Error al validar el número:", error);
                        setLoading(false);
                        // En caso de error, no mostramos error de validación
                        setNumberError(false);
                      });
                  } else {
                    // Si no hay calle, no podemos validar
                    setNumberError(false);
                  }
                } else {
                  console.log("No se puede validar:", { 
                    validateNumber, 
                    hasSelectedAddress: !!selectedAddress,
                    hasNumber: newNumber.trim() !== ""
                  });
                  // Si no hay validación o no hay dirección seleccionada, no mostramos error
                  setNumberError(false);
                }
                
                // Actualizar el resultado con el nuevo número
                if (onSelect && selectedAddress) {
                  const updatedResult: AddressResult = {
                    ...selectedAddress,
                    components: {
                      ...selectedAddress.components,
                      house_number: newNumber
                    }
                  };
                  onSelect(updatedResult);
                }
              }}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(74,94,50)] ${numberError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            />
            {numberError && (
              <p className="mt-1 text-xs text-red-500">Número no coincide</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressAutocomplete;
