import React from 'react';
import { Link } from 'react-router-dom';
import { umamiEventProps } from '../utils/analytics';

const PictureSection: React.FC = () => {
  return (
    <>
      {/* Quote Section - Standalone for impact */}
      <section className="w-full bg-gradient-to-b from-green-50 to-white py-20 md:py-44">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-xl md:text-2xl font-medium text-gray-800 italic text-center leading-relaxed">
            "We've normalised cars as invisible, but call bike hangars an eyesore.
            <br />
            <span className="block mt-4">
              HangarOK flips that — it's time the conversation got honest."
            </span>
          </p>
        </div>
      </section>

      {/* Why we started HangarOK Section */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-8 text-3xl font-bold">🚲 Why we started HangarOK</h2>
          <div className="text-lg text-gray-700 space-y-6 mb-10">
            <p>
              HangarOK is the UK's first peer-to-peer hangar review platform.
            </p>
            <p>
              We built it because cyclists, planners, and councils were all missing one thing: real-life data.
            </p>
            <p>
              By sharing honest feedback — on community, safety, usability and support — we can help shape a better cycling culture across the UK.
            </p>
            <p className="font-semibold text-xl">
              We're not just collecting stars. We're building understanding — one hangar at a time.
            </p>
          </div>
          
          <Link
            to="/add-review"
            className="inline-block rounded-lg bg-[#4A5E32] px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-[#3B4C28]"
            {...umamiEventProps('picture-section:start-review')}
          >
            Start your first review
          </Link>
        </div>
      </section>
    </>
  );
};

export default PictureSection;
