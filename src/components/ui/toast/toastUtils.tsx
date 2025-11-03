import toast from 'react-hot-toast';
import ErrorToast from './ErrorToast';

/**
 * Display a custom error toast.
 * @param message Error message to show
 */
export const showErrorToast = (message: string) => {
  return toast.custom(t => <ErrorToast t={t} message={message} />, {
    duration: 5000,
    position: 'bottom-left',
  });
};

/**
 * Display a success toast (reserved for future use).
 * @param message Success message to show
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
