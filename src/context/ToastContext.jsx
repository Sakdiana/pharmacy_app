import { createContext, useCallback, useState } from "react";

export const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`rounded-xl px-4 py-3 text-white shadow-lg text-sm font-medium flex items-center justify-between gap-3 ${
              toast.type === "error" ? "bg-red-500" : "bg-mainColor"
            }`}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="opacity-80 hover:opacity-100"
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
