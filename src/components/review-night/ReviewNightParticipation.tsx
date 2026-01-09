import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { reviewNightTheme } from './ReviewNightTheme';

const ReviewNightParticipation = () => {
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
    <section className="py-24 overflow-hidden" style={{ backgroundColor: reviewNightTheme.bgDark }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
              Taking part is <span className="text-transparent bg-clip-text" style={{ backgroundImage: reviewNightTheme.gradientGold }}>simple and fair</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Review Night is for real riders. One simple proof ensures the data remains honest and representative.
            </p>
          </motion.div>
          
          {/* Participation Cards */}
          <div className="relative mb-16">
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex md:grid md:grid-cols-2 gap-6 md:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar md:overflow-visible"
            >
              {[
                {
                  title: "Current Hangar Users",
                  desc: "A photo of your key or digital access confirmation. Share your daily storage experience.",
                  icon: (
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                  gradient: reviewNightTheme.gradientGreen
                },
                {
                  title: "Waitlist Hopefuls",
                  desc: "A screenshot of your council or operator confirmation. Help us show the real demand for space.",
                  icon: (
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  gradient: reviewNightTheme.gradientGold
                }
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="min-w-[calc(100vw-3rem)] max-w-[calc(100vw-3rem)] md:min-w-0 md:max-w-none snap-center relative p-8 md:p-10 rounded-3xl border border-white/10 flex-shrink-0"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                >
                  <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ background: card.gradient }}
                    >
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
                      <p className="text-lg text-gray-400 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Scroll Indicator for mobile */}
            <div className="flex md:hidden justify-center gap-3 mt-2">
              {[0, 1].map((i) => (
                <div 
                  key={i} 
                  className="h-1.5 transition-all duration-300 rounded-full" 
                  style={{ 
                    width: activeIndex === i ? '24px' : '6px',
                    backgroundColor: activeIndex === i ? reviewNightTheme.accent : 'rgba(255,255,255,0.1)' 
                  }} 
                />
              ))}
            </div>
          </div>
          
          {/* Privacy Note */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl border border-white/10 bg-white/5 text-center md:text-left relative group overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 shadow-inner">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 font-bold mb-1 uppercase tracking-wider text-xs">Privacy Guaranteed</p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Proof is only used to verify eligibility by our team. All reviews are published <strong>completely anonymously</strong> on the map.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReviewNightParticipation;
