import React from 'react';

const ChromeStoreSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-6 text-3xl font-bold">Instala nuestra extensión</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          Verifica caseros directamente mientras navegas por sitios de alquiler con nuestra
          extensión de Chrome.
        </p>
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
    </section>
  );
};

export default ChromeStoreSection;
