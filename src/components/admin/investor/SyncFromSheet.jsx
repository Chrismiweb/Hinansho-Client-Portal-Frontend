"use client";

import { useState, useRef } from "react";
import { getAuthToken } from "@/lib/authStorage";
import { BASE_URL } from "@/lib/apiClient";

export default function SyncFromSheet({ onSyncComplete }) {
  const [syncing, setSyncing] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const handleSync = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!allowed.includes(file.type)) {
      setError("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    setSyncing(true);
    setResult(null);
    setError(null);

    try {
      const token = getAuthToken();
      const form = new FormData();
      form.append("sheet", file);

      const res = await fetch(`${BASE_URL}/admin/sync-from-sheet`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Sync failed (${res.status})`);

      setResult(data.results);
      onSyncComplete?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSyncing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSendCredentials = async () => {
    if (!confirm("Send login credentials to all pending investors? This will email them their username and temporary password.")) return;
    setSending(true);
    setError(null);
    try {
      const token = getAuthToken();
      const res = await fetch(`${BASE_URL}/admin/send-credentials`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to send credentials");
      setResult((prev) => ({ ...prev, credentialsSent: data.sent, credentialErrors: data.errors }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-[16px] font-bold text-[#0F172A]">Sync from Google Sheet</h3>
          <p className="text-[13px] text-[#62748E] mt-0.5">
            Upload the Excel sheet to import investors, properties and ownerships into the database.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          {/* Sync button */}
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleSync}
            className="hidden"
            id="sheetUpload"
          />
          <label
            htmlFor="sheetUpload"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition ${
              syncing
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#0F172A] text-white hover:bg-[#1E293B]"
            }`}
          >
            {syncing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload & Sync Sheet
              </>
            )}
          </label>

          {/* Send credentials button */}
          <button
            onClick={handleSendCredentials}
            disabled={sending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#DDA04E] text-[#DDA04E] hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <span className="w-4 h-4 border-2 border-[#DDA04E]/30 border-t-[#DDA04E] rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Credentials
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          ❌ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-4 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
          <p className="text-sm font-semibold text-[#0F172A] mb-3">✅ Sync Complete</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {[
              { label: "Properties Created", value: result.properties?.created ?? 0, color: "text-green-600" },
              { label: "Properties Updated", value: result.properties?.updated ?? 0, color: "text-blue-600" },
              { label: "Investors Created",  value: result.investors?.created  ?? 0, color: "text-green-600" },
              { label: "Investors Updated",  value: result.investors?.updated  ?? 0, color: "text-blue-600" },
              { label: "Investors Skipped",  value: result.investors?.skipped  ?? 0, color: "text-gray-500"  },
              { label: "Ownerships Created", value: result.ownerships?.created ?? 0, color: "text-green-600" },
              { label: "Ownerships Updated", value: result.ownerships?.updated ?? 0, color: "text-blue-600" },
              ...(result.credentialsSent != null
                ? [{ label: "Credentials Sent", value: result.credentialsSent, color: "text-[#DDA04E]" }]
                : []),
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
                <p className="text-[11px] text-[#62748E] uppercase tracking-wide">{item.label}</p>
                <p className={`text-[22px] font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Errors from sync */}
          {[
            ...(result.properties?.errors || []),
            ...(result.investors?.errors  || []),
            ...(result.ownerships?.errors || []),
            ...(result.credentialErrors   || []),
          ].length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-red-600 mb-1">⚠️ Warnings ({[
                ...(result.properties?.errors || []),
                ...(result.investors?.errors  || []),
                ...(result.ownerships?.errors || []),
                ...(result.credentialErrors   || []),
              ].length}):</p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {[
                  ...(result.properties?.errors || []),
                  ...(result.investors?.errors  || []),
                  ...(result.ownerships?.errors || []),
                  ...(result.credentialErrors   || []),
                ].map((e, i) => (
                  <p key={i} className="text-[11px] text-red-500 bg-red-50 rounded px-2 py-1">{e}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
