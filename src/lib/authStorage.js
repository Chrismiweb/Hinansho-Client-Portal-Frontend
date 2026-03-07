// // src/lib/authStorage.js
// const KEY = "hinansho_auth";

// export function setAuthSession(data) {
//   // data = { token, user, forcePasswordChange }
//   if (typeof window === "undefined") return;
//   localStorage.setItem(KEY, JSON.stringify(data));
// }

// export function getAuthSession() {
//   if (typeof window === "undefined") return null;
//   const raw = localStorage.getItem(KEY);
//   if (!raw) return null;

//   try {
//     return JSON.parse(raw);
//   } catch {
//     return null;
//   }
// }

// export function getAuthToken() {
//   return getAuthSession()?.token || null;
// }

// export function clearAuthSession() {
//   if (typeof window === "undefined") return;
//   localStorage.removeItem(KEY);
// }
// src/lib/authStorage.js


const KEY = "hinansho_auth";  // Make sure this is the correct key

// Save the session (token, user data, etc.) to localStorage
export function setAuthSession(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

// Retrieve the session from localStorage
export function getAuthSession() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    console.error("Error parsing session data");
    return null;
  }
}

// Get the token from the session
// export function getAuthToken() {
//   const session = getAuthSession();
//   return session?.token || null;
// }
export function getAuthToken() {
  const session = getAuthSession();
  return session?.token || null; // Ensure you're getting the token from the session
}
// Clear the session
export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}