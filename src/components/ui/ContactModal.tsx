// ContactModal.tsx
import React from 'react';
import LoginContent from './LoginContent';
import { umamiEventProps } from '../../utils/analytics';

interface ContactModalProps {
  onClose: () => void;
  onLoginComplete?: (sessionId: string, userId: string) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose, onLoginComplete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="relative w-[92%] max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="relative p-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            aria-label="Close"
            {...umamiEventProps('login:modal-close')}
          >
            ✕
          </button>
          <LoginContent onClose={onClose} showTitle={true} onLoginComplete={onLoginComplete} />
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
