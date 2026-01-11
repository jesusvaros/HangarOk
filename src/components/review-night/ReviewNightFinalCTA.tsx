import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { umamiEventProps, trackUmamiEvent } from '../../utils/analytics';
import { reviewNightTheme } from './ReviewNightTheme';
import { useAuth } from '../../store/auth/hooks';
import ContactModal from '../ui/ContactModal';
import { useCountdown } from '../../hooks/useCountdown';

const ReviewNightFinalCTA = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const timeLeft = useCountdown('2026-03-06T10:30:00');

  const handleCTAClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      trackUmamiEvent('review-night:final-cta-subscribe-click');
      setIsModalOpen(true);
    } else {
      trackUmamiEvent('review-night:final-cta-countdown-view');
    }
  };

  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: reviewNightTheme.bgWhite }}>
      {/* Decorative gradient background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ background: reviewNightTheme.gradientGreen }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-20 rounded-[2rem] md:rounded-[3rem] text-center overflow-hidden shadow-2xl"
            style={{ backgroundColor: reviewNightTheme.bgWhite, border: `1px solid ${reviewNightTheme.border}` }}
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-2" style={{ background: reviewNightTheme.gradientGold }} />
            
            <h2 className="mb-6 md:mb-8 text-3xl md:text-6xl font-black tracking-tight" style={{ color: reviewNightTheme.textPrimary }}>
              Join the next <span className="text-transparent bg-clip-text" style={{ backgroundImage: reviewNightTheme.gradientGreen }}>Review Night</span>
            </h2>
            
            <div className="inline-block p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] mb-8 md:mb-12 border-2 border-dashed" style={{ borderColor: reviewNightTheme.borderDark, backgroundColor: '#FBFDFA' }}>
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter" style={{ color: reviewNightTheme.primary }}>
                  Spring 2026 Event
                </h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-white shadow-sm" style={{ color: reviewNightTheme.primary }}>
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-lg md:text-xl font-bold">Friday 6 March 2026</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-white shadow-sm" style={{ color: reviewNightTheme.primary }}>
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-lg md:text-xl font-bold">10:30am – 2:00am</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 md:space-y-8">
              {user ? (
                <div className="flex flex-col items-center gap-6">
                  <p className="text-xl font-black uppercase tracking-widest text-gray-400">
                    See you in
                  </p>
                  <div className="flex gap-4 md:gap-8 justify-center">
                    {[
                      { label: 'Days', value: timeLeft.days },
                      { label: 'Hours', value: timeLeft.hours },
                      { label: 'Min', value: timeLeft.minutes },
                      { label: 'Sec', value: timeLeft.seconds }
                    ].map((unit, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div 
                          className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-xl md:text-2xl font-black text-white shadow-lg"
                          style={{ background: reviewNightTheme.gradientGreen }}
                        >
                          {String(unit.value).padStart(2, '0')}
                        </div>
                        <span className="mt-2 text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={handleCTAClick}
                    className="inline-block w-full md:w-auto rounded-xl md:rounded-2xl px-8 md:px-12 py-4 md:py-6 text-xl md:text-2xl font-black text-white transition-all shadow-xl hover:shadow-2xl"
                    style={{ background: reviewNightTheme.gradientGreen }}
                    {...umamiEventProps('review-night:final-cta-subscribe')}
                  >
                    Subscribe to the event
                  </button>
                </motion.div>
              )}
              
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
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ContactModal
            onClose={() => setIsModalOpen(false)}
            onLoginComplete={() => {
              setIsModalOpen(false);
              trackUmamiEvent('review-night:final-cta-login-success');
            }}
            mode="subscription"
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReviewNightFinalCTA;
