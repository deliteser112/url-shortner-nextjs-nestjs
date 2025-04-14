'use client'

import { useState } from 'react'
import { createShortUrl } from '@/lib/api'
import { getUrlValidationError } from '@/lib/validators'

export default function URLForm() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = getUrlValidationError(url)
    if (validationError) {
      setErrorMessage(validationError)
      setShortUrl('')
      return
    }

    setLoading(true)
    setErrorMessage('')
    setShortUrl('')

    try {
      const { slug } = await createShortUrl(url)
      const origin = window.location.origin
      const fullShortUrl = `${origin}/${slug}`
      setShortUrl(fullShortUrl)
      setUrl('')
    } catch (err) {
      let message = 'Failed to shorten URL';

      if (err instanceof Error) {
        if ('message' in err && err.message.includes('Too many requests')) {
          message = 'You are submitting too quickly. Please wait a moment and try again.';
        } else {
          message = err.message;
        }
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { status?: number } }).response?.status === 'number' &&
        (err as { response?: { status?: number } }).response?.status === 429
      ) {
        message = 'You are submitting too quickly. Please wait a moment and try again.';
      }

      setErrorMessage(message);
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Enter URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={`w-full px-3 py-2 border ${
            errorMessage ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="https://example.com"
        />
        {errorMessage && (
          <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
      >
        {loading ? 'Shortening...' : 'Shorten URL'}
      </button>

      {shortUrl && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-2 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-green-600 mb-1">
              Success! Here&apos;s your short URL:
            </p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-words"
            >
              {shortUrl}
            </a>
          </div>
          <button
            onClick={handleCopy}
            type="button"
            className="ml-4 text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Copy
          </button>
        </div>
      )}
    </form>
  )
}
