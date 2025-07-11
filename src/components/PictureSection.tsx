import React from 'react';

const PictureSection: React.FC = () => {
  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-6 text-3xl font-bold">Nuestra Misión</h2>
        <div className="mx-auto flex aspect-video max-w-2xl items-center justify-center rounded-lg bg-gray-200 shadow-md">
          <div className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-4 h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg">Imagen por añadir</p>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Trabajamos para crear un mercado de alquiler más transparente y justo para todos.
        </p>
      </div>
    </section>
  );
};

export default PictureSection;
