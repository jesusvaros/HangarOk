import React from 'react';

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
          className="w-full rounded-md shadow-md opacity-90"
          style={{ backgroundColor: 'rgb(225, 245, 110)' }}
        >
          <p className="px-6 py-2 text-center text-base font-extrabold tracking-widest text-black max-h-9 overflow-hidden">
           IN DEVELOPMENT IN DEVELOPMENT IN DEVELOPMENT IN DEVELOPMENT IN DEVELOPMENT IN DEVELOPMENT IN DEVELOPMENT IN DEVELOPMENT IN DEVELOPMENT IN DEVELOPMENT IN DEVELOPMENT IN DEVELOPMENT
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
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">📊 In development: "Hangar Health" data dashboard</h2>
          <p className="mb-8 text-lg text-gray-700">
            A live dashboard showing hangar user satisfaction — powered by your reviews.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChromeStoreSection;
