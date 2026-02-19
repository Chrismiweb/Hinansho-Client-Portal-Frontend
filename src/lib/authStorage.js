// src/lib/authStorage.js
const KEY = "hinansho_auth";

export function setAuthSession(data) {
  // data = { token, user, forcePasswordChange }
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getAuthSession() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return getAuthSession()?.token || null;
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
