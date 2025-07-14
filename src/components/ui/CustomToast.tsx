import React from 'react';
import { toast, type Toast } from 'react-hot-toast';

interface CustomToastProps {
  t: Toast;
  message: string;
  type: 'error' | 'success' | 'info';
}

/**
 * Componente personalizado para los toasts con botón de cierre propio
 */
const CustomToast: React.FC<CustomToastProps> = ({ t, message, type }) => {
  const backgroundColor = type === 'error' ? '#E53E3E' : type === 'success' ? '#48BB78' : '#363636';
  
  return (
    <div
      className={`max-w-md rounded shadow-lg`}
      style={{
        backgroundColor,
        padding: '12px 16px',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        pointerEvents: 'auto', // Asegurar que es interactivo
      }}
    >
      <p style={{ margin: 0, padding: 0 }}>{message}</p>
      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          marginLeft: '16px',
          padding: '4px',
          cursor: 'pointer',
          fontSize: '18px',
          opacity: 0.7,
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.7';
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default CustomToast;

/**
 * Funciones helper para mostrar toasts personalizados
 */

export const showErrorToast = (message: string) => {
  return toast.custom((t) => (
    <CustomToast t={t} message={message} type="error" />
  ), {
    duration: 5000,
  });
};

export const showSuccessToast = (message: string) => {
  return toast.custom((t) => (
    <CustomToast t={t} message={message} type="success" />
  ), {
    duration: 3000,
  });
};

export const showInfoToast = (message: string) => {
  return toast.custom((t) => (
    <CustomToast t={t} message={message} type="info" />
  ), {
    duration: 4000,
  });
};
