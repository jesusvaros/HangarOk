import React from 'react';

interface ValidationErrorMessageProps {
  message: string | null;
  className?: string;
}

const ValidationErrorMessage: React.FC<ValidationErrorMessageProps> = ({
  message,
  className = '',
}) => {
  if (!message) return null;

  return (
    <div
      className={`bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative mb-4 ${className}`}
      role="alert"
    >
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ValidationErrorMessage;
