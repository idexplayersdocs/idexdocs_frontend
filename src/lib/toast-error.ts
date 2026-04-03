import { Bounce, toast } from 'react-toastify';

const defaultToastConfig = {
  position: "top-center" as const,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  draggable: true,
  progress: undefined,
  theme: 'colored' as const,
  transition: Bounce,
};

export function showErrorToast(message: string) {
  toast.error(message, defaultToastConfig);
}
