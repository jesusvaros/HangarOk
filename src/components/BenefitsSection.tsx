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
        <h2 className="mb-10 text-center text-3xl font-bold">¿Por qué usar Casero Verificado?</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-lg bg-white p-6 text-center shadow-md">
              <Icon className="mx-auto mb-4 h-12 w-12 text-blue-600" />
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
