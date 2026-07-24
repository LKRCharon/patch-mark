import { STORAGE_KEY_TOKEN, TOKEN_PARAM } from './identity.js';

/**
 * Access-token handling for the optional auth flow (see README "Access
 * control"). Token resolution order: in-memory copy → localStorage.
 * The memory copy doubles as a private-browsing fallback, where
 * localStorage.setItem throws and the token would otherwise be lost.
 */
let memoryToken: string | null = null;

export function getAuthToken(): string | null {
  if (memoryToken) return memoryToken;
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY_TOKEN);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  const value = token.trim();
  if (!value) return;
  memoryToken = value;
  try {
    window.localStorage.setItem(STORAGE_KEY_TOKEN, value);
  } catch {
    // Storage unavailable — the memory copy keeps this session working.
  }
}

export function clearAuthToken(): void {
  memoryToken = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY_TOKEN);
  } catch {
    // ignore
  }
}

// Capture ?pm_token= from sharing links on module load, persist it, then
// scrub the address bar so the token never leaks via screenshots,
// copy-pasted URLs, or referrer headers on subsequent navigation.
function captureTokenFromUrl(): void {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    const token = url.searchParams.get(TOKEN_PARAM);
    if (!token) return;
    setAuthToken(token);
    url.searchParams.delete(TOKEN_PARAM);
    window.history.replaceState(null, '', url);
  } catch {
    // Odd environment (no history API, unparseable URL) — stay tokenless.
  }
}

captureTokenFromUrl();
