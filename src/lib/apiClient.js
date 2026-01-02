// src/lib/apiClient.js

export async function apiFetch(path, opts = {}) {
  // 1. Prepare headers
  const headers = {
    ...opts.headers,
  };

  // 2. If there is a body and it's an object, stringify it and set Content-Type
  if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
    opts.body = JSON.stringify(opts.body);
    headers['Content-Type'] = 'application/json';
  }

  // if (options.body && !(options.body instanceof FormData)) {
  //   options.body = JSON.stringify(options.body);
  //   options.headers = {
  //     "Content-Type": "application/json",
  //     ...options.headers,
  //   };
  // }

  // 3. Pass all options (method, body, headers, etc.) to fetch
  const res = await fetch(path, {
    ...opts,
    headers,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    const error = new Error(errText || res.statusText);
    error.status = res.status;
    throw error;
  }

  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
}