import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import 'leaflet/dist/leaflet.css';
import { addOpinion, getOpinionsByCaseroHash } from './supabaseClient';
import type { Opinion } from './supabaseClient';
import { calculateHash, generateRandomCoordinates } from './utils';
import { opinionSchema } from './schema';
import type { OpinionFormData } from './schema';
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

function App() {
  const [searchId, setSearchId] = useState('');
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<OpinionFormData>({
    resolver: zodResolver(opinionSchema),
    defaultValues: {
      rating: 3,
    }
  });

  // Search for opinions
  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Por favor, introduce un identificador');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const hash = await calculateHash(searchId);
      const fetchedOpinions = await getOpinionsByCaseroHash(hash);
      
      // Add random coordinates to opinions without location
      const opinionsWithCoords = fetchedOpinions.map(opinion => {
        if (!opinion.lat || !opinion.lng) {
          const coords = generateRandomCoordinates();
          return { ...opinion, lat: coords.lat, lng: coords.lng };
        }
        return opinion;
      });
      
      setOpinions(opinionsWithCoords);
      
      if (opinionsWithCoords.length === 0) {
        setError('No se encontraron opiniones para este casero');
      }
    } catch (err) {
      setError('Error al buscar opiniones');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit new opinion
  const onSubmit = async (data: OpinionFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const caseroHash = await calculateHash(data.caseroId);
      const coords = generateRandomCoordinates();
      
      await addOpinion({
        casero_hash: caseroHash,
        texto: data.texto,
        rating: data.rating,
        lat: coords.lat,
        lng: coords.lng
      });
      
      reset();
      setShowForm(false);
      
      // Refresh opinions if we're viewing the same casero
      if (data.caseroId === searchId) {
        handleSearch();
      }
    } catch (err) {
      setError('Error al guardar la opinión');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate center of map based on opinions
  const mapCenter = opinions.length > 0
    ? [
        opinions.reduce((sum, op) => sum + (op.lat || 0), 0) / opinions.length,
        opinions.reduce((sum, op) => sum + (op.lng || 0), 0) / opinions.length
      ]
    : [40.416775, -3.703790]; // Default to Madrid

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-800">Casero Verificado</h1>
        <p className="text-center text-gray-600">Consulta y comparte opiniones anónimas sobre caseros</p>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Search Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Buscar opiniones</h2>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Email o teléfono del casero"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          
          {error && <p className="mt-2 text-red-600">{error}</p>}
        </section>

        {/* Map Section */}
        {opinions.length > 0 && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Mapa de opiniones</h2>
            
            <div className="h-[400px] rounded-md overflow-hidden">
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
                  <Marker 
                    key={opinion.id} 
                    position={[opinion.lat || 0, opinion.lng || 0]}
                  >
                    <Popup>
                      <div className="p-2">
                        <div className="mb-2">
                          {"⭐".repeat(opinion.rating)}
                        </div>
                        <p className="text-sm">{opinion.texto}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(opinion.created_at || '').toLocaleDateString()}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </section>
        )}

        {/* Add Opinion Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {showForm ? 'Cancelar' : 'Añadir nueva opinión'}
          </button>
        </div>

        {/* Add Opinion Form */}
        {showForm && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Añadir opinión</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="caseroId" className="block text-sm font-medium text-gray-700 mb-1">
                  Identificador del casero
                </label>
                <input
                  id="caseroId"
                  type="text"
                  {...register('caseroId')}
                  placeholder="Email o teléfono"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.caseroId && (
                  <p className="mt-1 text-sm text-red-600">{errors.caseroId.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="texto" className="block text-sm font-medium text-gray-700 mb-1">
                  Tu opinión
                </label>
                <textarea
                  id="texto"
                  {...register('texto')}
                  rows={4}
                  placeholder="Comparte tu experiencia con este casero..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.texto && (
                  <p className="mt-1 text-sm text-red-600">{errors.texto.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Puntuación
                </label>
                <select
                  id="rating"
                  {...register('rating', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 ⭐ - Muy malo</option>
                  <option value={2}>2 ⭐⭐ - Malo</option>
                  <option value={3}>3 ⭐⭐⭐ - Regular</option>
                  <option value={4}>4 ⭐⭐⭐⭐ - Bueno</option>
                  <option value={5}>5 ⭐⭐⭐⭐⭐ - Excelente</option>
                </select>
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {isLoading ? 'Guardando...' : 'Guardar opinión'}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>

      <footer className="max-w-4xl mx-auto mt-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Casero Verificado - Todas las opiniones son anónimas</p>
      </footer>
    </div>
  );
}

export default App
