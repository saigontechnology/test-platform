import { toast } from 'react-toastify';

export function showNotification(
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  config?: any,
) {
  return toast[type](message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...config,
  });
}
