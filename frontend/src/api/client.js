export const API_URL = "http://localhost:8000";

export async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));

    const error = new Error(errorData.detail || `HTTP ${res.status}`);

    error.response = {
      status: res.status,
      data: errorData,
    };

    throw error;
  }

  if (res.status === 204) return null;

  return await res.json();
}
