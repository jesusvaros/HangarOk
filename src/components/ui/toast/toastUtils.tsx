import toast from 'react-hot-toast';
import ErrorToast from './ErrorToast';

/**
 * Muestra un toast de error personalizado
 * @param message Mensaje de error a mostrar
 */
export const showErrorToast = (message: string) => {
  return toast.custom(t => <ErrorToast t={t} message={message} />, {
    duration: 5000,
    position: 'bottom-left',
  });
};

/**
 * Muestra un toast de éxito (para futuro uso)
 * @param message Mensaje de éxito a mostrar
 */
export const showSuccessToast = (message: string) => {
  return toast.custom(
    () => <div className="bg-green-100 text-green-800 p-4 rounded">{message}</div>,
    {
      duration: 3000,
      position: 'bottom-left',
    }
  );
};
