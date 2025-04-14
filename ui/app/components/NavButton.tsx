'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface NavButtonProps {
  label?: string;
  children?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export default function NavButton({
  label,
  children,
  onClick,
  variant = 'default',
}: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-3 py-1 rounded hover:opacity-80 transition font-medium flex items-center gap-2',
        variant === 'danger' ? 'text-red-600' : 'text-blue-600'
      )}
    >
      {children ?? label}
    </button>
  );
}
