import React from 'react';
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    Icon: MagnifyingGlassIcon,
    text: 'Detecta automáticamente datos de contacto del anuncio'
  },
  {
    Icon: ChatBubbleLeftRightIcon,
    text: 'Comprueba si hay reseñas previas'
  },
  {
    Icon: PencilSquareIcon,
    text: 'Aporta tu experiencia en segundos'
  }
];

const ChromeStoreSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 md:flex-row">
        <div className="text-center md:w-1/2 md:text-left">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Instala nuestra extensión</h2>
          <p className="mb-8 text-lg text-gray-700">
            Verifica caseros directamente mientras navegas por portales de alquiler. Nuestra extensión detecta al propietario y te muestra opiniones sin salir de la página.
          </p>
          <ul className="mb-8 space-y-4">
            {features.map(({ Icon, text }) => (
              <li key={text} className="flex items-start justify-center md:justify-start">
                <Icon className="mr-3 h-6 w-6 flex-shrink-0 text-[#4A5E32]" />
                <span className="text-gray-700">{text}</span>
              </li>
            ))}
          </ul>
          <a
            href="https://chrome.google.com/webstore/category/extensions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-[#4A5E32] px-8 py-3 text-lg font-medium text-white shadow-md transition-colors hover:bg-[#3B4C28]"
          >
            <svg
              className="mr-2 h-6 w-6"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24" cy="24" r="21" fill="white" />
              <path d="M24 4v16h19.16A20 20 0 0024 4z" fill="#EA4335" />
              <path d="M24 44c8.08 0 15.06-4.77 18.3-11.7H24V44z" fill="#34A853" />
              <path d="M5.7 32.3A20 20 0 014 24a20 20 0 016-14.2l9.7 16.5-14 6z" fill="#FBBC05" />
              <path d="M43.16 20H24L14.3 3.8A20 20 0 0143.16 20z" fill="#4285F4" />
              <circle cx="24" cy="24" r="7" fill="white" />
              <circle cx="24" cy="24" r="5" fill="#4285F4" />
            </svg>
            Instalar desde Chrome Web Store
          </a>
        </div>
        <div className="md:w-1/2">
          <img
            src="/chrome-extension-placeholder.svg"
            alt="Vista previa de la extensión"
            className="w-full rounded-xl border border-gray-200 shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default ChromeStoreSection;
