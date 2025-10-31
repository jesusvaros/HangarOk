import { useState } from 'react';
import { motion } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

const faqs = [
  {
    question: '¿Qué es CaseroOk?',
    answer:
      'CaseroOk es una plataforma donde los inquilinos comparten de forma anónima sus experiencias con propietarios para ayudar a otros a tomar decisiones informadas.',
  },
  {
    question: '¿Se publican datos personales de los caseros?',
    answer:
      'No. Nunca mostramos nombres, teléfonos ni correos. Solo guardamos un hash anónimo para poder agrupar opiniones del mismo propietario.',
  },
  {
    question: '¿Las opiniones tienen validez legal?',
    answer:
      'Las reseñas son experiencias subjetivas de los inquilinos y están protegidas por la libertad de expresión. No constituyen denuncias ni declaraciones legales.',
  },
  {
    question: '¿Cómo dejo mi opinión?',
    answer:
      'Busca la dirección del inmueble y rellena el formulario. También puedes usar la extensión del navegador que detecta automáticamente los datos del anuncio.',
  },
  {
    question: '¿Qué pasa si veo contenido inapropiado?',
    answer:
      'Contamos con moderación y términos de uso que prohíben contenido difamatorio o ilegal. Si encuentras algo así, puedes reportarlo y lo revisaremos.',
  },
];

  const FAQItem = ({ question, answer, index }: FAQItemProps) => {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen((prev) => !prev);
    const panelId = `faq-panel-${index}`;
    const buttonId = `faq-button-${index}`;

    return (
      <div className="border-b">
        <h3>
          <button
            id={buttonId}
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
            className="flex w-full items-center justify-between py-4 text-left text-lg font-medium focus:outline-none"
          >
            {question}
            <span
              className={`ml-2 transition-transform ${open ? 'rotate-45' : 'rotate-0'}`}
            >
              +
            </span>
          </button>
        </h3>
        <motion.div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="pb-4">
            <p className="text-base text-gray-700">{answer}</p>
          </div>
        </motion.div>
      </div>
    );
  };

  const FAQSection = () => {
    return (
      <section className="w-full bg-gradient-to-b from-green-50 to-white py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-left text-3xl font-bold">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <FAQItem key={item.question} index={idx} {...item} />
            ))}
          </div>
        </div>
      </section>
    );
  };

export default FAQSection;
