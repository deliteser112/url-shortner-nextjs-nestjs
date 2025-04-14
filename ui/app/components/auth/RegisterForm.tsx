'use client'

import { useState } from 'react'
import { register } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await register(email, password)
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className={`w-full px-3 py-2 border rounded outline-none ${
              email && !isValidEmail(email)
                ? 'border-red-500'
                : 'border-gray-300 focus:ring focus:ring-blue-200'
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!!email && !isValidEmail(email) && (
            <p className="text-sm text-red-500 mt-1">Invalid email format</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring focus:ring-blue-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            className={`w-full px-3 py-2 border rounded outline-none ${
              confirmPassword && password !== confirmPassword
                ? 'border-red-500'
                : 'border-gray-300 focus:ring focus:ring-blue-200'
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {!!confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            loading || password !== confirmPassword || !isValidEmail(email)
          }
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/login')}
          className="w-full text-sm text-blue-600 hover:underline text-center mt-2"
        >
          Already have an account? Login
        </button>

        {success && (
          <p className="text-center text-green-600 text-sm">
            Account created! Redirecting to login...
          </p>
        )}
        {error && (
          <p className="text-center text-red-600 text-sm">{error}</p>
        )}
      </form>
    </div>
  )
}
