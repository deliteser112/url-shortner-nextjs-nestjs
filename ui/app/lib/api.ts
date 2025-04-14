import { getToken } from './auth'

export async function register(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    const message =
      Array.isArray(errorData.message)
        ? errorData.message[0]
        : errorData.message || 'Registration failed'

    throw new Error(message)
  }

  return res.json()
}

export const login = async (email: string, password: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) throw new Error('Invalid credentials')
  return res.json()
}

export async function createShortUrl(url: string): Promise<{ slug: string }> {
  const token = getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Failed to shorten URL')
  }
  return res.json()
}
  
export async function updateSlug(id: number, newSlug: string): Promise<{ slug: string }> {
  const token = getToken()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/urls/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ slug: newSlug }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to update slug')
  }
  
  return res.json()
}

  export async function deleteUrl(id: number): Promise<void> {
    const token = getToken();
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/urls/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete URL');
    }
  }
  
  export async function getAllUrls(): Promise<
    Array<{
      slug: string
      originalUrl: string
      visitCount: number
      createdAt: string
    }>
  > {
    const token = getToken()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/urls`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'Failed to fetch URL list')
    }

    return res.json()
  }