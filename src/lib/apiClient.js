// src/lib/apiClient.js

export async function apiFetch(path, opts = {}) {
  // 1) Prepare headers
  const headers = {
    ...opts.headers,
  };

  // 2) If body is a plain object, stringify and set JSON header
  if (opts.body && typeof opts.body === "object" && !(opts.body instanceof FormData)) {
    opts.body = JSON.stringify(opts.body);
    headers["Content-Type"] = "application/json";
  }

  // 3) Fetch with cookies included (cookie-based auth)
  const res = await fetch(path, {
    ...opts,
    headers,
    credentials: "include", // ✅ IMPORTANT: send/receive cookies
  });

  // 4) Error handling
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    let errorData;
    try {
      errorData = JSON.parse(errText);
    } catch {
      errorData = { error: errText || res.statusText };
    }

    // If backend says unauthorized, trigger logout flow
    if (res.status === 401) {
      // ✅ Optional cleanup for legacy token-based auth leftovers
      localStorage.removeItem("prepdart_auth_token");
      localStorage.removeItem("prepdart_user");

      // Let AuthContext (or whoever) react
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }

    const error = new Error(errorData.error || res.statusText);
    error.status = res.status;
    error.data = errorData;
    throw error;
  }

  // 5) Return JSON or text
  const contentType = res.headers.get("content-type") || "";
  return contentType.includes("application/json") ? res.json() : res.text();
}
