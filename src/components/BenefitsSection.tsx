import React from 'react';

const benefits = [
  {
    emoji: '👀',
    title: 'Real-world insight',
    text: 'See what it\'s actually like to use your local hangar - not the marketing version.'
  },
  {
    emoji: '🔒',
    title: 'Anonymous community',
    text: 'Your feedback is private, your data secure. No names, no tracking - just truth.'
  },
  {
    emoji: '⚡',
    title: 'Faster improvement',
    text: 'Reviews help councils spot problem hangars quicker and fix what matters.'
  },
  {
    emoji: '🚴',
    title: 'Better cycling for everyone',
    text: 'Your voice helps make cycling feel safe, accessible, and normal - not niche.'
  }
];

const BenefitsSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-green-50 to-green-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-10 text-center text-3xl font-bold">Why use HangarOK?</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ emoji, title, text }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition-transform hover:-translate-y-1"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4A5E32]/10 text-3xl">
                {emoji}
              </div>
              <h3 className="mb-2 text-xl font-bold">
                {title}
              </h3>
              <p className="text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
