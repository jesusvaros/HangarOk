import React from 'react';
import { ShieldCheckIcon, ClockIcon, UsersIcon, BoltIcon } from '@heroicons/react/24/outline';

const benefits = [
  {
    Icon: ShieldCheckIcon,
    title: 'Caseros verificados',
    text: 'Consulta reseñas reales antes de alquilar.'
  },
  {
    Icon: ClockIcon,
    title: 'Ahorra tiempo',
    text: 'Encuentra información confiable al instante.'
  },
  {
    Icon: UsersIcon,
    title: 'Comunidad anónima',
    text: 'Comparte experiencias de manera segura.'
  },
  {
    Icon: BoltIcon,
    title: 'Actualizaciones inmediatas',
    text: 'Las nuevas reseñas se publican al momento.'
  }
];

const BenefitsSection: React.FC = () => {
  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-10 text-left text-3xl font-bold">¿Por qué usar Casero Verificado?</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="flex flex-col rounded-lg bg-white p-6 text-left shadow-md transition-transform hover:-translate-y-1"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4A5E32]/10">
                <Icon className="h-8 w-8 text-[#4A5E32]" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{title}</h3>
              <p className="text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
