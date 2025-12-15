import React from 'react';

const rewards = [
  {
    emoji: '🛡️',
    title: 'Earn protection by helping the community',
    text: 'Every verified review you leave helps other riders stay safer and helps your street, your council, and your cycling community.'
  },
  {
    emoji: '🏅',
    title: 'Monthly £0 excess rewards',
    text: 'Each month, we highlight riders whose reviews made the biggest difference. They receive £0 excess protection on any eligible claim for the next month.'
  },
  {
    emoji: '🙏',
    title: 'Not a lottery but a thank you',
    text: 'Rewards aren\'t random. They go to riders whose reviews were the most useful: clear, honest, and genuinely helpful.'
  },
  {
    emoji: '📈',
    title: 'Better data = better cycle hangars for everyone',
    text: 'The more riders contribute, the faster councils and operators can fix issues, add secure cycle hangars, and make active travel safer.'
  }
];

const TrustRewardsSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-green-50 to-green-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold">HangarOK Trust Rewards</h2>
        <p className="mb-10 mt-3 text-center text-lg text-gray-700">
          A simple thank you for helping make cycle hangars safer.
        </p>
        <div className="mt-12">
          <div className="space-y-6">
            {rewards.map(({ emoji, title, text }) => (
              <div
                key={title}
                className="relative flex gap-4 rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-green-100 backdrop-blur sm:items-start sm:gap-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4A5E32]/10 text-2xl ring-2 ring-white shadow-[0_10px_30px_rgba(74,94,50,0.12)]">
                  {emoji}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#2F3E1D]">
                    {title}
                  </h3>
                  <p className="text-gray-700">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustRewardsSection;
