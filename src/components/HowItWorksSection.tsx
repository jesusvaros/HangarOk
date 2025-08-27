import React from 'react';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-8 text-3xl font-bold">Cómo funciona</h2>
        <ol className="mx-auto max-w-2xl space-y-4 text-left text-gray-600">
          <li>1. Busca una dirección para ver opiniones.</li>
          <li>2. Comparte tu experiencia con el casero.</li>
          <li>3. Ayuda a otros inquilinos con información verificada.</li>
        </ol>
      </div>
    </section>
  );
};

export default HowItWorksSection;
