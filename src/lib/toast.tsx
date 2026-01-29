import React from "react";
import { toast, ToastOptions, Id, Bounce } from "react-toastify";

// Custom toast configuration matching the app's design system
const defaultToastOptions: ToastOptions = {
  position: "bottom-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Bounce,
  style: {
    background: "rgba(30, 41, 59, 0.95)",
    color: "#ffffff",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "0.5rem",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: "clamp(0.875rem, 2.5vw, 0.875rem)",
    backdropFilter: "blur(10px)",
    minWidth: "280px",
    maxWidth: "90vw",
    padding: "12px 14px",
  },
};

// Success toast with custom styling
export const showSuccess = (message: string, options?: ToastOptions): Id => {
  return toast.success(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...defaultToastOptions.style,
      border: "1px solid rgba(34, 197, 94, 0.3)",
      ...options?.style,
    },
  });
};

// Error toast with custom styling
export const showError = (message: string, options?: ToastOptions): Id => {
  return toast.error(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...defaultToastOptions.style,
      border: "1px solid rgba(239, 68, 68, 0.3)",
      ...options?.style,
    },
  });
};

// Warning toast with custom styling
export const showWarning = (message: string, options?: ToastOptions): Id => {
  return toast.warning(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...defaultToastOptions.style,
      border: "1px solid rgba(245, 158, 11, 0.3)",
      ...options?.style,
    },
  });
};

// Info toast with custom styling
export const showInfo = (message: string, options?: ToastOptions): Id => {
  return toast.info(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...defaultToastOptions.style,
      border: "1px solid rgba(59, 130, 246, 0.3)",
      ...options?.style,
    },
  });
};

// Loading toast (doesn't auto-close)
export const showLoading = (message: string, options?: ToastOptions): Id => {
  return toast.loading(message, {
    ...defaultToastOptions,
    autoClose: false,
    closeOnClick: false,
    ...options,
  });
};

// Update a loading toast to success/error
export const updateToast = (
  toastId: Id,
  message: string,
  type: "success" | "error" | "info" | "warning" = "success"
): void => {
  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    autoClose: 5000,
    closeOnClick: false,
    transition: Bounce,
  });
};

// Dismiss a toast
export const dismissToast = (toastId: Id): void => {
  toast.dismiss(toastId);
};

// Confirm dialog using toast
export const showConfirm = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): void => {
  const toastId = toast(
    ({ closeToast }: { closeToast: () => void }) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-white font-medium">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onConfirm();
              closeToast();
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all text-sm"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              onCancel?.();
              closeToast();
            }}
            className="flex-1 px-4 py-2 bg-slate-700/50 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-all text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      ...defaultToastOptions,
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      style: {
        ...defaultToastOptions.style,
        minWidth: "300px",
      },
    }
  );
};
