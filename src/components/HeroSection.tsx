import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto flex flex-col items-center px-4 text-center md:flex-row md:text-left">
        <div className="md:w-1/2">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Casero Verificado</h1>
          <p className="mb-6 text-lg text-gray-700 md:text-xl">
            Encuentra y comparte opiniones sobre propietarios y experiencias de alquiler.
          </p>
          <Link
            to="/add-review"
            className="inline-block rounded-lg bg-[#4A5E32] px-8 py-3 text-white transition-colors hover:bg-[#3B4C28]"
          >
            Escribir review
          </Link>
        </div>
        <div className="mt-10 md:mt-0 md:w-1/2">
          <img src="/vite.svg" alt="Ilustración casero verificado" className="mx-auto w-48 md:w-64" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

