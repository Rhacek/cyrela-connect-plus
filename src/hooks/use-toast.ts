
import { toast as sonnerToast } from "sonner";
import { type ToastProps as SonnerToastProps } from "sonner";

export type ToastProps = SonnerToastProps & {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

// Create a unified toast function that handles both interfaces
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
