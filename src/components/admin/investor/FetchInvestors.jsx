"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { apiRequest } from "@/lib/apiClient";
import InvestorDetailsModal from "./InvestorDetailsModal";
import AssignPropertyModal from "./AssignPropertyModal";

const STATUS_OPTIONS = ["All Status", "Active", "Pending", "Deactivated"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(nameOrEmail = "") {
  const str = String(nameOrEmail).trim();
  if (!str) return "??";
  const parts = str.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  const beforeAt = str.includes("@") ? str.split("@")[0] : str;
  return beforeAt.slice(0, 2).toUpperCase();
}

function formatMoney(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "₦0";
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
}

function formatLastLogin(dateStr) {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Never";
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) === 1 ? "" : "s"} ago`;
}

function normaliseInvestor(inv) {
  let status = inv.status || "Pending";
  if (inv.forcePasswordChange === true) status = "Pending";
  if (!inv.lastLogin && status !== "Deactivated") status = "Pending";
  return {
    ...inv,
    propertiesOwned: Number(inv.propertiesCount ?? 0),
    totalInvestment: Number(inv.totalInvestment ?? 0),
    status,
    lastLogin: formatLastLogin(inv.lastLogin),
    displayName: inv.fullName?.trim() || inv.email?.split("@")?.[0] || "Unknown Investor",
    displayEmail: inv.email || "no-email@example.com",
  };
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto transition-all duration-300 min-w-[260px] max-w-sm ${
            t.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : t.type === "error"
              ? "bg-red-50 text-red-800 border border-red-200"
              : "bg-white text-gray-800 border border-gray-200"
          }`}
        >
          <span className="text-base shrink-0">
            {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}
          </span>
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => onRemove(t.id)}
            className="text-gray-400 hover:text-gray-600 shrink-0"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, addToast, removeToast };
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ investor, onConfirm, onCancel, loading }) {
  if (!investor) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h3 className="text-[17px] font-bold text-gray-900 text-center mb-2">
          Deactivate Account
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to deactivate{" "}
          <span className="font-semibold text-gray-800">{investor.displayName}</span>?
          They will lose access to the portal immediately.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Deactivating..." : "Yes, Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function BuildingIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20V6.5C4 5.67 4.67 5 5.5 5H11V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 9H18.5C19.33 9 20 9.67 20 10.5V20H11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8.5H8.5M7 11.5H8.5M7 14.5H8.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M14 12H15.5M14 15H15.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function FilterIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H20M7 12H17M10 18H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function MoreIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H5.01M12 12H12.01M19 12H19.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function ChevronDown({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatusPill({ status }) {
  const map = {
    Active:      "bg-green-50 text-green-700 ring-green-200",
    Pending:     "bg-amber-50 text-amber-700 ring-amber-200",
    Deactivated: "bg-red-50 text-red-600 ring-red-200",
  };
  const cls = map[status] || "bg-gray-50 text-gray-600 ring-gray-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      {status}
    </span>
  );
}

// ── Mobile card ───────────────────────────────────────────────────────────────
function InvestorCard({ inv, onView, onAssign, onDeactivate }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden">
      <div className="w-full flex flex-col p-4">
        <div className="flex gap-3 items-center">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-amber-700 ring-1 ring-gray-200">
            {getInitials(inv.displayName || inv.displayEmail)}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{inv.displayName}</p>
            <p className="text-xs text-gray-500 truncate">{inv.displayEmail}</p>
          </div>
        </div>
        <div className="flex items-center justify-end mt-2 gap-2">
          <StatusPill status={inv.status} />
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">Properties</p>
              <span className="text-sm font-semibold text-gray-800">{inv.propertiesOwned}</span>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">Investment</p>
              <p className="text-sm font-semibold text-gray-800">{formatMoney(inv.totalInvestment)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Last login</span>
            <span className="text-gray-600 font-medium">{inv.lastLogin}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => { onView(inv._id); setExpanded(false); }}
              className="py-2 rounded-xl border border-gray-200 text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              View Details
            </button>
            <button
              onClick={() => { onAssign(inv._id); setExpanded(false); }}
              className="py-2 rounded-xl bg-[#0F172A] text-[12px] font-medium text-white hover:opacity-90 transition"
            >
              Assign Property
            </button>
          </div>
          <button
            onClick={() => { onDeactivate(inv); setExpanded(false); }}
            disabled={inv.status === "Deactivated"}
            className="w-full py-2 rounded-xl border border-red-100 text-[12px] font-medium text-red-500 hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {inv.status === "Deactivated" ? "Already Deactivated" : "Deactivate Account"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FetchInvestorsStyled({ refetchTrigger }) {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewInvestorId, setViewInvestorId] = useState(null);
  const [assignInvestorId, setAssignInvestorId] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openFilter, setOpenFilter] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState(null);

  const { toasts, addToast, removeToast } = useToast();
  const actionMenuRef = useRef(null);
  const dropdownRef = useRef(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchInvestors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/admin/getInvestors");
      const raw = Array.isArray(data) ? data : Array.isArray(data?.investors) ? data.investors : null;
      if (!raw) throw new Error("Unexpected response format from server");

      const normalized = raw
        .map(normaliseInvestor)
        .sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (tb !== ta) return tb - ta;
          return (b._id || "").localeCompare(a._id || "");
        });

      setInvestors(normalized);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInvestors(); }, [fetchInvestors, refetchTrigger]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpenFilter(false);
      if (!actionMenuRef.current?.contains(e.target)) setOpenActionMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Deactivate ────────────────────────────────────────────────────────────
  const handleDeactivateConfirm = async () => {
    if (!deactivateTarget) return;
    setDeactivateLoading(true);
    try {
      // Route: PUT /admin/suspend-user/:userId
      await apiRequest(`/admin/suspend-user/${deactivateTarget._id}`, { method: "PUT" });
      setInvestors((prev) =>
        prev.map((i) => i._id === deactivateTarget._id ? { ...i, status: "Deactivated" } : i)
      );
      addToast(`${deactivateTarget.displayName} has been deactivated.`, "success");
    } catch (err) {
      addToast(err.message || "Failed to deactivate investor.", "error");
    } finally {
      setDeactivateLoading(false);
      setDeactivateTarget(null);
    }
  };

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return investors.filter((inv) => {
      const matchesQuery = !q ||
        inv.displayName.toLowerCase().includes(q) ||
        inv.displayEmail.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All Status" || inv.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [investors, query, statusFilter]);

  if (loading) return <div className="text-center py-10 text-sm text-gray-500">Loading investors...</div>;
  if (error) return <div className="text-center py-10 text-sm text-red-600">Error: {error.message}</div>;

  // ── Top bar ───────────────────────────────────────────────────────────────
  const TopBar = (
    <div className="w-full flex flex-col gap-3 p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="w-[60%] lg:w-[40%]">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search investors..."
            className="w-full rounded-xl bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 ring-1 ring-inset ring-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpenFilter((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
        >
          <FilterIcon className="h-4 w-4 text-gray-500" />
          <span>Status: {statusFilter === "All Status" ? "All" : statusFilter}</span>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-400">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
          </svg>
        </button>
        {openFilter && (
          <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl bg-white p-1 shadow-lg ring-1 ring-gray-200">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => { setStatusFilter(opt); setOpenFilter(false); }}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm ${statusFilter === opt ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="lg:w-full mt-[40px] mb-[50px] min-w-0">
      {/* Toast notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Confirm deactivate modal */}
      <ConfirmModal
        investor={deactivateTarget}
        onConfirm={handleDeactivateConfirm}
        onCancel={() => setDeactivateTarget(null)}
        loading={deactivateLoading}
      />

      {/* Mobile cards */}
      <div className="md:hidden">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden mb-3">{TopBar}</div>
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-sm text-gray-500">No investors found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inv, idx) => (
              <InvestorCard
                key={`${inv._id || inv.email}-${idx}`}
                inv={inv}
                onView={(id) => setViewInvestorId(id)}
                onAssign={(id) => setAssignInvestorId(id)}
                onDeactivate={(inv) => setDeactivateTarget(inv)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
        {TopBar}
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full">
            <thead>
              <tr className="border-t border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-600">
                <th className="px-6 py-3">Investor</th>
                <th className="px-6 py-3">Properties Owned</th>
                <th className="px-6 py-3">Total Investment</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Last Login</th>
                <th className="px-6 py-3 text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((inv, idx) => (
                <tr key={`${inv._id || inv.email}-${idx}`} className="hover:bg-gray-50/60">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-amber-700 ring-1 ring-gray-200">
                        {getInitials(inv.displayName || inv.displayEmail)}
                      </div>
                      <div className="leading-tight">
                        <div className="text-sm font-semibold text-gray-900">{inv.displayName}</div>
                        <div className="text-xs text-gray-500">{inv.displayEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <BuildingIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{inv.propertiesOwned}</span>
                      <span className="text-gray-500">Properties</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{formatMoney(inv.totalInvestment)}</div>
                  </td>
                  <td className="px-6 py-4"><StatusPill status={inv.status} /></td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{inv.lastLogin}</div>
                  </td>
                  <td className="px-6 py-4 text-right overflow-visible">
                    <div className="relative" ref={openActionMenu === inv._id ? actionMenuRef : null}>
                      <button
                        type="button"
                        onClick={() => setOpenActionMenu(openActionMenu === inv._id ? null : inv._id)}
                        className="inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <MoreIcon className="h-5 w-5" />
                      </button>

                      {openActionMenu === inv._id && (
                        <div className="absolute right-0 z-30 bottom-full mb-1 w-56 rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-[15px] font-semibold text-gray-900">Actions</p>
                          </div>
                          <div className="py-1">
                            {[
                              { label: "View Details",      onClick: () => setViewInvestorId(inv._id) },
                              { label: "Assign Properties", onClick: () => setAssignInvestorId(inv._id) },
                              { label: "Manage Documents",  onClick: () => setViewInvestorId(inv._id) },
                            ].map(({ label, onClick }) => (
                              <button
                                key={label}
                                type="button"
                                onClick={() => { onClick(); setOpenActionMenu(null); }}
                                className="flex w-full px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-50 transition"
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                          <div className="border-t border-gray-100 py-1">
                            <button
                              type="button"
                              disabled={inv.status === "Deactivated"}
                              onClick={() => { setDeactivateTarget(inv); setOpenActionMenu(null); }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-[14px] text-red-500 hover:bg-red-50 transition font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {inv.status === "Deactivated" ? "Already Deactivated" : "Deactivate Account"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    No investors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvestorDetailsModal open={!!viewInvestorId} onClose={() => setViewInvestorId(null)} investorId={viewInvestorId} />
      <AssignPropertyModal
        open={!!assignInvestorId}
        onClose={() => setAssignInvestorId(null)}
        investorId={assignInvestorId}
        onAssigned={() => { setAssignInvestorId(null); fetchInvestors(); }}
      />
    </div>
  );
}
