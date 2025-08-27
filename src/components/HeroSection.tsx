import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-gray-50 py-28 md:py-40">
      <div className="container mx-auto flex flex-col-reverse items-center px-4 text-center md:flex-row md:text-left">
        <div className="mt-10 md:mt-0 md:w-1/2">
          <img
            src="/vite.svg"
            alt="Ilustración casero verificado"
            className="mx-auto w-60 md:w-80"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="mb-6 text-5xl font-extrabold md:text-6xl">Casero Verificado</h1>
          <p className="mb-8 text-xl text-gray-700 md:text-2xl">
            Transparencia en el mercado de alquiler: descubre cómo se comportan los caseros y comparte tu experiencia.
          </p>
          <Link
            to="/add-review"
            className="inline-block rounded-lg bg-[#4A5E32] px-10 py-4 text-lg font-semibold text-white transition-colors hover:bg-[#3B4C28]"
          >
            Escribir review
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

