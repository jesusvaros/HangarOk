import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

const faqs = [
  {
    question: '¿Qué es Casero Verificado?',
    answer:
      'Casero Verificado es una plataforma donde los inquilinos pueden compartir reseñas anónimas sobre sus experiencias con propietarios.',
  },
  {
    question: '¿Cómo puedo dejar una reseña?',
    answer:
      'Busca la dirección del inmueble, inicia sesión si lo deseas y completa el formulario con tu experiencia.',
  },
  {
    question: '¿Mis datos son anónimos?',
    answer:
      'Sí, todas las reseñas se publican de forma anónima para proteger tu identidad.',
  },
];

const FAQItem = ({ question, answer, index }: FAQItemProps) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(prev => !prev);
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className="rounded border">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
          className="flex w-full items-center justify-between p-4 text-left font-medium focus:outline-none"
        >
          {question}
          <span
            className={`ml-2 transform transition-transform ${open ? 'rotate-180' : 'rotate-0'}`}
          >
            ▼
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="px-4 pb-4"
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h2 className="mb-6 text-center text-2xl font-bold">Preguntas frecuentes</h2>
      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <FAQItem key={item.question} index={idx} {...item} />
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
