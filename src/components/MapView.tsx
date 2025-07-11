import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useSearchParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { getOpinionsByCaseroHash } from '../supabaseClient';
import type { Opinion } from '../supabaseClient';
import { calculateHash, generateRandomCoordinates } from '../utils';
import L from 'leaflet';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {
  const [searchParams] = useSearchParams();
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get caseroId from URL params
  const caseroId = searchParams.get('caseroId');

  // Calculate center of map based on opinions
  const mapCenter =
    opinions.length > 0
      ? [
          opinions.reduce((sum, op) => sum + (op.lat || 0), 0) / opinions.length,
          opinions.reduce((sum, op) => sum + (op.lng || 0), 0) / opinions.length,
        ]
      : [40.416775, -3.70379]; // Default to Madrid

  // Load opinions when caseroId changes
  useEffect(() => {
    const fetchOpinions = async () => {
      if (!caseroId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Calculate hash of caseroId for privacy
        const hash = await calculateHash(caseroId);

        // Fetch opinions for this casero
        const fetchedOpinions = await getOpinionsByCaseroHash(hash);

        // Add random coordinates to opinions without location
        const opinionsWithCoords = fetchedOpinions.map((opinion) => {
          if (!opinion.lat || !opinion.lng) {
            const coords = generateRandomCoordinates();
            return { ...opinion, lat: coords.lat, lng: coords.lng };
          }
          return opinion;
        });

        setOpinions(opinionsWithCoords);

        if (opinionsWithCoords.length === 0) {
          setError('No se encontraron opiniones para este casero.');
        }
      } catch (err) {
        console.error('Error searching opinions:', err);
        setError('Error al buscar opiniones. Por favor, inténtalo de nuevo.');
        setOpinions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpinions();
  }, [caseroId]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Mapa de Opiniones</h1>
        {caseroId && <p className="text-gray-600">Mostrando resultados para: {caseroId}</p>}
        {isLoading && <p className="text-blue-600">Cargando opiniones...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <p className="mt-2">Opiniones encontradas: {opinions.length}</p>
      </div>

      {/* Map Section */}
      <section className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <div className="h-96 overflow-hidden rounded-lg">
          <MapContainer
            center={mapCenter as [number, number]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {opinions.map((opinion) => (
              <Marker key={opinion.id} position={[opinion.lat || 0, opinion.lng || 0]}>
                <Popup>
                  <div>
                    <p className="font-semibold">Rating: {opinion.rating}/5</p>
                    <p>{opinion.texto}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>
    </div>
  );
};

export default MapView;
