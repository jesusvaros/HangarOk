import React from 'react';

interface FormMessageProps {
  title?: string;
  message: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

/**
 * Componente para mostrar mensajes fuera del recuadro del formulario
 * Diseñado para mostrarse en el fondo gris, no en el fondo blanco del formulario
 */
const FormMessage: React.FC<FormMessageProps> = ({
  title,
  message,
  backgroundColor = 'rgb(225, 245, 110)', // Amarillo verde por defecto (como en el header)
  textColor = '#4A5E32', // Verde oscuro por defecto
  className = '',
}) => {
  return (
    <div 
      className={`w-full p-4 mb-4 rounded-lg ${className} border border-[#4A5E32] hidden lg:block`} 
      style={{ 
        backgroundColor, 
        color: textColor 
      }}
    >
      {title && <h4 className="font-bold text-base mb-1">{title}</h4>}
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default FormMessage;
