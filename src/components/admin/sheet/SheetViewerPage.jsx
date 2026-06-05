"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { apiRequest } from "@/lib/apiClient";

const TAB_COLORS = {
  "INVESTORS":           "bg-[#0F172A] text-white",
  "OWNERSHIPS":          "bg-[#155E75] text-white",
  "PROPERTIES":          "bg-[#DDA04E] text-white",
  "Farm Management Fee": "bg-[#166534] text-white",
};

const getTabStyle = (name, active) =>
  active
    ? TAB_COLORS[name] || "bg-gray-700 text-white"
    : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]";

export default function SheetViewerPage() {
  const [sheets, setSheets]           = useState([]);
  const [data, setData]               = useState({});
  const [activeSheet, setActiveSheet] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState("");

  // Edit state
  const [editingCell, setEditingCell]   = useState(null); // { rowIndex, colIndex }
  const [editValue, setEditValue]       = useState("");
  const [savingCell, setSavingCell]     = useState(false);

  // Delete state
  const [deletingRow, setDeletingRow]   = useState(null); // rowIndex
  const [confirmDelete, setConfirmDelete] = useState(null); // rowIndex
  const [toast, setToast]               = useState(null);

  const editInputRef = useRef(null);

  // ── Toast ────────────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch data ───────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest("/admin/sheet/data");
      if (res.success) {
        setSheets(res.sheets);
        setData(res.data);
        if (!activeSheet) setActiveSheet(res.sheets[0]);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingCell) editInputRef.current?.focus();
  }, [editingCell]);

  // ── Edit cell ────────────────────────────────────────────────────────────
  const startEdit = (rowIndex, colIndex, currentValue) => {
    setEditingCell({ rowIndex, colIndex });
    setEditValue(currentValue);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const saveEdit = async () => {
    if (!editingCell) return;
    setSavingCell(true);
    try {
      await apiRequest("/admin/sheet/cell", {
        method: "PUT",
        body: {
          sheetName: activeSheet,
          rowIndex:  editingCell.rowIndex,
          colIndex:  editingCell.colIndex,
          value:     editValue,
        },
      });

      // Update local data immediately
      setData(prev => {
        const updated = prev[activeSheet].map((row, ri) =>
          ri === editingCell.rowIndex
            ? row.map((cell, ci) => ci === editingCell.colIndex ? editValue : cell)
            : row
        );
        return { ...prev, [activeSheet]: updated };
      });

      showToast("Cell updated successfully");
      cancelEdit();
    } catch (err) {
      showToast(err.message || "Failed to update cell", "error");
    } finally {
      setSavingCell(false);
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter")  saveEdit();
    if (e.key === "Escape") cancelEdit();
  };

  // ── Delete row ───────────────────────────────────────────────────────────
  const handleDeleteRow = async (rowIndex) => {
    setDeletingRow(rowIndex);
    setConfirmDelete(null);
    try {
      await apiRequest("/admin/sheet/row", {
        method: "DELETE",
        body: { sheetName: activeSheet, rowIndex },
      });

      // Remove from local data
      setData(prev => ({
        ...prev,
        [activeSheet]: prev[activeSheet].filter((_, ri) => ri !== rowIndex),
      }));

      showToast("Row deleted successfully");
    } catch (err) {
      showToast(err.message || "Failed to delete row", "error");
    } finally {
      setDeletingRow(null);
    }
  };

  // ── Current sheet data ───────────────────────────────────────────────────
  const rows      = data[activeSheet] || [];
  const headerRow = rows[0] || [];
  const dataRows  = rows.slice(1);

  const filtered = search.trim()
    ? dataRows.filter(row =>
        row.some(cell => String(cell || "").toLowerCase().includes(search.toLowerCase()))
      )
    : dataRows;

  // Get original row index (needed for delete/edit when filtered)
  const getOriginalRowIndex = (filteredIndex) => {
    if (!search.trim()) return filteredIndex + 1; // +1 because header is row 0
    const row = filtered[filteredIndex];
    return dataRows.findIndex(r => r === row) + 1;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium min-w-[260px] ${
          toast.type === "error"
            ? "bg-red-50 text-red-800 border border-red-200"
            : "bg-green-50 text-green-800 border border-green-200"
        }`}>
          <span>{toast.type === "error" ? "❌" : "✅"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-[17px] font-bold text-gray-900 text-center mb-2">Delete Row</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              This will permanently delete this row from the Google Sheet. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRow(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Data Sheet</h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Live view from Google Sheets — edits reflect immediately
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-gray-50 transition disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      


      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DDA04E] border-t-transparent" />
          <span className="ml-3 text-sm text-gray-500">Loading from Google Sheets...</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium mb-2">❌ {error}</p>
          <p className="text-sm text-red-400">
            Make sure the Google Sheet has been shared with the service account email and your environment variables are set correctly.
          </p>
        </div>
      )}

      {/* Sheet viewer */}
      {!loading && !error && sheets.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">

          {/* Tabs */}
          <div className="flex gap-2 p-4 border-b border-[#E2E8F0] overflow-x-auto">
            {sheets.map(sheet => (
              <button
                key={sheet}
                onClick={() => { setActiveSheet(sheet); setSearch(""); cancelEdit(); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${getTabStyle(sheet, activeSheet === sheet)}`}
              >
                {sheet}
                <span className="ml-2 text-[11px] opacity-70">
                  ({Math.max(0, (data[sheet]?.length || 1) - 1)} rows)
                </span>
              </button>
            ))}
          </div>

          {/* Search + info bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <div className="relative w-full sm:w-72">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search in ${activeSheet}...`}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#DDA04E] transition"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#64748B]">
                <span className="font-bold text-[#0F172A]">{filtered.length}</span> / {dataRows.length} rows
              </span>
              <span className="text-xs text-[#94A3B8]">Double-click a cell to edit</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="bg-[#F1F5F9] border-b border-[#E2E8F0]">
                  <th className="px-3 py-3 text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider w-8">#</th>
                  {headerRow.filter(Boolean).map((col, ci) => (
                    <th key={ci} className="px-4 py-3 text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center text-[11px] font-bold text-[#64748B] uppercase tracking-wider w-16">Del</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={headerRow.filter(Boolean).length + 2} className="px-4 py-10 text-center text-sm text-[#94A3B8]">
                      {search ? `No results for "${search}"` : "No data"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, filteredIdx) => {
                    const origRowIndex = getOriginalRowIndex(filteredIdx);
                    const isDeleting   = deletingRow === origRowIndex;

                    return (
                      <tr key={filteredIdx} className={`hover:bg-[#F8FAFC] transition ${isDeleting ? "opacity-40" : ""}`}>
                        {/* Row number */}
                        <td className="px-3 py-3 text-[11px] text-[#94A3B8] font-mono">{filteredIdx + 1}</td>

                        {/* Data cells */}
                        {headerRow.map((col, ci) => {
                          if (!col) return null;
                          const cell      = row[ci] || "";
                          const isEditing = editingCell?.rowIndex === origRowIndex && editingCell?.colIndex === ci;

                          return (
                            <td
                              key={ci}
                              onDoubleClick={() => !isEditing && startEdit(origRowIndex, ci, cell)}
                              className="px-4 py-3 whitespace-nowrap cursor-pointer group relative"
                              title="Double-click to edit"
                            >
                              {isEditing ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    ref={editInputRef}
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    onKeyDown={handleEditKeyDown}
                                    className="w-full min-w-[120px] px-2 py-1 text-sm border-2 border-[#DDA04E] rounded-lg focus:outline-none bg-white"
                                  />
                                  <button
                                    onClick={saveEdit}
                                    disabled={savingCell}
                                    className="p-1 text-green-600 hover:bg-green-50 rounded transition"
                                    title="Save (Enter)"
                                  >
                                    {savingCell
                                      ? <span className="w-4 h-4 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin inline-block" />
                                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    }
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="p-1 text-gray-400 hover:bg-gray-100 rounded transition"
                                    title="Cancel (Escape)"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                  </button>
                                </div>
                              ) : (
                                <span className={`${!cell ? "text-[#CBD5E1]" : "text-[#1E293B]"} group-hover:underline group-hover:decoration-dotted group-hover:decoration-[#DDA04E]`}>
                                  {cell || "—"}
                                </span>
                              )}
                            </td>
                          );
                        })}

                        {/* Delete button */}
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => setConfirmDelete(origRowIndex)}
                            disabled={isDeleting}
                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
                            title="Delete row"
                          >
                            {isDeleting
                              ? <span className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin inline-block" />
                              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            }
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {activeSheet === "INVESTORS" && (
            <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap gap-6 text-xs text-[#64748B]">
              <span>Total: <strong className="text-[#0F172A]">{dataRows.length}</strong> investors</span>
              <span>Receivable: <strong className="text-[#0F172A]">₦{dataRows.reduce((sum, r) => sum + (Number(String(r[5]||"").replace(/[^0-9]/g,""))||0), 0).toLocaleString("en-NG")}</strong></span>
              <span>Received: <strong className="text-green-700">₦{dataRows.reduce((sum, r) => sum + (Number(String(r[6]||"").replace(/[^0-9]/g,""))||0), 0).toLocaleString("en-NG")}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
