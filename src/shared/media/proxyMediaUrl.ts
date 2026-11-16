const MINIO_PROXY_PREFIX = '/s3'

/**
 * Keeps media requests on the Vite origin. The backend currently returns public
 * MinIO URLs with port 9000; the browser must use the /s3 proxy route instead.
 * Other absolute URLs are deliberately left untouched.
 */
export function proxyMediaUrl(value?: string): string | undefined {
  const rawUrl = value?.trim()
  if (!rawUrl) return undefined

  if (rawUrl.startsWith(`${MINIO_PROXY_PREFIX}/`)) return rawUrl
  if (rawUrl.startsWith('/stylometry/')) return `${MINIO_PROXY_PREFIX}${rawUrl}`

  try {
    const parsedUrl = new URL(rawUrl)
    if (parsedUrl.port === '9000' && parsedUrl.pathname.startsWith('/stylometry/')) {
      return `${MINIO_PROXY_PREFIX}${parsedUrl.pathname}${parsedUrl.search}`
    }
  } catch {
    // A relative non-MinIO URL is valid for a card and needs no conversion.
  }

  return rawUrl
}
