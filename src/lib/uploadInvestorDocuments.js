// src/lib/uploadInvestorDocuments.js
import { getAuthToken } from "@/lib/authStorage";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://hinansho-client-portal-backend.onrender.com";
  // "http://localhost:7500";

export async function uploadInvestorDocuments({
  investorId,
  files, 
  documentType, 
  propertyId, 
}) {
  const token = getAuthToken();
  if (!token) throw new Error("Token is missing. Please login again.");

  if (!investorId) throw new Error("Investor ID is missing.");
  if (!files?.length) throw new Error("Please select at least one document.");
  if (!documentType) throw new Error("Document type is required.");
  if (!propertyId) throw new Error("Property ID is required.");

  const fd = new FormData();

  // backend expects multiple "documents" keys
  files.forEach((file) => fd.append("documents", file));
  
  fd.append("documentType", documentType);
  fd.append("propertyId", propertyId);

  const res = await fetch(`${BASE_URL}/admin/investors/${investorId}/documents`, {
    method: "POST",
    headers: {
      token, 
    },
    body: fd,
  });
  
  
// your docs say no response body; still handle safely
  if (!res.ok) {
    let msg = `Upload failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch {}
    throw new Error(msg);
  }

  return true;
}
