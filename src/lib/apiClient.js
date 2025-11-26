export async function apiFetch(path, opts = {}) {
  const res = await fetch(path)
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    const error = new Error(errText || res.statusText)
    error.status = res.status
    throw error
  }

  const contentType = res.headers.get('content-type') || ''
  return contentType.includes('application/json') ? res.json() : res.text()
}
