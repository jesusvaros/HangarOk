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

  // Display mock data banner if we're using mock data

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-800">Casero Verificado</h1>
        <p className="text-center text-gray-600">Consulta y comparte opiniones anónimas sobre caseros</p>
      </header>

      {/* Tailwind Test Element */}
      <div className="max-w-4xl mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
        <p className="font-bold text-xl">Tailwind CSS está funcionando correctamente! 🎉</p>
        <p className="text-sm opacity-80">Este elemento de prueba utiliza múltiples clases de Tailwind</p>
      </div>

      <main className="max-w-4xl mx-auto">
        {/* Search Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Buscar opiniones</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Email o teléfono del casero"
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchId}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </section>

        {/* Map Section */}
        {opinions.length > 0 && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Opiniones encontradas: {opinions.length}</h2>
            <div className="h-96 rounded-lg overflow-hidden">
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
        )}

        {/* Add Opinion Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showForm ? 'Cancelar' : 'Añadir nueva opinión'}
          </button>
        </div>

        {/* Add Opinion Form */}
        {showForm && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Añadir opinión</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {showForm ? 'Ocultar formulario' : 'Mostrar formulario'}
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="caseroId" className="block text-sm font-medium text-gray-700 mb-1">
                  Email o teléfono del casero
                </label>
                <input
                  id="caseroId"
                  type="text"
                  {...register('caseroId')}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.caseroId && (
                  <p className="text-red-500 text-sm mt-1">{errors.caseroId.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Puntuación (1-5)
                </label>
                <input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  {...register('rating', { valueAsNumber: true })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.rating && (
                  <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="texto" className="block text-sm font-medium text-gray-700 mb-1">
                  Opinión
                </label>
                <textarea
                  id="texto"
                  {...register('texto')}
                  rows={4}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                {errors.texto && (
                  <p className="text-red-500 text-sm mt-1">{errors.texto.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando...' : 'Enviar opinión'}
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
