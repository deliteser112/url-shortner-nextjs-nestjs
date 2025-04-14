export function getUrlValidationError(url: string): string | null {
    if (!url) return 'URL is required'
  
    try {
      const parsed = new URL(url)
  
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return 'Only http and https URLs are supported'
      }
  
      return null
    } catch {
      return 'Please enter a valid URL (e.g. https://example.com)'
    }
  }
  