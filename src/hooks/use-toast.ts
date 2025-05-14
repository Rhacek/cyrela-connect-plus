
import { toast as sonnerToast, Toast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  cancel?: React.ReactNode;
  important?: boolean;
  duration?: number;
};

// Create a unified toast function that wraps the sonner toast
const toast = {
  success: (title: string, props?: Omit<ToastProps, "title">) => {
    return sonnerToast.success(title, props);
  },
  error: (title: string, props?: Omit<ToastProps, "title">) => {
    return sonnerToast.error(title, props);
  },
  warning: (title: string, props?: Omit<ToastProps, "title">) => {
    return sonnerToast.warning(title, props);
  },
  info: (title: string, props?: Omit<ToastProps, "title">) => {
    return sonnerToast.info(title, props);
  },
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    props?: ToastProps
  ) => {
    return sonnerToast.promise(promise, options, props);
  },
};

const useToast = () => {
  return { toast };
};

export { toast, useToast };
