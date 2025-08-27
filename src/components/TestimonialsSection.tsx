import React from 'react';
import testimonials from '../services/testimonials';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-12 text-3xl font-bold">Testimonios</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-lg bg-gray-50 p-6 shadow">
              <p className="italic text-gray-700">"{t.comment}"</p>
              <p className="mt-4 font-semibold text-gray-900">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
