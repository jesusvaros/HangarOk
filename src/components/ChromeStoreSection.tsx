import React from 'react';
import chromeLogo from '../assets/google-chrome.svg';
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

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
    <section className="relative w-full bg-gradient-to-b from-white to-green-50 py-16 overflow-hidden">
      {/* Diagonal WIP tape overlay */}
      <div
        className="pointer-events-none select-none absolute left-1/2 top-52 z-[5] -translate-x-1/2 rotate-12"
        style={{ width: '120%' }}
        aria-hidden
      >
        <div
          className="w-full rounded-md shadow-md"
          style={{ backgroundColor: 'rgb(225, 245, 110)' }}
        >
          <p className="px-6 py-2 text-center text-base font-extrabold tracking-widest text-black max-h-9 overflow-hidden">
            EN DESARROLLO EN DESARROLLO EN DESARROLLO EN DESARROLLO EN DESARROLLO EN DESARROLLO EN DESARROLLO EN DESARROLLO EN DESARROLLO EN DESARROLLO EN DESARROLLO EN DESARROLLO EN DESARROLLOEN DESARROLLO EN DESARROLLO EN DESARROLLO EN DESARROLLO EN DESARROLLO EN DESARROLLO
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 md:flex-row">
        <div className="md:w-1/2">
          <img
            src="/chrome-extension-placeholder.svg"
            alt="Vista previa de la extensión"
            className="w-full rounded-xl border border-gray-200 shadow-xl"
          />
        </div>
        <div className="md:w-1/2 text-left">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Instala nuestra extensión</h2>
          <p className="mb-8 text-lg text-gray-700">
            Verifica caseros directamente mientras navegas por portales de alquiler. Nuestra extensión detecta al propietario y te muestra opiniones sin salir de la página.
          </p>
          <ul className="mb-8 space-y-4">
            {features.map(({ Icon, text }) => (
              <li key={text} className="flex items-start">
                <Icon className="mr-3 h-6 w-6 flex-shrink-0 text-[#4A5E32]" />
                <span className="text-gray-700">{text}</span>
              </li>
            ))}
          </ul>
          <Link
            to="https://chrome.google.com/webstore/category/extensions"
            target="_self"
            rel="noopener noreferrer"
            aria-disabled
            onClick={e => { e.preventDefault(); e.stopPropagation(); }}
            tabIndex={-1}
            className="inline-flex items-center rounded-lg bg-[#4A5E32] px-8 py-3 text-lg font-medium text-white opacity-60 cursor-not-allowed shadow-md"
            title="Próximamente"
          >
            <img src={chromeLogo} alt="Google Chrome" className="mr-3 h-6 w-6" />
            Instalar extensión
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ChromeStoreSection;
