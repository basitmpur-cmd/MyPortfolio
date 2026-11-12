// Small fetch wrapper for the backend API.
// VITE_API_URL can point at a deployed API; locally the Vite proxy forwards /api to Express.
const BASE = (import.meta.env.VITE_API_URL || '') + '/api';
export const TOKEN_KEY = 'portfolio_token';

export class ApiError extends Error {
  constructor(message, status, errors) { super(message); this.status = status; this.errors = errors || {}; }
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError('Cannot reach the server. Is the API running?', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || data.message || `Request failed (${res.status})`, res.status, data.errors);
  return data;
}
