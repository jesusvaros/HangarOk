import React from 'react';

interface MessageBoxProps {
  message: string;
  position?: 'top' | 'middle' | 'bottom';
  type?: 'info' | 'warning' | 'success';
  className?: string;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  message,
  position = 'middle',
  type = 'info',
  className = '',
}) => {
  // Calculate position classes
  const positionClasses = {
    top: 'top-24',
    middle: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-24',
  };

  // Calculate type classes (colors)
  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };

  // Arrow classes
  const arrowClasses = {
    info: 'border-r-blue-200',
    warning: 'border-r-amber-200',
    success: 'border-r-green-200',
  };

  return (
    <div 
      className={`${className || `absolute right-0 transform translate-x-[calc(100%+12px)] ${positionClasses[position]} hidden lg:block`}`}
      style={{ maxWidth: '250px' }}
    >
      <div className={`relative p-3 rounded-lg border ${typeClasses[type]} text-sm`}>
        {message}
        {/* Arrow pointing to the left */}
        <div 
          className={`absolute top-1/2 left-0 -ml-2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 
                    border-t-8 border-t-transparent 
                    border-r-8 ${arrowClasses[type]} 
                    border-b-8 border-b-transparent`}
        ></div>
      </div>
    </div>
  );
};

export default MessageBox;
