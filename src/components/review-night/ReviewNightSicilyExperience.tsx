import { motion } from 'framer-motion';
import { reviewNightTheme } from './ReviewNightTheme';
import sicilyImage from '../../assets/landing/price-sicily-april.jpeg';

const ReviewNightSicilyExperience = () => {
  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: reviewNightTheme.bgGray }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Text content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider uppercase rounded-full text-white"
                style={{ background: reviewNightTheme.gradientGold }}
              >
                Featured Experience
              </motion.span>
              
              <h2 className="mb-6 text-4xl md:text-5xl font-black" style={{ color: reviewNightTheme.textPrimary }}>
                Sicily & <span className="text-transparent bg-clip-text" style={{ backgroundImage: reviewNightTheme.gradientGreen }}>Mount Etna</span>
              </h2>
              
              <p className="mb-8 text-xl leading-relaxed" style={{ color: reviewNightTheme.textSecondary }}>
                Experience the breathtaking beauty of Sicily's volcanic landscape and coastal roads. This supported riding adventure combines challenging climbs with authentic Italian culture.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  "Professional guide support",
                  "Accommodation included",
                  "Small group experience",
                  "Customized ride routes"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" 
                      style={{ background: reviewNightTheme.gradientGold }}
                    >
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-bold text-sm" style={{ color: reviewNightTheme.textPrimary }}>{item}</span>
                  </div>
                ))}
              </div>

              <div 
                className="inline-flex items-center gap-4 p-6 rounded-2xl shadow-xl" 
                style={{ background: reviewNightTheme.gradientGreen }}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Planned Departure</p>
                  <p className="text-white text-xl font-black">Spring 2026</p>
                </div>
              </div>
            </motion.div>
            
            {/* Right side - Image with decorative elements */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 relative"
            >
              <div 
                className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-20"
                style={{ background: reviewNightTheme.gradientGold }}
              />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src={sicilyImage} 
                  alt="Sicily & Mount Etna riding experience" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 p-6 rounded-2xl shadow-2xl bg-white border border-gray-100 hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-black" style={{ color: reviewNightTheme.accent }}>5</div>
                  <div className="text-xs font-bold leading-tight uppercase tracking-tighter" style={{ color: reviewNightTheme.textPrimary }}>
                    Days of <br/>Epic Riding
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewNightSicilyExperience;
