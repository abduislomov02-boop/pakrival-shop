import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2 } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xl rounded-lg text-sm font-medium border border-stone-800 dark:border-stone-200 transition-all transform animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-sm">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
      <span className="leading-snug">{toastMessage}</span>
    </div>
  );
};
