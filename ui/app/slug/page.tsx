'use client'

import URLForm from '@/components/dashboard/URLForm'

export default function HomePage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">URL Shortener</h1>
      <URLForm />
    </div>
  )
}
