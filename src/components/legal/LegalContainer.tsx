import type { PropsWithChildren } from 'react';

export default function LegalContainer({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto mt-10 w-full max-w-5xl px-6 py-12 md:px-8 text-gray-900 text-[17px] md:text-[18px] leading-relaxed">
      {children}
    </div>
  );
}
