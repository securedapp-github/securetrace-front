// SecureTrace API Base URL
// In development, leave empty or use http://localhost:5000 (Vite proxy forwards /api to localhost:5000)
// In production, set to your backend URL: https://securetrace-api.securedapp.io
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

/**
 * Builds the full API URL for a given path.
 * In development without VITE_API_URL, returns '/api/...' (handled by Vite dev proxy).
 * When VITE_API_URL is configured (e.g. 'https://securetrace-api.securedapp.io'), returns 'https://securetrace-api.securedapp.io/api/...'.
 *
 * @param {string} endpoint - Path such as '/api/auth/google'
 * @returns {string} Full URL or relative path
 */
export function getApiUrl(endpoint) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
}
