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
    <section className="w-full bg-gradient-to-b from-white to-green-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-left text-3xl font-bold">Cómo funciona</h2>
        <div className="grid gap-10 md:grid-cols-3">
          {steps.map(({ Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#4A5E32]/10">
                <Icon className="h-7 w-7 text-[#4A5E32]" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold">{title}</h3>
                <p className="text-gray-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
