import React from 'react';
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  HandThumbUpIcon
} from '@heroicons/react/24/outline';

const steps = [
  {
    Icon: MagnifyingGlassIcon,
    title: 'Busca la dirección',
    text: 'Introduce el domicilio del anuncio para ver reseñas.'
  },
  {
    Icon: PencilSquareIcon,
    title: 'Comparte tu experiencia',
    text: 'Añade una opinión anónima sobre tu casero.'
  },
  {
    Icon: HandThumbUpIcon,
    title: 'Ayuda a la comunidad',
    text: 'Tu reseña orienta a otros inquilinos.'
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-10 text-center text-3xl font-bold">Cómo funciona</h2>
        <div className="grid gap-8 text-center md:grid-cols-3">
          {steps.map(({ Icon, title, text }) => (
            <div key={title} className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4A5E32]/10">
                <Icon className="h-8 w-8 text-[#4A5E32]" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{title}</h3>
              <p className="max-w-xs text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
