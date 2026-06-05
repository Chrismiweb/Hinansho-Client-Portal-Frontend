"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/apiClient";

const MODES = [
  { id: "all",     label: "Send to All",           desc: "Send login details to every investor on the sheet", icon: "📨" },
  { id: "include", label: "Select Who to Include", desc: "Only send to specific investors you select",        icon: "✅" },
  { id: "exclude", label: "Select Who to Exclude", desc: "Send to everyone except the investors you select",  icon: "🚫" },
];

function ImportButton({ label, endpoint, step, stepColor }) {
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);

  const handleImport = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await apiRequest(endpoint, { method: "POST" });
      setResult(data);
    } catch (err) {
      setError(err.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 mb-4">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-6 h-6 rounded-full ${stepColor} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>{step}</span>
            <h3 className="text-[17px] font-bold text-[#0F172A]">{label}</h3>
          </div>
          <p className="text-[13px] text-[#62748E] ml-8">
            {step === "1" && "Imports all properties from the Google Sheet into the database."}
            {step === "2" && <>Creates investor accounts from the sheet. <strong>Password = first 6 digits of phone.</strong> Run after Step 1.</>}
          </p>
        </div>
        <button
          onClick={handleImport}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-sm font-semibold hover:bg-[#1E293B] transition disabled:opacity-60 whitespace-nowrap flex-shrink-0"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Importing...</>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {label}
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-800 font-semibold text-sm mb-3">✅ {result.message}</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Created", value: result.results?.created, color: "text-green-700" },
              { label: "Updated", value: result.results?.updated, color: "text-blue-700"  },
              { label: "Skipped", value: result.results?.skipped, color: "text-amber-600" },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-lg p-3 border border-green-100 text-center">
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">{item.label}</p>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value ?? 0}</p>
              </div>
            ))}
          </div>
          {result.results?.errors?.length > 0 && (
            <div className="mt-3 max-h-24 overflow-y-auto space-y-1">
              {result.results.errors.map((e, i) => (
                <p key={i} className="text-xs text-red-500 bg-red-50 rounded px-2 py-1">{e}</p>
              ))}
            </div>
          )}
        </div>
      )}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">❌ {error}</div>
      )}
    </div>
  );
}

export default function SendLoginDetails() {
  const [mode, setMode]             = useState("all");
  const [investors, setInvestors]   = useState([]);
  const [selected, setSelected]     = useState(new Set());
  const [search, setSearch]         = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [sending, setSending]       = useState(false);
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState(null);
  const [confirmed, setConfirmed]   = useState(false);

  useEffect(() => {
    if (mode === "include" || mode === "exclude") {
      setLoadingList(true);
      apiRequest("/admin/sheet/investors-list")
        .then(d => { if (d.success) setInvestors(d.investors); })
        .catch(err => setError(err.message))
        .finally(() => setLoadingList(false));
    }
    setSelected(new Set());
    setResult(null);
    setError(null);
    setConfirmed(false);
  }, [mode]);

  const toggleSelect = (email) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filteredInvestors.length) setSelected(new Set());
    else setSelected(new Set(filteredInvestors.map(i => i.email)));
  };

  const filteredInvestors = investors.filter(inv =>
    !search.trim() ||
    inv.name.toLowerCase().includes(search.toLowerCase()) ||
    inv.email.toLowerCase().includes(search.toLowerCase())
  );

  const getTargetCount = () => {
    if (mode === "all")     return investors.length || "all";
    if (mode === "include") return selected.size;
    if (mode === "exclude") return investors.length - selected.size;
    return 0;
  };

  const handleSend = async () => {
    setError(null);
    setResult(null);
    setSending(true);
    try {
      const data = await apiRequest("/admin/sheet/send-login-details", {
        method: "POST",
        body: { mode, emails: [...selected] },
      });
      setResult(data);
      setConfirmed(false);
    } catch (err) {
      setError(err.message || "Failed to send login details");
    } finally {
      setSending(false);
    }
  };

  const needsSelection = mode === "include" || mode === "exclude";
  const canSend = mode === "all" || selected.size > 0;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#F8FAFC]">

      {/* Step 1 — Import Properties */}
      <ImportButton
        label="Import Properties"
        endpoint="/admin/sheet/import-properties"
        step="1"
        stepColor="bg-[#155E75]"
      />

      {/* Step 2 — Import Investors */}
      <ImportButton
        label="Import Investors"
        endpoint="/admin/sheet/import-investors"
        step="2"
        stepColor="bg-[#0F172A]"
      />

      {/* Step 3 — Send Login Details */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-[#DDA04E] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
            <h3 className="text-[17px] font-bold text-[#0F172A]">Send Login Details</h3>
          </div>
          <p className="text-[13px] text-[#62748E] ml-8">
            Send email + temporary password (first 6 digits of phone) to investors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`text-left p-4 rounded-xl border-2 transition ${mode === m.id ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-[#E2E8F0] hover:border-[#0F172A] text-[#0F172A]"}`}
            >
              <div className="text-2xl mb-2">{m.icon}</div>
              <p className="font-semibold text-sm">{m.label}</p>
              <p className={`text-[12px] mt-1 ${mode === m.id ? "text-gray-300" : "text-[#64748B]"}`}>{m.desc}</p>
            </button>
          ))}
        </div>

        {needsSelection && (
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden mb-6">
            <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search investors..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#DDA04E]" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#64748B]"><strong>{selected.size}</strong> selected</span>
                <button onClick={toggleAll} className="text-xs font-semibold text-[#DDA04E] hover:underline">
                  {selected.size === filteredInvestors.length ? "Deselect All" : "Select All"}
                </button>
              </div>
            </div>
            {loadingList ? (
              <div className="py-8 text-center text-sm text-gray-400">Loading investors...</div>
            ) : (
              <div className="max-h-64 overflow-y-auto divide-y divide-[#F1F5F9]">
                {filteredInvestors.map(inv => (
                  <label key={inv.email} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFC] cursor-pointer">
                    <input type="checkbox" checked={selected.has(inv.email)} onChange={() => toggleSelect(inv.email)} className="w-4 h-4 accent-[#0F172A] rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] truncate">{inv.name}</p>
                      <p className="text-xs text-[#64748B] truncate">{inv.email}</p>
                    </div>
                    <span className="text-[11px] text-[#94A3B8] font-mono whitespace-nowrap">
                      {inv.phone ? `Pass: ${inv.phone.slice(0, 6)}` : "No phone"}
                    </span>
                  </label>
                ))}
                {filteredInvestors.length === 0 && <div className="py-6 text-center text-sm text-gray-400">No investors found</div>}
              </div>
            )}
          </div>
        )}

        {!result && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="flex-1 text-sm text-[#64748B]">
              {mode === "all"     && <>Will send to <strong className="text-[#0F172A]">all investors</strong> on the sheet</>}
              {mode === "include" && <>Will send to <strong className="text-[#0F172A]">{selected.size}</strong> selected investor{selected.size !== 1 ? "s" : ""}</>}
              {mode === "exclude" && <>Will send to <strong className="text-[#0F172A]">{investors.length - selected.size}</strong> investors{selected.size > 0 && ` (excluding ${selected.size})`}</>}
            </p>
            {!confirmed ? (
              <button onClick={() => setConfirmed(true)} disabled={!canSend || (needsSelection && selected.size === 0)}
                className="px-6 py-2.5 rounded-xl bg-[#DDA04E] text-white text-sm font-semibold hover:bg-[#C68E3D] transition disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap">
                Send Login Details
              </button>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setConfirmed(false)} className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#64748B] hover:bg-gray-50 transition">Cancel</button>
                <button onClick={handleSend} disabled={sending}
                  className="px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-sm font-semibold hover:bg-[#1E293B] transition disabled:opacity-60 flex items-center gap-2 whitespace-nowrap">
                  {sending ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</> : `✅ Confirm & Send to ${getTargetCount()}`}
                </button>
              </div>
            )}
          </div>
        )}

        {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">❌ {error}</div>}

        {result && (
          <div className="mt-4 p-5 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-800 font-semibold mb-3">✅ {result.message}</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Sent",    value: result.sent,            color: "text-green-700" },
                { label: "Skipped", value: result.skipped?.length, color: "text-amber-600" },
                { label: "Failed",  value: result.errors?.length,  color: "text-red-600"   },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-lg p-3 border border-green-100 text-center">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wide">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value ?? 0}</p>
                </div>
              ))}
            </div>
            <button onClick={() => { setResult(null); setSelected(new Set()); }} className="mt-3 text-sm text-green-700 font-medium hover:underline">
              Send another batch →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
