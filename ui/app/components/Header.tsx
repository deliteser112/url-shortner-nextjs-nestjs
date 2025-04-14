'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthProvider';
import { FiLogOut } from 'react-icons/fi'; 

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => router.push('/')}
        >
          URL Shortener
        </h1>

        <nav className="flex gap-4">
          <AuthNav
            isAuthenticated={isAuthenticated}
            onNavigate={(path) => router.push(path)}
            onLogout={logout}
          />
        </nav>
      </div>
    </header>
  );
}

function AuthNav({
  isAuthenticated,
  onNavigate,
  onLogout,
}: {
  isAuthenticated: boolean;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}) {
  if (!isAuthenticated) {
    return (
      <>
        <NavButton label="Login" onClick={() => onNavigate('/login')} />
        <NavButton label="Register" onClick={() => onNavigate('/register')} />
      </>
    );
  }

  return (
    <>
      <NavButton label="Dashboard" onClick={() => onNavigate('/dashboard')} />
      <span className="flex items-center gap-2 cursor-pointer" onClick={onLogout}>
        <FiLogOut className="h-5 w-5" />
        Sign out
      </span>
    </>
  );
}

function NavButton({
  label,
  onClick,
  variant = 'default',
}: {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}) {
  const base = 'hover:underline transition';
  const color =
    variant === 'danger' ? 'text-red-500' : 'text-blue-600';

  return (
    <button onClick={onClick} className={`${base} ${color}`}>
      {label}
    </button>
  );
}
