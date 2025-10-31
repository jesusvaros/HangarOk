import { Link } from 'react-router-dom';
import logoUrl from '../assets/logo_coloreado.svg';
import { umamiEventProps } from '../utils/analytics';

const HeroSection = () => {
  return (
    <section className="bg-gray-50 py-28 md:py-40">
      <div className="container mx-auto flex flex-col-reverse items-center px-4 text-center md:flex-row md:text-left">
        <div className="mt-10 md:mt-0 md:w-1/2">
          {/* Desktop: show logo on the left; hidden on mobile */}
          <div className="mx-auto hidden w-fit items-center gap-5 md:flex">
            <img src={logoUrl} alt="HangarOK" className="h-28 w-28 md:h-72 md:w-72" />
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col items-center md:items-start">
          {/* Mobile: show logo + wordmark together */}
          <div className="mb-4 flex items-center justify-center gap-4 md:hidden">
            <img src={logoUrl} alt="HangarOK" className="h-20 w-20" />
            <h1 className="text-2xl font-bold text-[#232C17]">
              Real reviews of real hangars by real riders
            </h1>
          </div>
          {/* Desktop: show only the wordmark on the right */}
          <h1 className="mb-4 text-3xl font-bold text-[#232C17] md:text-4xl hidden md:block">
            Real reviews of real hangars by real riders
          </h1>
          <p className="mb-8 text-lg text-gray-700 md:text-xl max-w-xl text-center md:text-left">
            The best test of any cycle hangar is real life - and the best reviewer is you. <br /> <b>HangarOK</b> is the home of honest, transparent hangar reviews made by real cyclists, commuters, and residents - just like you.
          </p>
          
          <Link
            to="/add-review"
            className="whitespace-nowrap inline-block rounded-lg bg-[#4A5E32] px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-[#3B4C28]"
            {...umamiEventProps('hero:cta-add-review')}
          >
            Write a review
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
