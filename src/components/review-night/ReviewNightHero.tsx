import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { umamiEventProps, trackUmamiEvent } from '../../utils/analytics';
import { reviewNightTheme } from './ReviewNightTheme';
import { useAuth } from '../../store/auth/hooks';
import ContactModal from '../ui/ContactModal';
import etnaIcon from '../../assets/landing/mount etna image.png';
import { useCountdown } from '../../hooks/useCountdown';

const ReviewNightHero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const timeLeft = useCountdown('2026-03-06T10:30:00');

  const handleCTAClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      trackUmamiEvent('review-night:login-modal-open');
      setIsModalOpen(true);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden py-20 -mt-[48px]">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          background: `radial-gradient(circle at 70% 30%, ${reviewNightTheme.primary}15 0%, transparent 70%), 
                       radial-gradient(circle at 10% 80%, ${reviewNightTheme.accent}10 0%, transparent 50%),
                       #F9FAFB` 
        }}
      />
      
      {/* Decorative Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-20 right-[10%] w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: reviewNightTheme.accent }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="mb-6 text-5xl md:text-8xl font-black tracking-tight leading-tight" style={{ color: reviewNightTheme.textPrimary }}>
              Review <span className="text-transparent bg-clip-text" style={{ backgroundImage: reviewNightTheme.gradientGreen }}>Night</span>
            </h1>
            
            <p className="mb-8 text-2xl md:text-4xl font-semibold italic" style={{ color: reviewNightTheme.accent }}>
              "One night. Real riders. Real rewards."
            </p>
            
            <p className="mb-12 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ color: reviewNightTheme.textSecondary }}>
              Join the city-wide movement. Your voice, shared in a single window, shapes the future of London's cycling storage.
            </p>
          </motion.div>

          {/* Visual Highlight - Redesigned Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-12 max-w-2xl mx-auto"
          >
            <div 
              className="relative p-6 md:p-8 rounded-2xl shadow-2xl border overflow-hidden" 
              style={{ backgroundColor: reviewNightTheme.bgCard, borderColor: reviewNightTheme.border }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
                <div 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden" 
                  style={{ background: reviewNightTheme.gradientGold }}
                >
                  <img 
                    src={etnaIcon} 
                    alt="Mount Etna" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: reviewNightTheme.textPrimary }}>Next Stop: Sicily & Mount Etna</h3>
                  <p className="text-base md:text-lg" style={{ color: reviewNightTheme.textSecondary }}>
                    Review Night participants unlock exclusive access to supported riding experiences across Europe.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center"
          >
            {user ? (
              <div className="flex flex-col items-center gap-6">
                <p className="text-xl font-black uppercase tracking-widest text-gray-500">
                  Event starts in
                </p>
                <div className="flex gap-4 md:gap-8">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Min', value: timeLeft.minutes },
                    { label: 'Sec', value: timeLeft.seconds }
                  ].map((unit, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black text-white shadow-xl"
                        style={{ background: reviewNightTheme.gradientGreen }}
                      >
                        {String(unit.value).padStart(2, '0')}
                      </div>
                      <span className="mt-2 text-xs font-bold uppercase tracking-tighter text-gray-400">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8">
                <button
                  onClick={handleCTAClick}
                  className="inline-block rounded-xl px-12 py-5 text-2xl font-bold text-white transition-all shadow-xl hover:shadow-2xl active:scale-95"
                  style={{ background: reviewNightTheme.gradientGreen }}
                  {...umamiEventProps('review-night:cta-subscribe')}
                >
                  Subscribe to the event
                </button>
                
                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                  {[
                    "3 winners selected randomly",
                    "Verified proof required",
                    "Reviews published anonymously"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: reviewNightTheme.accent }} />
                      <span className="text-xs font-black uppercase tracking-widest" style={{ color: reviewNightTheme.textLight }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ContactModal
            onClose={() => setIsModalOpen(false)}
            onLoginComplete={() => {
              setIsModalOpen(false);
              trackUmamiEvent('review-night:login-success');
            }}
            mode="subscription"
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReviewNightHero;
