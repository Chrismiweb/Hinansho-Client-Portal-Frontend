"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiClient";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiExternalLink, FiCheck } from "react-icons/fi";

const formatCurrency = (n) => {
  if (!n) return "—";
  return `₦${Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
};

export default function ReceiptsPage() {
  const [receipts, setReceipts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selected, setSelected]         = useState(null);
  const [confirming, setConfirming]     = useState(null);
  const [confirmed, setConfirmed]       = useState(new Set());

  useEffect(() => {
    apiRequest("/admin/payment-receipts")
      .then(res => {
        if (res.success) setReceipts(res.receipts || []);
        else throw new Error(res.message);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = async (receipt) => {
    setConfirming(receipt._id);
    try {
      const res = await apiRequest(`/admin/payment-receipts/${receipt._id}/confirm`, { method: "PUT" });
      if (res.success) {
        setConfirmed(prev => new Set([...prev, receipt._id]));
        setSelected(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConfirming(null);
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#F8FAFC]">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[24px] font-bold text-[#0F172A]">Payment Receipts</h2>
        <p className="text-[14px] text-[#62748E] mt-1">
          All payment receipts submitted by investors
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#DDA04E] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600">{error}</div>
      )}

      {!loading && !error && receipts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#E2E8F0]">
          <IoDocumentTextOutline className="text-6xl text-gray-200 mb-4" />
          <p className="font-semibold text-[#0F172A]">No Receipts Yet</p>
          <p className="text-[#64748B] text-sm mt-1">Payment receipts submitted by investors will appear here.</p>
        </div>
      )}

      {!loading && !error && receipts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {receipts.map(receipt => {
            const isConfirmed = confirmed.has(receipt._id) || receipt.read;
            return (
              <div
                key={receipt._id}
                className={`bg-white rounded-2xl border-2 p-5 transition cursor-pointer hover:border-[#DDA04E] ${
                  isConfirmed ? "border-[#E2E8F0]" : "border-[#FDE68A]"
                }`}
                onClick={() => setSelected(receipt)}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-11 h-11 bg-[#0F172A] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-[14px]">
                      {getInitials(receipt.meta?.investorName || "?")}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[15px] text-[#0F172A]">{receipt.meta?.investorName}</p>
                        <p className="text-[13px] text-[#64748B]">{receipt.meta?.investorEmail}</p>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                        isConfirmed
                          ? "bg-[#F0FDF4] text-[#008236]"
                          : "bg-[#FFFBEB] text-[#E17100]"
                      }`}>
                        {isConfirmed ? "Confirmed ✓" : "Pending"}
                      </span>
                    </div>

                    <div className="flex gap-4 mt-3 flex-wrap">
                      <div>
                        <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide">Property</p>
                        <p className="text-[13px] font-semibold text-[#DDA04E]">{receipt.meta?.propertyName || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide">Amount</p>
                        <p className="text-[13px] font-semibold text-[#00A63E]">{formatCurrency(receipt.meta?.amount)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide">Submitted</p>
                        <p className="text-[13px] text-[#64748B]">{formatDate(receipt.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Receipt thumbnail */}
                {receipt.meta?.receiptUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden h-32 bg-gray-50">
                    <img
                      src={receipt.meta.receiptUrl}
                      alt="Receipt"
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Receipt Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">

            <div className="px-6 py-4 border-b border-[#F1F5F9] bg-[#F8FAFC] flex justify-between items-center">
              <h3 className="font-semibold text-[16px] text-[#0F172A]">Payment Receipt</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Investor info */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Investor", value: selected.meta?.investorName },
                  { label: "Email",    value: selected.meta?.investorEmail },
                  { label: "Property", value: selected.meta?.propertyName  },
                  { label: "Amount",   value: formatCurrency(selected.meta?.amount) },
                  { label: "Submitted", value: formatDate(selected.createdAt) },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide">{item.label}</p>
                    <p className="text-[14px] font-semibold text-[#0F172A] mt-0.5">{item.value || "—"}</p>
                  </div>
                ))}
              </div>

              {/* Receipt image */}
              {selected.meta?.receiptUrl && (
                <div>
                  <p className="text-[13px] font-semibold text-[#90A1B9] uppercase tracking-wider mb-2">Receipt Image</p>
                  <div className="rounded-xl overflow-hidden border border-[#E2E8F0]">
                    <img src={selected.meta.receiptUrl} alt="Receipt" className="w-full object-contain max-h-64" />
                  </div>
                  <a href={selected.meta.receiptUrl} target="_blank" rel="noreferrer"
                    className="mt-2 flex items-center gap-1.5 text-[13px] text-[#DDA04E] font-medium hover:underline">
                    <FiExternalLink size={13} /> View full receipt
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-[14px] font-medium text-[#64748B] hover:bg-gray-50 transition"
                >
                  Close
                </button>
                {!confirmed.has(selected._id) && !selected.read && (
                  <button
                    onClick={() => handleConfirm(selected)}
                    disabled={confirming === selected._id}
                    className="flex-1 py-2.5 bg-[#00A63E] text-white rounded-xl text-[14px] font-semibold hover:bg-[#008236] transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {confirming === selected._id
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Confirming...</>
                      : <><FiCheck size={15} /> Confirm Receipt</>
                    }
                  </button>
                )}
                {(confirmed.has(selected._id) || selected.read) && (
                  <div className="flex-1 py-2.5 bg-[#F0FDF4] text-[#008236] rounded-xl text-[14px] font-semibold text-center">
                    ✅ Already Confirmed
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
