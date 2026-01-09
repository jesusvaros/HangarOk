import { motion } from 'framer-motion';
import { reviewNightTheme } from './ReviewNightTheme';

const ReviewNightWhatPeopleShare = () => {
  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: reviewNightTheme.bgWhite }}>
      {/* Background visual element */}
      <div 
        className="absolute top-0 left-0 w-full h-px" 
        style={{ background: `linear-gradient(90deg, transparent 0%, ${reviewNightTheme.border} 50%, transparent 100%)` }}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: reviewNightTheme.textPrimary }}>
              What people <span className="text-transparent bg-clip-text" style={{ backgroundImage: reviewNightTheme.gradientGreen }}>share</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Review Night focuses on the real-world experiences that define city cycling. Every detail helps build a better map for everyone.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: "Access & Availability",
                desc: "Real data on how easy it is to actually get to your bike.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                )
              },
              {
                title: "Waiting Times",
                desc: "Tracking the hidden demand for secure storage across London.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Security & Theft",
                desc: "Honest reports on break-ins and safety concerns.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )
              },
              {
                title: "Overnight Storage",
                desc: "How comfortable riders feel leaving their main bikes.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )
              },
              {
                title: "Shared Logistics",
                desc: "The daily reality of shared locks and hangar neighbors.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )
              },
              {
                title: "Infrastructure Reliance",
                desc: "How much your cycling depends on these local hangars.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border"
                style={{ backgroundColor: reviewNightTheme.bgWhite, borderColor: reviewNightTheme.border }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${reviewNightTheme.primary}08`, color: reviewNightTheme.primary }}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: reviewNightTheme.textPrimary }}>{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-10 rounded-[2.5rem] overflow-hidden shadow-2xl group"
            style={{ background: reviewNightTheme.bgDark }}
          >
            <div 
              className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
              style={{ background: reviewNightTheme.gradientGreen }}
            />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left max-w-xl">
                <p className="text-white text-2xl font-bold leading-tight">
                  "Together, these reviews reveal where hangars work and where change is needed most."
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full animate-pulse" style={{ background: reviewNightTheme.gradientGold }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReviewNightWhatPeopleShare;
