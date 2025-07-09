import React from 'react';

interface MessageBoxProps {
  message: string;
  title?: string;
  height?: string;
  className?: string;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  message,
  title,
  height,
  className = ''
}) => {
  return (
    <div 
      className={`${className || 'absolute right-0 transform translate-x-[calc(100%+24px)] hidden lg:block'}`}
      style={{ 
        maxWidth: '250px',
        top: `calc(${height || '0'} - 44px)`,
        right: '-20px'
      }}
    >
      <div 
        className="relative px-4 py-3 rounded-lg text-base"
        style={{
          backgroundColor: 'rgb(209 247 128)',
          color: 'rgb(18, 74, 54)',
        }}
      >
        {title && <h4 className="font-bold mb-1">{title}</h4>}
        {message}
       
      </div>
    </div>
  );
};

export default MessageBox;
