"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Info, AlertCircle, X } from "lucide-react";

type Toast = {
  id: number;
  title: string;
  description?: string;
  type?: "success" | "error" | "default" | "info" | "warning" | string;
};

type ToastContextValue = {
  notify: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      notify: (toast) => {
        const id = Date.now();
        setToasts((current) => [...current, { ...toast, id }]);
        window.setTimeout(() => {
          setToasts((current) => current.filter((item) => item.id !== id));
        }, 3200);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 grid w-[calc(100vw-32px)] max-w-sm gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="relative rounded-lg border border-banking-border bg-white p-4 text-banking-text shadow-2xl shadow-black/15"
          >
            <div className="flex items-start gap-3">
              {toast.type === "error" ? (
                <XCircle className="mt-0.5 h-5 w-5 text-red-600" />
              ) : toast.type === "warning" ? (
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
              ) : toast.type === "info" ? (
                <Info className="mt-0.5 h-5 w-5 text-blue-600" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-sm leading-5 text-banking-muted">
                    {toast.description}
                  </p>
                ) : null}
                <button
                  onClick={() =>
                    setToasts((current) =>
                      current.filter((item) => item.id !== toast.id),
                    )
                  }
                  className="absolute right-4 top-4 text-banking-muted hover:text-banking-text"
                  title="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
