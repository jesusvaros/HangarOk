import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { calculateHash, generateRandomCoordinates } from '../utils';
import { addOpinion } from '../supabaseClient';

// Define the schema for the review form
const reviewSchema = z.object({
  caseroId: z.string().min(1, 'Este campo es obligatorio'),
  fullName: z.string().min(1, 'Este campo es obligatorio'),
  email: z.string().email('Introduce un email válido'),
  address: z.string().min(1, 'Este campo es obligatorio'),
  caseroOpinion: z.string().min(10, 'La opinión debe tener al menos 10 caracteres'),
  houseOpinion: z.string().min(10, 'La opinión debe tener al menos 10 caracteres'),
  neighborhoodOpinion: z.string().min(10, 'La opinión debe tener al menos 10 caracteres'),
  neighborsOpinion: z.string().min(10, 'La opinión debe tener al menos 10 caracteres'),
  caseroRating: z.number().min(1).max(5),
  houseRating: z.number().min(1).max(5),
  neighborhoodRating: z.number().min(1).max(5),
  neighborsRating: z.number().min(1).max(5),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const AddReviewForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get address from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const addressFromUrl = queryParams.get('address') || '';
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      caseroRating: 3,
      houseRating: 3,
      neighborhoodRating: 3,
      neighborsRating: 3,
      address: addressFromUrl,
    }
  });
  
  // Set address from URL when component mounts
  useEffect(() => {
    if (addressFromUrl) {
      setValue('address', addressFromUrl);
    }
  }, [addressFromUrl, setValue]);

  const onSubmit = async (data: ReviewFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const caseroHash = await calculateHash(data.caseroId);
      const coords = generateRandomCoordinates();
      
      // Combine all opinions into one text
      const combinedOpinion = `
        Opinión sobre el casero: ${data.caseroOpinion}
        
        Opinión sobre la vivienda: ${data.houseOpinion}
        
        Opinión sobre el barrio: ${data.neighborhoodOpinion}
        
        Opinión sobre los vecinos: ${data.neighborsOpinion}
        
        Valoraciones:
        - Casero: ${data.caseroRating}/5
        - Vivienda: ${data.houseRating}/5
        - Barrio: ${data.neighborhoodRating}/5
        - Vecinos: ${data.neighborsRating}/5
      `;
      
      // Calculate average rating
      const avgRating = Math.round(
        (data.caseroRating + data.houseRating + data.neighborhoodRating + data.neighborsRating) / 4
      );
      
      await addOpinion({
        casero_hash: caseroHash,
        texto: combinedOpinion,
        rating: avgRating,
        lat: coords.lat,
        lng: coords.lng
      });
      
      // Navigate to map view to see the new opinion
      navigate(`/map?caseroId=${encodeURIComponent(data.caseroId)}`);
    } catch (err) {
      setError('Error al guardar la opinión. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const RatingSlider = ({ name, label }: { name: keyof ReviewFormData, label: string }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} (1-5)
      </label>
      <div className="flex items-center gap-4">
        <span className="text-sm">1</span>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          {...register(name, { valueAsNumber: true })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm">5</span>
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Añadir una nueva opinión</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="caseroId" className="block text-sm font-medium text-gray-700 mb-1">
              Email o teléfono del casero *
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
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo del casero *
            </label>
            <input
              id="fullName"
              type="text"
              {...register('fullName')}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Tu email (no será publicado) *
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección de la vivienda *
            </label>
            <input
              id="address"
              type="text"
              {...register('address')}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Opiniones</h2>
          
          <div className="mb-4">
            <label htmlFor="caseroOpinion" className="block text-sm font-medium text-gray-700 mb-1">
              Opinión sobre el casero *
            </label>
            <textarea
              id="caseroOpinion"
              {...register('caseroOpinion')}
              rows={4}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            {errors.caseroOpinion && (
              <p className="text-red-500 text-sm mt-1">{errors.caseroOpinion.message}</p>
            )}
          </div>
          
          <RatingSlider name="caseroRating" label="Valoración del casero" />
          
          <div className="mb-4">
            <label htmlFor="houseOpinion" className="block text-sm font-medium text-gray-700 mb-1">
              Opinión sobre la vivienda *
            </label>
            <textarea
              id="houseOpinion"
              {...register('houseOpinion')}
              rows={4}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            {errors.houseOpinion && (
              <p className="text-red-500 text-sm mt-1">{errors.houseOpinion.message}</p>
            )}
          </div>
          
          <RatingSlider name="houseRating" label="Valoración de la vivienda" />
          
          <div className="mb-4">
            <label htmlFor="neighborhoodOpinion" className="block text-sm font-medium text-gray-700 mb-1">
              Opinión sobre el barrio *
            </label>
            <textarea
              id="neighborhoodOpinion"
              {...register('neighborhoodOpinion')}
              rows={4}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            {errors.neighborhoodOpinion && (
              <p className="text-red-500 text-sm mt-1">{errors.neighborhoodOpinion.message}</p>
            )}
          </div>
          
          <RatingSlider name="neighborhoodRating" label="Valoración del barrio" />
          
          <div className="mb-4">
            <label htmlFor="neighborsOpinion" className="block text-sm font-medium text-gray-700 mb-1">
              Opinión sobre los vecinos *
            </label>
            <textarea
              id="neighborsOpinion"
              {...register('neighborsOpinion')}
              rows={4}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            {errors.neighborsOpinion && (
              <p className="text-red-500 text-sm mt-1">{errors.neighborsOpinion.message}</p>
            )}
          </div>
          
          <RatingSlider name="neighborsRating" label="Valoración de los vecinos" />
        </div>
        
        <div className="flex justify-between items-center pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Enviando...' : 'Enviar opinión'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReviewForm;
