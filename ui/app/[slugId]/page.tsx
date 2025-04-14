'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import LoadingSpinner from '../components/LoadingSpinner'

export default function SlugRedirectPage() {
  const [showNotFound, setShowNotFound] = useState(false)
  const params = useParams()

  useEffect(() => {
    const slugId = params?.slugId as string

    if (slugId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slugId}`, {
        cache: 'no-store',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.error === 'Not Found') {
            setShowNotFound(true)
            return
          }

          if (data?.url || data?.originalUrl) {
            window.location.replace(data.url || data.originalUrl)
          } else {
            setShowNotFound(true)
          }
        })
        .catch(() => {
          setShowNotFound(true)
        })
    } else {
      setShowNotFound(true)
    }
  }, [params])

  if (showNotFound) {
    notFound()
  }

  return (
    <>
      <LoadingSpinner />
    </>
  )
}
