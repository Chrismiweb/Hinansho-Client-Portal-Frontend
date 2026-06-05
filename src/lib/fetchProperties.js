// lib/fetchProperties.js
import { getAuthToken } from "@/lib/authStorage";

export async function fetchProperties() {
  const token = getAuthToken();
  if (!token) throw new Error("Token is missing.");

  const res = await fetch(
    // "https://hinansho-client-portal-backend.onrender.com/admin/fetch-properties",
    "https://hinansho-client-portal-backend.onrender.com/admin/fetch-properties", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // if you have CORS/cookies needs, you can add:
    // credentials: "include",
  });

  // Some APIs return empty body on error, so guard it
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // ignore parse error
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || `Failed to fetch properties (${res.status})`;
    throw new Error(msg);
  }

  if (!data?.success) {
    throw new Error(data?.message || "Failed to fetch properties.");
  }

  return data.properties || [];
}