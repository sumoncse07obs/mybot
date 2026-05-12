const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const TOKEN_KEY = 'botapi_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.detail || data?.message || 'Request failed';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }

  return data as T;
}
