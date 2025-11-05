import React from 'react';
import { ACCENT, TAG_ICON_MAP, formatScore, formatTagLabel } from './reviewFormatting';

type RatingRowProps = {
  icon: React.ReactNode;
  label: string;
  value?: number | null;
  accent?: string;
};

export const RatingRow = ({ icon, label, value, accent = ACCENT }: RatingRowProps) => {
  if (value == null) return null;
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center text-black">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between text-sm font-medium text-gray-700">
          <span>{label}</span>
          <span className="text-xs text-gray-500">{formatScore(value)} / 5</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: accent }} />
        </div>
      </div>
    </div>
  );
};

type TagListProps = {
  title: string;
  tags?: string[] | null;
  tone?: 'neutral' | 'positive' | 'warning';
};

export const TagList = ({ title, tags, tone = 'neutral' }: TagListProps) => {
  if (!tags || tags.length === 0) return null;
  const toneStyles: Record<string, { bg: string; color: string }> = {
    neutral: { bg: 'rgba(74,94,50,0.08)', color: ACCENT },
    positive: { bg: 'rgba(34,197,94,0.12)', color: 'rgb(22,101,52)' },
    warning: { bg: 'rgba(220,38,38,0.12)', color: 'rgb(153,27,27)' },
  };
  const { bg, color } = toneStyles[tone];

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ backgroundColor: bg, color }}
          >
            <span>{TAG_ICON_MAP[tag] ?? '•'}</span>
            <span>{formatTagLabel(tag)}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

type BooleanSignalProps = {
  label: string;
  value?: boolean | null;
  positive: { text: string; icon: React.ReactNode };
  negative: { text: string; icon: React.ReactNode };
};

export const BooleanSignal = ({ label, value, positive, negative }: BooleanSignalProps) => {
  if (value == null) return null;
  const palette = value
    ? { bg: 'rgba(34,197,94,0.12)', text: 'rgb(22,101,52)' }
    : { bg: 'rgba(220,38,38,0.12)', text: 'rgb(153,27,27)' };
  const descriptor = value ? positive : negative;

  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2" style={{ backgroundColor: palette.bg }}>
      <div className="text-sm font-medium" style={{ color: palette.text }}>
        {label}
      </div>
      <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: palette.text }}>
        <span className="text-lg">{descriptor.icon}</span>
        {descriptor.text}
      </div>
    </div>
  );
};

type SectionCardProps = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export const SectionCard = ({ title, subtitle, icon, children }: SectionCardProps) => (
  <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ring-1 ring-gray-100/50">
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(74,94,50,0.1)', color: ACCENT }}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);
