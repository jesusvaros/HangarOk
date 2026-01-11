import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { reviewNightTheme } from './ReviewNightTheme';
import { umamiEventProps } from '../../utils/analytics';

const ReviewNightBanner = () => {
  return (
    <Link 
      to="/reviewnight" 
      className="block fixed top-0 left-0 right-0 z-[1001] overflow-hidden select-none group h-10"
      {...umamiEventProps('review-night:banner-click')}
    >
      <div 
        className="h-full flex items-center whitespace-nowrap"
        style={{ background: reviewNightTheme.gradientGreen }}
      >
        {/* Sliding Content Container */}
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 80, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex items-center"
        >
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 text-white shrink-0 pr-12">
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
                Join the next <span style={{ color: reviewNightTheme.accent }}>Review Night</span> • March 6, 2026 • Real riders. Real rewards.
              </p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: reviewNightTheme.accent }} />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Learn More</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
    </Link>
  );
};

export default ReviewNightBanner;
