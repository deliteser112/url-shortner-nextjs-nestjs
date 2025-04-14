'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getToken, removeToken } from '@/lib/auth'
import { jwtDecode } from 'jwt-decode'

type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  logout: () => void
}

type DecodedToken = {
  id: string;
  email: string;
  exp: number;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const syncAuth = () => {
    const token = getToken()

    if (token) {
      try {
        const { id, email } = jwtDecode<DecodedToken>(token);
        setUser({ id, email })
      } catch (err) {
        console.error('Invalid token', err)
        removeToken()
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    syncAuth()

    const handleStorageChange = () => syncAuth()
    window.addEventListener('storage', handleStorageChange)

    const interval = setInterval(syncAuth, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const logout = () => {
    removeToken()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
