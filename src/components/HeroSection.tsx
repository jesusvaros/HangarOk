import { Link } from 'react-router-dom';
import wordmarkUrl from '../assets/caserook_letras.svg';
import logoUrl from '../assets/logo_coloreado.svg';
import { umamiEventProps } from '../utils/analytics';

const HeroSection = () => {
  return (
    <section className="bg-gray-50 py-28 md:py-40">
      <div className="container mx-auto flex flex-col-reverse items-center px-4 text-center md:flex-row md:text-left">
        <div className="mt-10 md:mt-0 md:w-1/2">
          {/* Desktop: show logo on the left; hidden on mobile */}
          <div className="mx-auto hidden w-fit items-center gap-5 md:flex">
            <img src={logoUrl} alt="CaseroOk" className="h-28 w-28 md:h-72 md:w-72" />
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col items-center">
          {/* Mobile: show logo + wordmark together */}
          <div className="mb-4 flex items-center justify-center gap-4 md:hidden">
            <img src={logoUrl} alt="CaseroOk" className="h-20 w-20" />
            <img src={wordmarkUrl} alt="CaseroOk" className="h-12" />
          </div>
          {/* Desktop: show only the wordmark on the right */}
          <img src={wordmarkUrl} alt="CaseroOk" className="hidden md:inline-block md:h-24 mt-6" />
          <p className="mb-8 text-xl text-gray-700 md:text-2xl">
            Transparencia en el mercado de alquiler: descubre cómo se comportan los caseros y comparte tu experiencia.
          </p>
          <Link
            to="/add-review"
            className="w-fit self-center whitespace-nowrap inline-block rounded-lg bg-[#4A5E32] px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-[#3B4C28]"
            {...umamiEventProps('hero:cta-add-review')}
          >
            Escribir review
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
