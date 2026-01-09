import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { reviewNightTheme } from './ReviewNightTheme';
import hangarImage1 from '../../assets/landing/hangar-real-image-1.jpg';
import hangarImage2 from '../../assets/landing/hangar-real-image-2.jpg';
import hangarImage3 from '../../assets/landing/hangar-real-image-3.jpg';
import riderImage from '../../assets/landing/people-rinding-bike-1.jpeg';

const ReviewNightVisualProof = () => {
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
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: reviewNightTheme.bgWhite }}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 -skew-x-12 transform translate-x-1/2 z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: reviewNightTheme.textPrimary }}>
              Real hangars. Real riders. <span className="text-transparent bg-clip-text" style={{ backgroundImage: reviewNightTheme.gradientGreen }}>Real reviews.</span>
            </h2>
            <div className="w-24 h-1 mx-auto" style={{ background: reviewNightTheme.gradientGold }} />
          </motion.div>
          
          {/* Hangar images grid - Horizontal scroll on mobile */}
          <div className="relative mb-24">
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar md:overflow-visible"
            >
              {[
                { img: hangarImage1, title: "Cycle Hangar Location", desc: "Direct from the streets of London" },
                { img: hangarImage2, title: "Daily Storage Solution", desc: "Where real life happens" },
                { img: hangarImage3, title: "Security & Access", desc: "Verified community feedback" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="min-w-[calc(100vw-3rem)] max-w-[calc(100vw-3rem)] md:min-w-0 md:max-w-none snap-center relative rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
                >
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <p className="text-xl font-bold mb-1">{item.title}</p>
                    <p className="text-sm opacity-80">{item.desc}</p>
                  </div>
                  <div 
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: reviewNightTheme.gradientGold }}
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
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
                    backgroundColor: activeIndex === i ? reviewNightTheme.accent : '#E5E7EB' 
                  }} 
                />
              ))}
            </div>
          </div>
          
          {/* Data Viz/Proof Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-3xl md:text-4xl font-bold" style={{ color: reviewNightTheme.textPrimary }}>
                Your insights <span style={{ color: reviewNightTheme.accent }}>power the map</span>
              </h3>
              
              <div className="space-y-6">
                {[
                  { label: "Time-stamped reviews", value: "Real-time data synchronization" },
                  { label: "Verified participants", value: "Authentic rider-only community" },
                  { label: "Public record", value: "Transparent infrastructure data" }
                ].map((stat, i) => (
                  <div key={i} className="flex gap-4">
                    <div 
                      className="w-1.5 h-12 rounded-full" 
                      style={{ background: reviewNightTheme.gradientGreen }} 
                    />
                    <div>
                      <p className="text-lg font-bold" style={{ color: reviewNightTheme.textPrimary }}>{stat.label}</p>
                      <p className="text-sm" style={{ color: reviewNightTheme.textSecondary }}>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-xl leading-relaxed italic border-l-4 pl-6" style={{ color: reviewNightTheme.textSecondary, borderColor: reviewNightTheme.accent }}>
                "Every review during Review Night helps build a complete picture of cycling infrastructure across the city. Your insights drive real improvements."
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div 
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-10"
                style={{ background: reviewNightTheme.gradientGreen }}
              />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src={riderImage} 
                  alt="Person riding a bike in the city" 
                  className="w-full h-[500px] object-cover"
                />
                <div 
                  className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl backdrop-blur-md bg-white/90 shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "85%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full"
                          style={{ background: reviewNightTheme.gradientGreen }}
                        />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-tighter" style={{ color: reviewNightTheme.primary }}>Community Impact Score</p>
                    </div>
                    <span className="text-2xl font-black" style={{ color: reviewNightTheme.primary }}>85%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewNightVisualProof;
