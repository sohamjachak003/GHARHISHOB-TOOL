import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200 ${
        toast.type === 'success'
          ? 'bg-slate-900/95 border-emerald-500/40 text-white'
          : toast.type === 'error'
          ? 'bg-slate-900/95 border-rose-500/40 text-white'
          : 'bg-slate-900/95 border-slate-700 text-white'
      }`}
    >
      {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
      {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}

      <span className="text-sm font-medium">{toast.message}</span>

      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-slate-400 hover:text-white rounded-lg ml-2"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
