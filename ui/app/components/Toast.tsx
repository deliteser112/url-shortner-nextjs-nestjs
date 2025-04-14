'use client';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' } | null;
}

export default function DashboardToast({ toast }: ToastProps) {
  if (!toast) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50
      ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
    >
      {toast.message}
    </div>
  );
}
