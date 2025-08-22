// ContactModal.tsx
import React from 'react';
import LoginContent from './LoginContent';

interface ContactModalProps {
  onClose: () => void;
  onLoginComplete?: (sessionId: string, userId: string) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose, onLoginComplete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Cerrar"
        >
          ✕
        </button>
        
        <LoginContent onClose={onClose} showTitle={true} onLoginComplete={onLoginComplete} />
      </div>
    </div>
  );
};

export default ContactModal;
