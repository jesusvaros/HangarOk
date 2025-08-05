// Thermometer.tsx
import React from 'react';

interface ThermometerProps {
  level: number; // entre 1 y 100
  icon: React.ReactNode;
  primaryColor?: string;
  label?: string;
  left?: boolean;
  title?: string;
}

const Thermometer: React.FC<ThermometerProps> = ({
  level,
  icon,
  primaryColor = '#3B82F6',
  label,
  left = false,
  title = '',
}) => {
  const clampedLevel = Math.min(100, Math.max(1, level));
  const fillHeight = `${clampedLevel}%`;
  const iconOffset = `${100 - clampedLevel}%`;

  return (
    <div className="flex flex-col" style={{ alignItems: left ? 'flex-end' : 'flex-start' }}>
      <p className="text-gray-500 pb-3" style={{ textAlign: left ? 'right' : 'left' }}>
        {title}
      </p>
      <div className="relative w-5 h-36 bg-gray-200 rounded-full ">
        {/* Fondo del termómetro */}
        <div
          className={`absolute bottom-3 left-0 w-full transition-all duration-300 ease-in-out z-10 border-x-2 border-black`}
          style={{
            height: `calc(${fillHeight} - 20px)`,
            backgroundColor: primaryColor,
          }}
        />
        <div
          className={`absolute w-[34px] h-[34px] border-2 border-black rounded-full ml-[-7px] bottom-[-16px]`}
          style={{ backgroundColor: primaryColor }}
        />

        {/* Icono en el punto exacto */}
        <div
          className="border-2 border-black absolute transition-all w-8 h-8 ml-[-5px] flex items-center justify-center rounded-full bg-white "
          style={{ top: iconOffset, zIndex: 12 }}
        >
          {icon}
        </div>
        <p
          className={`border-2 border-black absolute transition-all flex items-center justify-center bg-white px-2 rounded-xl mb-[-2px]`}
          style={{ top: iconOffset, zIndex: 12, left: left ? '-92px' : '32px' }}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export default Thermometer;
