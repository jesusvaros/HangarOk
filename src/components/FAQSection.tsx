import { useState } from 'react';
import { motion } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

const faqs = [
  {
    question: 'What is HangarOK?',
    answer:
      'HangarOK is where riders and residents anonymously share their experiences with on-street cycle hangars - helping others make informed choices and improving local cycling infrastructure.',
  },
  {
    question: 'Are personal details shared?',
    answer:
      'Never. We only display anonymised hangar-level data so councils can see issues without identifying you.',
  },
  {
    question: 'Can my review really make a difference?',
    answer:
      'Yes. Each review adds to a public map used by planners, insurers, and operators to spot unsafe, unfair, or underused hangars.',
  },
  {
    question: 'What if I don\'t have a hangar yet?',
    answer:
      'You can still share your experience - about being on a waiting list, lack of nearby hangars, or what would make you cycle more.',
  },
  {
    question: 'What if I see inaccurate or inappropriate content?',
    answer:
      'We moderate all submissions. If something looks off, report it and we\'ll review it.',
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
          <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
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
