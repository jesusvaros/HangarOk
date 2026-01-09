import { motion } from 'framer-motion';
import { reviewNightTheme } from './ReviewNightTheme';

const ReviewNightPurpose = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div 
        className="absolute top-0 right-0 w-full h-px" 
        style={{ background: `linear-gradient(90deg, transparent 0%, ${reviewNightTheme.border} 50%, transparent 100%)` }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-12 text-4xl md:text-5xl font-black" style={{ color: reviewNightTheme.textPrimary }}>
              Why Review Night <span className="text-transparent bg-clip-text" style={{ backgroundImage: reviewNightTheme.gradientGreen }}>Exists</span>
            </h2>
            
            <div className="space-y-10 text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              <p className="italic font-medium" style={{ color: reviewNightTheme.textSecondary }}>
                "HangarOK exists to surface real experiences and bridge the gap between riders and decision-makers."
              </p>
              
              <div 
                className="p-10 rounded-[3rem] shadow-xl border-t-8" 
                style={{ backgroundColor: '#F9FAFB', borderColor: reviewNightTheme.primary }}
              >
                <p className="font-bold text-2xl md:text-3xl leading-tight" style={{ color: reviewNightTheme.textPrimary }}>
                  Review Night creates a <span style={{ color: reviewNightTheme.primary }}>shared moment</span> for riders to speak.
                </p>
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-lg text-gray-600">
                    Together, we produce clearer data for communities, councils, and operators, helping make cycling safer and more accessible for everyone.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReviewNightPurpose;
