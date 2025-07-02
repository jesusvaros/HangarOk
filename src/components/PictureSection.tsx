import React from 'react';

const PictureSection: React.FC = () => {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Nuestra Misión</h2>
        <div className="aspect-video bg-gray-200 max-w-2xl mx-auto rounded-lg shadow-md flex items-center justify-center">
          <div className="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">Imagen por añadir</p>
          </div>
        </div>
        <p className="text-lg mt-6 text-gray-600 max-w-2xl mx-auto">
          Trabajamos para crear un mercado de alquiler más transparente y justo para todos.
        </p>
      </div>
    </section>
  );
};

export default PictureSection;
