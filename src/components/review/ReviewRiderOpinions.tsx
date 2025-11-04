import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { SectionCard } from './reviewShared';

type FeedbackEntry = {
  label: string;
  body: string;
};

type Props = {
  entries: FeedbackEntry[];
};

const ReviewRiderOpinions: React.FC<Props> = ({ entries }) => {
  if (entries.length === 0) return null;

  return (
    <SectionCard title="Rider opinions" subtitle="What they want neighbours to know" icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />}>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.label} className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{entry.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">{entry.body}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default ReviewRiderOpinions;
