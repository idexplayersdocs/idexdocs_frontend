import { Bounce, toast } from 'react-toastify';

const baseConfig = {
  position: "top-center" as const,
  hideProgressBar: false,
  closeOnClick: true,
  draggable: true,
  progress: undefined,
  theme: 'dark' as const,
  transition: Bounce,
};

export function showSuccessToast(message: string) {
  toast.success(message, { ...baseConfig, autoClose: 3000 });
}

export function showErrorToast(message: string) {
  toast.error(message, { ...baseConfig, autoClose: 5000 });
}

export function showWarningToast(message: string) {
  toast.warning(message, { ...baseConfig, autoClose: 5000 });
}
