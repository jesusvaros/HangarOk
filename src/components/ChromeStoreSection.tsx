import React from 'react';

const ChromeStoreSection: React.FC = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Instala nuestra extensión</h2>
        <p className="text-lg mb-8 text-gray-600 max-w-2xl mx-auto">
          Verifica caseros directamente mientras navegas por sitios de alquiler con nuestra extensión de Chrome.
        </p>
        <a 
          href="https://chrome.google.com/webstore/category/extensions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg font-medium"
        >
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
