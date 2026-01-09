import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { reviewNightTheme } from './ReviewNightTheme';
import mapReviewsUrl from '../../assets/landing/map-reviews.png';

const ReviewNightWhyItMatters = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth * 0.85;
      const index = Math.round(scrollPosition / cardWidth);
      setActiveIndex(index);
    }
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-black leading-tight" style={{ color: reviewNightTheme.textPrimary }}>
                Why Review Night <br/>
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: reviewNightTheme.gradientGreen }}>Matters</span>
              </h2>
              
              <div className="space-y-6 text-xl text-gray-700 leading-relaxed">
                <p>
                  HangarOK exists to surface real experiences and bridge the gap between riders and decision-makers.
                </p>
                <div 
                  className="p-6 rounded-2xl border-l-8" 
                  style={{ backgroundColor: `${reviewNightTheme.primary}05`, borderColor: reviewNightTheme.primary }}
                >
                  <p className="font-black text-2xl" style={{ color: reviewNightTheme.primary }}>
                    Review Night brings them together.
                  </p>
                </div>
                <p>
                  By opening reviews for a limited time, we capture a real-time snapshot of how cycle hangars are actually working across the city, creating a permanent, public record that helps make cycling safer for everyone.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="relative mb-8">
                <div 
                  className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-10"
                  style={{ backgroundColor: reviewNightTheme.primary }}
                />
                <img
                  src={mapReviewsUrl}
                  alt="Map showing hangar reviews"
                  className="relative w-full rounded-[1.5rem] shadow-xl border border-gray-100"
                />
              </div>

              <div className="relative">
                <div 
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex md:grid md:grid-cols-1 gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar md:overflow-visible"
                >
                  {[
                    { 
                      title: "Time-stamped Snapshots", 
                      desc: "Every review is locked to the same moment in time.",
                      color: reviewNightTheme.accent 
                    },
                    { 
                      title: "Instant Transparency", 
                      desc: "Data appears immediately on the public HangarOK map.",
                      color: reviewNightTheme.primary 
                    },
                    { 
                      title: "Permanent Record", 
                      desc: "The snapshot is saved as an immutable record of city infrastructure.",
                      color: reviewNightTheme.textPrimary 
                    }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      className="min-w-[calc(100vw-3rem)] max-w-[calc(100vw-3rem)] md:min-w-0 md:max-w-none snap-center p-8 rounded-2xl border bg-white shadow-sm flex items-start gap-6 transition-all flex-shrink-0"
                      style={{ borderColor: reviewNightTheme.border }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full mt-2 flex-shrink-0" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <div>
                        <h3 className="text-xl font-bold mb-1" style={{ color: reviewNightTheme.textPrimary }}>{item.title}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Scroll Indicator for mobile */}
                <div className="flex md:hidden justify-center gap-3 mt-4">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i} 
                      className="h-1.5 transition-all duration-300 rounded-full" 
                      style={{ 
                        width: activeIndex === i ? '24px' : '6px',
                        backgroundColor: activeIndex === i ? reviewNightTheme.primary : '#E5E7EB' 
                      }} 
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewNightWhyItMatters;
