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
      className={`mb-4 w-full rounded-lg p-4 ${className} hidden border border-[#4A5E32] lg:block`}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {title && <h4 className="mb-1 text-base font-bold">{title}</h4>}
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default FormMessage;
