export const API_URL = "http://127.0.0.1:8000";

export async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null;

  return await res.json();
}
