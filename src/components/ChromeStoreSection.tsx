import React from 'react';

const ChromeStoreSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <img
            src="/chrome-extension-placeholder.svg"
            alt="Vista previa de la extensión"
            className="w-full max-w-md rounded-lg shadow-md"
          />
          <div className="text-center md:w-1/2 md:text-left">
            <h2 className="mb-6 text-3xl font-bold">Instala nuestra extensión</h2>
            <p className="mb-4 text-lg text-gray-600">
              Verifica caseros directamente mientras navegas por portales de alquiler. Nuestra extensión detecta al propietario y te muestra opiniones sin salir de la página.
            </p>
            <ul className="mb-6 list-inside list-disc space-y-2 text-left text-gray-600">
              <li>Detecta automáticamente datos de contacto del anuncio</li>
              <li>Comprueba si hay reseñas previas</li>
              <li>Aporta tu experiencia en segundos</li>
            </ul>
            <a
              href="https://chrome.google.com/webstore/category/extensions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
            >
              <svg
                className="mr-2 h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 21.5c-5.246 0-9.5-4.254-9.5-9.5S6.754 2.5 12 2.5s9.5 4.254 9.5 9.5-4.254 9.5-9.5 9.5z" />
                <path d="M12 4.062a7.938 7.938 0 100 15.876 7.938 7.938 0 000-15.876zm0 3.954a3.985 3.985 0 110 7.97 3.985 3.985 0 010-7.97z" />
              </svg>
              Instalar desde Chrome Web Store
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChromeStoreSection;
