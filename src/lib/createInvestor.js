// src/lib/investorService.js
import { apiRequest } from "./apiClient";

export function createInvestor(payload) {
  return apiRequest("/admin/createInvestor", {
    method: "POST",
    body: payload,
  });
}
