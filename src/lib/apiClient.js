// src/lib/apiClient.js

// Get token from localStorage
function getToken() {
  return localStorage.getItem('prepdart_auth_token');
}

export async function apiFetch(path, opts = {}) {
  // 1. Prepare headers
  const headers = {
    ...opts.headers,
  };

  // 2. Add Authorization header if token exists
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 3. If there is a body and it's an object, stringify it and set Content-Type
  if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
    opts.body = JSON.stringify(opts.body);
    headers['Content-Type'] = 'application/json';
  }

  // 4. Pass all options (method, body, headers, etc.) to fetch
  const res = await fetch(path, {
    ...opts,
    headers,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    let errorData;
    try {
      errorData = JSON.parse(errText);
    } catch {
      errorData = { error: errText || res.statusText };
    }
    
    // Handle 401 Unauthorized - invalid or expired token
    if (res.status === 401) {
      // Clear token from localStorage
      localStorage.removeItem('prepdart_auth_token');
      localStorage.removeItem('prepdart_user');
      // Dispatch a custom event that AuthContext can listen to
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    
    const error = new Error(errorData.error || res.statusText);
    error.status = res.status;
    error.data = errorData;
    throw error;
  }

  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
}