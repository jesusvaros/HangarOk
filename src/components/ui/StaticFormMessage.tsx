import React from 'react';

interface StaticFormMessageProps {
  title?: string;
  message: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Displays static messages outside the form container.
 * It avoids the message context to prevent re-render issues.
 */
const StaticFormMessage: React.FC<StaticFormMessageProps> = ({
  title,
  message,
  backgroundColor = 'rgb(225, 245, 110)', // Default yellow-green (matches header)
  textColor = 'black', // Default dark green
  className = '',
  icon,
}) => {
  return (
    <div
      className={`mb-4 rounded-lg p-4 ${className} w-full`}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      <div className="flex items-start gap-2">
        <div>
          {title && (
            <h4 className="mb-1 text-lg md:text-xl font-bold flex items-center gap-2">
              {title}
              {icon && <div className="mt-0.5 text-current">{icon}</div>}
            </h4>
          )}
          <p className="text-base md:text-lg leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default StaticFormMessage;
