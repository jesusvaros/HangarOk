import React from 'react';

interface StaticFormMessageProps {
  title?: string;
  message: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

/**
 * Componente para mostrar mensajes estáticos fuera del recuadro del formulario
 * No utiliza el contexto de mensajes para evitar problemas de renderizado
 */
const StaticFormMessage: React.FC<StaticFormMessageProps> = ({
  title,
  message,
  backgroundColor = 'rgb(225, 245, 110)', // Amarillo verde por defecto (como en el header)
  textColor = '#4A5E32', // Verde oscuro por defecto
  className = '',
}) => {
  return (
    <div
      className={`mb-4 rounded-lg p-4 ${className} w-full`}
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

export default StaticFormMessage;
