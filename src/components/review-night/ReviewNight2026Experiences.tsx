import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { reviewNightTheme } from './ReviewNightTheme';

const ReviewNight2026Experiences = () => {
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
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: reviewNightTheme.bgGray }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: reviewNightTheme.textPrimary }}>
              2026 <span className="text-transparent bg-clip-text" style={{ backgroundImage: reviewNightTheme.gradientGold }}>Riding Experiences</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Every Review Night participant is eligible to be part of our seasonal riding community events.
            </p>
          </motion.div>
          
          <div className="relative">
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex md:grid md:grid-cols-2 gap-6 md:gap-10 mb-8 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar md:overflow-visible"
            >
              {[
                {
                  title: "London to Paris",
                  date: "17 July – 19 July 2026",
                  desc: "An iconic cycling journey between two world-class cities. Fully supported and community-driven.",
                  icon: (
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  gradient: reviewNightTheme.gradientGreen
                },
                {
                  title: "Cyprus Villages",
                  date: "22 Oct – 26 Oct 2026",
                  desc: "Discover Mediterranean cycling culture and traditional village life in the foothills of Cyprus.",
                  icon: (
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  gradient: reviewNightTheme.gradientGold
                }
              ].map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="min-w-[calc(100vw-3rem)] max-w-[calc(100vw-3rem)] md:min-w-0 md:max-w-none snap-center relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-gray-100 flex-shrink-0"
                >
                  <div 
                    className="h-56 flex items-center justify-center relative overflow-hidden"
                    style={{ background: exp.gradient }}
                  >
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10 scale-150 rotate-12">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
                        <pattern id={`pattern-exp-${i}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="1" />
                        </pattern>
                        <rect width="100" height="100" fill={`url(#pattern-exp-${i})`} />
                      </svg>
                    </div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-4">
                        {exp.icon}
                      </div>
                      <h3 className="text-3xl font-black text-white">{exp.title}</h3>
                    </div>
                  </div>
                  <div className="p-10">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5" style={{ color: reviewNightTheme.accent }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <p className="font-black text-sm uppercase tracking-widest" style={{ color: reviewNightTheme.textSecondary }}>{exp.date}</p>
                    </div>
                    <p className="text-xl leading-relaxed" style={{ color: reviewNightTheme.textPrimary }}>{exp.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Scroll Indicator for mobile */}
            <div className="flex md:hidden justify-center gap-3 mt-4">
              {[0, 1].map((i) => (
                <div 
                  key={i} 
                  className="h-1.5 transition-all duration-300 rounded-full" 
                  style={{ 
                    width: activeIndex === i ? '24px' : '6px',
                    backgroundColor: activeIndex === i ? reviewNightTheme.accent : '#E5E7EB' 
                  }} 
                />
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-[2rem] text-center relative border-2 border-dashed overflow-hidden mt-12"
            style={{ borderColor: reviewNightTheme.borderDark }}
          >
            <p className="text-xl font-bold italic" style={{ color: reviewNightTheme.textSecondary }}>
              "Each experience is designed and supported by HangarOK to build long-term cycling community."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReviewNight2026Experiences;
