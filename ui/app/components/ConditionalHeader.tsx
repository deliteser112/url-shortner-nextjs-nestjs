'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'

export default function ConditionalHeader() {
  const pathname = usePathname()

  const hideHeader =
    /^\/[^\/]+$/.test(pathname) &&
    !['/dashboard', '/login', '/register', '/slug'].includes(pathname)

  return !hideHeader ? <Header /> : null
}
