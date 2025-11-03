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
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="md:w-1/2 text-left">
              <h2 className="mb-6 text-3xl font-bold text-[#4A5E32]">Why we started HangarOK</h2>
              <div className="text-base text-gray-700 space-y-4 mb-8">
                <p>
                  We built it because cyclists, planners, and councils were all missing one thing: <strong>real-life data</strong>.
                </p>
                <p>
                  By sharing honest feedback — on community, safety, usability and support — we can help shape a better cycling culture across the UK.
                </p>
                <p className="text-lg font-semibold text-[#4A5E32] italic">
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
            
            {/* Image */}
            <div className="md:w-1/2">
              <img
                src="/images/hangar-photo.jpg"
                alt="Cycle hangar on street"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PictureSection;
