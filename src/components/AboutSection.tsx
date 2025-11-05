import React from 'react';
import { Link } from 'react-router-dom';
import { umamiEventProps } from '../utils/analytics';

const AboutSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="bg-gradient-to-br from-[#4A5E32] to-[#3B4C28] rounded-2xl shadow-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h2 className="mb-4 text-4xl font-bold">About HangarOK</h2>
            <div className="h-1 w-24 bg-[#E1F56E] mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed mb-10">
            <p className="text-white/95">
              <strong className="text-[#E1F56E]">HangarOK</strong> is the UK's first rider-to-rider review platform for cycle hangars, built to provide a rich layer of data across the cycling industry that doesn't currently exist.
            </p>
            <p className="text-white/95">
              All reviews are accessible, anonymised, and aggregated into the <strong className="text-[#E1F56E]">HangarOK Index</strong>, a live measure of how fair, safe, and well run cycle hangars are across the UK.
            </p>
            <p className="text-2xl font-bold text-center text-[#E1F56E] py-4">
              HangarOK is the voice of everyday riders.
            </p>
            <p className="text-white/90 text-center italic text-xl">
              We're only just getting started, and there's so much more to come.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/add-review"
              className="inline-block rounded-lg bg-[#E1F56E] px-8 py-3 text-lg font-bold text-[#232C17] transition-all hover:bg-white hover:scale-105 shadow-lg"
              {...umamiEventProps('about:start-reviewing')}
            >
              Start reviewing
            </Link>
            <Link
              to="/map"
              className="inline-block rounded-lg border-2 border-white px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-white hover:text-[#4A5E32] hover:scale-105"
              {...umamiEventProps('about:explore-hangars')}
            >
              Explore your local hangars
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
