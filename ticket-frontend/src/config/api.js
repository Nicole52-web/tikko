/**
 * Backend base URL. Leave unset in development to use same-origin requests
 * (CRA "proxy" in package.json forwards /api and /uploads to the API server).
 * Set REACT_APP_API_URL in production, e.g. https://api.example.com
 */
const raw = process.env.REACT_APP_API_URL;
export const API_BASE = raw ? String(raw).replace(/\/$/, "") : "";

/** e.g. apiUrl("/api/v1/Event/all-events") */
export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

/** Poster and other files served by the API (/uploads/...) */
export function mediaUrl(relativePath) {
  if (!relativePath) return "";
  if (String(relativePath).startsWith("http")) return relativePath;
  const p = String(relativePath).startsWith("/")
    ? relativePath
    : `/${relativePath}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}
