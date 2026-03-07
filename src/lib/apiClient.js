// // src/lib/apiClient.js
// import { getAuthToken, clearAuthSession } from "./authStorage";

// const BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   "https://hinansho-client-portal-backend.onrender.com";

// export async function apiRequest(path, { method = "GET", body, headers } = {}) {
//   const token = getAuthToken();

//   const res = await fetch(`${BASE_URL}${path}`, {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(headers || {}),
//     },
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   const text = await res.text();
//   let data = null;

//   try {
//     data = text ? JSON.parse(text) : null;
//   } catch {
//     data = text || null;
//   }

//   if (!res.ok) {
//     if (res.status === 401) clearAuthSession();

//     const message =
//       (data && (data.message || data.error)) || `Request failed (${res.status})`;
//     const err = new Error(message);
//     err.status = res.status;
//     err.data = data;
//     throw err;
//   }

//   return data;
// }
// src/lib/apiClient.js
import { getAuthToken, clearAuthSession } from "./authStorage";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://hinansho-client-portal-backend.onrender.com";

export async function apiRequest(path, { method = "GET", body, headers, timeoutMs = 30000 } = {}) {
  const token = getAuthToken();
  console.log("Retrieved token:", token); 
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text || null;
    }

    if (!res.ok) {
      if (res.status === 401) clearAuthSession();
      const message =
        (data && (data.message || data.error)) || `Request failed (${res.status})`;
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request is taking longer than usual. The investor may have been created—please refresh and search before retrying.");
    }
    throw err;
  } finally {
    clearTimeout(t);
  }
}
