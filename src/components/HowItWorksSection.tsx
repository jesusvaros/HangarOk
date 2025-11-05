import React from 'react';
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const steps = [
  {
    Icon: MagnifyingGlassIcon,
    number: '1️⃣',
    title: 'Find the hangar',
    text: 'Search by postcode or street to see hangars near you and what others think.'
  },
  {
    Icon: PencilSquareIcon,
    number: '2️⃣',
    title: 'Share your experience',
    text: 'Add your honest review covering door weight, theft safety, lighting, and community vibes.'
  },
  {
    Icon: UserGroupIcon,
    number: '3️⃣',
    title: 'Help other riders',
    text: 'Your feedback helps councils, residents, and operators improve bike storage.'
  },
  {
    Icon: ChartBarIcon,
    number: '4️⃣',
    title: 'Shape the future of cycling',
    text: 'Every review builds data that the bike industry doesn\'t currently have.'
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-green-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">How it works</h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ Icon, number, title, text }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#4A5E32]/10">
                <Icon className="h-8 w-8 text-[#4A5E32]" />
              </div>
              <h3 className="mb-2 text-lg font-bold">
                <span className="mr-2">{number}</span>
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

export default HowItWorksSection;
