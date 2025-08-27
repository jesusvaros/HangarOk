import React from 'react';

const FinalCTASection: React.FC = () => {
  return (
    <section className="w-full bg-blue-50 py-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-6 text-3xl font-bold">¿Listo para verificar caseros?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          Instala nuestra extensión de Chrome y empieza a evaluar caseros mientras navegas.
        </p>
        <a
          href="https://chrome.google.com/webstore/category/extensions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
        >
          Instalar extensión
        </a>
      </div>
    </section>
  );
};

export default FinalCTASection;
