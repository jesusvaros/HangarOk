import { motion } from 'framer-motion';
import { reviewNightTheme } from './ReviewNightTheme';

const ReviewNightWhyRewards = () => {
  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: reviewNightTheme.bgGray }}>
      {/* Decorative background shape */}
      <div 
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: reviewNightTheme.gradientGreen }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 md:p-16 rounded-[3rem] text-center shadow-2xl relative overflow-hidden"
            style={{ background: reviewNightTheme.bgWhite }}
          >
            {/* Inner glow effect */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/50 rounded-[3rem] shadow-inner" />
            
            <h2 className="mb-8 text-3xl md:text-5xl font-black tracking-tight" style={{ color: reviewNightTheme.textPrimary }}>
              Why HangarOK <span className="text-transparent bg-clip-text" style={{ backgroundImage: reviewNightTheme.gradientGold }}>rewards</span> participation
            </h2>
            
            <div className="space-y-8 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                style={{ color: reviewNightTheme.textSecondary }}
              >
                Review Night exists to capture honest, representative experiences.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-gray-50 border-l-4"
                style={{ borderColor: reviewNightTheme.accent }}
              >
                <p className="font-bold text-2xl" style={{ color: reviewNightTheme.accentDark }}>
                  The supported rides are our way of thanking the riders who make that possible.
                </p>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="italic text-lg" 
                style={{ color: reviewNightTheme.textLight }}
              >
                "They are not prizes for opinions, they're a recognition of participation."
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReviewNightWhyRewards;
