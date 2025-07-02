import React from 'react';
import { useNavigate } from 'react-router-dom';

const InputSection: React.FC = () => {
  const navigate = useNavigate();

  const handleAddReview = () => {
    navigate('/add-review');
  };

  return (
    <section className="py-16" style={{ backgroundColor: '#e1f56e' }}>
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Comparte tu experiencia con tu casero</h2>
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-gray-700 max-w-2xl">
            Ayuda a otros inquilinos compartiendo tu experiencia con tu casero, el estado de la vivienda, 
            el vecindario y más. Todas las opiniones son anónimas.
          </p>
          <button
            onClick={handleAddReview}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium mt-4"
          >
            Añadir mi opinión
          </button>
        </div>
        <p className="text-center mt-8 text-gray-700">
          Tus opiniones ayudan a crear un mercado de alquiler más transparente
        </p>
      </div>
    </section>
  );
};

export default InputSection;
